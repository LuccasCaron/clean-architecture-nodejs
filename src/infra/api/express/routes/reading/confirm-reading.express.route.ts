import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import {
  DuplicateReadingError,
  ReadingNotFoundError,
} from "../../../../../utils/errors/app-errors";
import { confirmReadingBodySchema } from "../../../../../utils/validation.utils";
import { z } from "zod";
import {
  ConfirmRadingOutputDto,
  ConfirmReadingInputDto,
  ConfirmReadingUsecase,
} from "../../../../../usecases/confirm-reading/confirm-reading.usecase";

export type ConfirmReadingReponseDto = {
  success: boolean;
};

export class ConfirmReadingRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly confirmReadingUsecase: ConfirmReadingUsecase
  ) {}

  public static create(confirmReadingUsecase: ConfirmReadingUsecase) {
    return new ConfirmReadingRoute(
      "/confirm",
      HttpMethod.PATCH,
      confirmReadingUsecase
    );
  }

  public getHandler() {
    return async (request: Request, response: Response): Promise<void> => {
      try {
        const { measure_uuid, confirmed_value } =
          confirmReadingBodySchema.parse(request.body);

        const input: ConfirmReadingInputDto = {
          readingId: measure_uuid,
          confirmed_value,
        };

        const output: ConfirmRadingOutputDto =
          await this.confirmReadingUsecase.execute(input);

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
        } else if (error instanceof ReadingNotFoundError) {
          response
            .status(error.statusCode)
            .json({ error_code: "MEASURE_NOT_FOUND", error: error.message });
        } else if (error instanceof DuplicateReadingError) {
          response.status(error.statusCode).json({
            error_code: "CONFIRMATION_DUPLICATE",
            error: error.message,
          });
        } else {
          response.status(500).json({ error: "An unexpected error occurred." });
        }
      }
    };
  }

  private present(output: ConfirmRadingOutputDto): ConfirmReadingReponseDto {
    return {
      success: output.success,
    };
  }

  getPath(): string {
    return this.path;
  }

  getMethod(): HttpMethod {
    return this.method;
  }
}
