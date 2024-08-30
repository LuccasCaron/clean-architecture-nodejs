import { MeasureType, Reading } from "../../domain/entity/reading.domain";
import { ReadingGateway } from "../../domain/gateway/reading.gateway";
import { Usecase } from "../usecase";
import { ReadingsNotFound } from "../../utils/errors/app-errors";

export type GetReadingInputDto = {
  customer_code: string;
  measure_type?: MeasureType;
};

export type MeasuresResponse = {
  measure_uui: string;
  measure_datetime: Date;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
};

export type GetReadingOutputDto = {
  customer_code: string;
  measures: MeasuresResponse[];
};

export class GetReadingUsecase
  implements Usecase<GetReadingInputDto, GetReadingOutputDto>
{
  private constructor(private readonly readingGateway: ReadingGateway) {}

  public static create(readingGateway: ReadingGateway) {
    return new GetReadingUsecase(readingGateway);
  }

  public async execute({
    customer_code,
    measure_type,
  }: GetReadingInputDto): Promise<GetReadingOutputDto> {
    const readings = await this.readingGateway.list(
      customer_code,
      measure_type
    );
    if (!readings || readings.length === 0) {
      throw new ReadingsNotFound();
    }

    return {
      customer_code,
      measures: readings.map((reading) => ({
        measure_uui: reading.id,
        measure_datetime: reading.measure_datetime,
        measure_type: reading.measure_type,
        has_confirmed: reading.confirmed,
        image_url: reading.image_url,
      })),
    };
  }
}
