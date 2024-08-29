import { MeasureType, Reading } from "../../domain/entity/reading.domain";
import { ReadingGateway } from "../../domain/gateway/reading.gateway";
import { Usecase } from "../usecase";
import { ReadingsNotFound } from "../../utils/errors/app-errors";

export type GetReadingInputDto = {
  customer_code: string;
  measure_type?: MeasureType;
};

export type GetReadingOutputDto = {
  customer_code: string;
  measures: Reading[];
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
      measures: readings,
    };
  }
}
