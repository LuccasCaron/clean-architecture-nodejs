import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import {
  CreateRadingOutputDto,
  CreateReadingInputDto,
  CreateReadingUsecase,
} from "../../../../../usecases/create-reading/create-reading.usecase";
import {
  ContentGenerationError,
  NumberExtractionError,
  ReadingAlreadyExistsError,
} from "../../../../../utils/errors/app-errors";
import { uploadImageBodySchema } from "../../../../../utils/validation.utils";
import { z } from "zod";

export type CreateReadingReponseDto = {
  measure_uuid: string;
  measure_value: number;
  image_url: string;
};

export class CreateReadingRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createReadingUseCase: CreateReadingUsecase
  ) {}

  public static create(createReadingUseCase: CreateReadingUsecase) {
    return new CreateReadingRoute(
      "/upload",
      HttpMethod.POST,
      createReadingUseCase
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      try {
        const validatedData = uploadImageBodySchema.parse(request.body);

        const { image, customer_code, measure_datetime, measure_type } =
          validatedData;

        const input: CreateReadingInputDto = {
          customer_code,
          measure_datetime,
          measure_type,
          image_base64: image,
        };

        const output: CreateRadingOutputDto =
          await this.createReadingUseCase.execute(input);

        const responseBody = this.present(output);

        response.status(200).json(responseBody);
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          response.status(400).json({
            error_code: "INVALID_DATA",
            error_description:
              "Os dados fornecidos no corpo da requisição são inválidos",
            details: error.errors.map((err) => ({
              path: err.path.join("."),
              message: err.message,
            })),
          });
        } else if (error instanceof ReadingAlreadyExistsError) {
          response
            .status(error.statusCode)
            .json({ error_code: "DOUBLE_REPORT", error: error.message });
        } else if (error instanceof ContentGenerationError) {
          response.status(error.statusCode).json({ error: error.message });
        } else if (error instanceof NumberExtractionError) {
          response.status(error.statusCode).json({ error: error.message });
        } else {
          console.log("error: ", error);

          response.status(500).json({ error: "An unexpected error occurred." });
        }
      }
    };
  }

  private present(output: CreateRadingOutputDto): CreateReadingReponseDto {
    return {
      image_url: output.image_url,
      measure_value: output.value,
      measure_uuid: output.id,
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }
}
