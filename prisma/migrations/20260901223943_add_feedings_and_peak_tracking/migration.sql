-- CreateEnum
CREATE TYPE "AromaProfile" AS ENUM ('FRUITY', 'ALCOHOLIC', 'ACIDIC', 'BALANCED');

-- CreateTable
CREATE TABLE "feedings" (
    "id" TEXT NOT NULL,
    "starterId" TEXT NOT NULL,
    "ratio" TEXT NOT NULL,
    "starterWeightG" DOUBLE PRECISION NOT NULL,
    "waterWeightG" DOUBLE PRECISION NOT NULL,
    "flourWeightG" DOUBLE PRECISION NOT NULL,
    "totalWeightG" DOUBLE PRECISION NOT NULL,
    "ambientTempC" DOUBLE PRECISION NOT NULL,
    "estimatedPeakMinutes" INTEGER NOT NULL,
    "estimatedPeakTime" TIMESTAMP(3) NOT NULL,
    "actualPeakTime" TIMESTAMP(3),
    "actualDurationMin" INTEGER,
    "growthMultiplier" DOUBLE PRECISION,
    "aromaProfile" "AromaProfile",
    "notes" TEXT,
    "fedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "feedings" ADD CONSTRAINT "feedings_starterId_fkey" FOREIGN KEY ("starterId") REFERENCES "starters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
