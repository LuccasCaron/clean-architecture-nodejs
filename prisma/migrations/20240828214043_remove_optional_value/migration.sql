/*
  Warnings:

  - Made the column `value` on table `Reading` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reading" ALTER COLUMN "value" SET NOT NULL;
