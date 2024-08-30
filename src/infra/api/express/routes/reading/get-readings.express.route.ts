import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { ReadingsNotFound } from "../../../../../utils/errors/app-errors";
import {
  GetReadingInputDto,
  GetReadingOutputDto,
  GetReadingUsecase,
  MeasuresResponse,
} from "../../../../../usecases/get-readings/get-readings.usecase";
import { MeasureType } from "../../../../../domain/entity/reading.domain";
import { z } from "zod";

const measureTypeSchema = z
  .enum([MeasureType.WATER, MeasureType.GAS])
  .optional();

export type GetReadingReponseDto = {
  customer_code: string;
  measures: MeasuresResponse;
};

export class GetReadingRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly getReadingUsecase: GetReadingUsecase
  ) {}

  public static create(getReadingUsecase: GetReadingUsecase) {
    return new GetReadingRoute(
      "/:customer_code/list",
      HttpMethod.GET,
      getReadingUsecase
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      try {
        const { customer_code } = request.params;

        const { measure_type } = request.query;

        const measureType = measureTypeSchema.parse(measure_type);

        const input: GetReadingInputDto = {
          customer_code,
          measure_type: measureType,
        };

        const output: GetReadingOutputDto =
          await this.getReadingUsecase.execute(input);

        response.status(200).json(output);
      } catch (error: any) {
        if (error instanceof ReadingsNotFound) {
          response
            .status(error.statusCode)
            .json({ error_code: "MEASURES_NOT_FOUND", error: error.message });
        } else if (error instanceof z.ZodError) {
          response.status(400).json({
            error_code: "INVALID_TYPE",
            error_description: "Tipo de medição não permitida",
          });
        } else {
          console.log("error: ", error);

          response.status(500).json({ error: "An unexpected error occurred." });
        }
      }
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }
}
