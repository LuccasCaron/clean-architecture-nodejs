import { MeasureType } from "../../domain/entity/reading.domain";
import { ReadingGateway } from "../../domain/gateway/reading.gateway";
import { Usecase } from "../usecase";
import {
  ReadingNotFoundError,
  DuplicateReadingError,
} from "../../utils/errors/app-errors";

export type ConfirmReadingInputDto = {
  readingId: string;
  confirmed_value: number;
};

export type ConfirmRadingOutputDto = {
  success: boolean;
};

export class ConfirmReadingUsecase
  implements Usecase<ConfirmReadingInputDto, ConfirmRadingOutputDto>
{
  private constructor(private readonly readingGateway: ReadingGateway) {}

  public static create(readingGateway: ReadingGateway) {
    return new ConfirmReadingUsecase(readingGateway);
  }

  public async execute({
    readingId,
    confirmed_value,
  }: ConfirmReadingInputDto): Promise<ConfirmRadingOutputDto> {
    const updateStatus = await this.readingGateway.update(
      readingId,
      confirmed_value
    );

    if (updateStatus === "NOT_FOUND") {
      throw new ReadingNotFoundError();
    }

    if (updateStatus === "DUPLICATE") {
      throw new DuplicateReadingError();
    }

    return { success: true };
  }
}
