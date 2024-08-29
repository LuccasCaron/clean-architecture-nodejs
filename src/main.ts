import dotenv from "dotenv";
dotenv.config();

import { ReadingRepositoryPrisma } from "./infra/repositories/reading.repository.prisma";
import { prisma } from "./lib/prisma";
import { GeminiReader } from "./services/gemini";
import { CreateReadingUsecase } from "./usecases/create-reading/create-reading.usecase";
import { CreateReadingRoute } from "./infra/api/express/routes/reading/create-reading.express.route";
import { ApiExpress } from "./infra/api/express/api.express";
import { ConfirmReadingUsecase } from "./usecases/confirm-reading/confirm-reading.usecase";
import { ConfirmReadingRoute } from "./infra/api/express/routes/reading/confirm-reading.express.route";
import { GetReadingUsecase } from "./usecases/get-readings/get-readings.usecase";
import { GetReadingRoute } from "./infra/api/express/routes/reading/get-readings.express.route";

function main() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

  const aRepository = ReadingRepositoryPrisma.create(prisma);
  const aGeminiReader = new GeminiReader(GEMINI_API_KEY);

  const createReadingUsecase = CreateReadingUsecase.create(
    aRepository,
    aGeminiReader
  );
  const confirmReadingUsecase = ConfirmReadingUsecase.create(aRepository);
  const getReadingsUsecase = GetReadingUsecase.create(aRepository);

  const createRoute = CreateReadingRoute.create(createReadingUsecase);
  const confirmRoute = ConfirmReadingRoute.create(confirmReadingUsecase);
  const getReadings = GetReadingRoute.create(getReadingsUsecase);

  const port = 3000;
  const api = ApiExpress.create([createRoute, confirmRoute, getReadings]);
  api.start(port);
}

main();
