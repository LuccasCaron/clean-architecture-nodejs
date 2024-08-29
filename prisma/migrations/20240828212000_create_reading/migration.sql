-- CreateEnum
CREATE TYPE "MeasureType" AS ENUM ('WATER', 'GAS');

-- CreateTable
CREATE TABLE "Reading" (
    "id" TEXT NOT NULL,
    "customerCode" TEXT NOT NULL,
    "measureDatetime" TIMESTAMP(3) NOT NULL,
    "measureType" "MeasureType" NOT NULL,
    "value" DOUBLE PRECISION,
    "imageUrl" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "unique_reading_index" ON "Reading"("customerCode", "measureDatetime", "measureType");
