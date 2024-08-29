import path from "path";

import { MeasureType, Reading } from "../../domain/entity/reading.domain";
import { ReadingGateway } from "../../domain/gateway/reading.gateway";
import {
  ContentGenerationError,
  NumberExtractionError,
  ReadingAlreadyExistsError,
} from "../../utils/errors/app-errors";
import { IGeminiReader } from "../../services/gemini";
import { saveBase64Image } from "../../utils/image.utils";
import { Usecase } from "../usecase";

export type CreateReadingInputDto = {
  customer_code: string;
  measure_type: MeasureType;
  measure_datetime: Date;
  image_base64: string;
};

export type CreateRadingOutputDto = {
  id: string;
  value: number;
  image_url: string;
};

export class CreateReadingUsecase
  implements Usecase<CreateReadingInputDto, CreateRadingOutputDto>
{
  private constructor(
    private readonly readingGateway: ReadingGateway,
    private readonly geminiService: IGeminiReader
  ) {}

  public static create(
    readingGateway: ReadingGateway,
    geminiService: IGeminiReader
  ) {
    return new CreateReadingUsecase(readingGateway, geminiService);
  }

  public async execute({
    customer_code,
    measure_type,
    measure_datetime,
    image_base64,
  }: CreateReadingInputDto): Promise<CreateRadingOutputDto> {
    const existReading = await this.readingGateway.checkExistReading(
      customer_code,
      measure_type,
      measure_datetime
    );

    if (existReading) {
      throw new ReadingAlreadyExistsError();
    }

    const directoryArchivesTemporary = path.join(__dirname, "../../temp");
    const fileDetails = saveBase64Image(
      image_base64,
      directoryArchivesTemporary,
      "temp_image.jpeg"
    );

    const uploadedFile = await this.geminiService.uploadImage(
      fileDetails.filePath,
      "image/jpeg",
      "Medidor Image"
    );

    const fileMetadata = await this.geminiService.getFileMetadata(
      uploadedFile.name
    );

    const content = await this.geminiService.generateContent(
      fileMetadata.uri,
      `Get the reading value for ${measure_type}`
    );

    if (content == null || content === "") {
      throw new ContentGenerationError();
    }

    const extractNumbersFromResponseGemini =
      content.match(/[-+]?[0-9]*\.?[0-9]+/);

    if (!extractNumbersFromResponseGemini) {
      throw new NumberExtractionError();
    }

    const measureValue = parseFloat(extractNumbersFromResponseGemini[0]);

    const aReading = Reading.create(
      customer_code,
      measure_type,
      measureValue,
      fileDetails.fileUrl
    );

    await this.readingGateway.save(aReading);

    const output: CreateRadingOutputDto = {
      id: aReading.id,
      value: aReading.value,
      image_url: aReading.image_url,
    };

    return output;
  }
}
