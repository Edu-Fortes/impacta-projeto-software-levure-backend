-- CreateEnum
CREATE TYPE "StarterStatus" AS ENUM ('HEALTHY', 'ATTENTION', 'NEW');

-- CreateTable
CREATE TABLE "starters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flourType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "status" "StarterStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "starters_pkey" PRIMARY KEY ("id")
);

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
    "fedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_diagnoses" (
    "id" TEXT NOT NULL,
    "starterId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "rating" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "observations" TEXT[],
    "tips" TEXT[],
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_diagnoses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "feedings" ADD CONSTRAINT "feedings_starterId_fkey" FOREIGN KEY ("starterId") REFERENCES "starters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_diagnoses" ADD CONSTRAINT "ai_diagnoses_starterId_fkey" FOREIGN KEY ("starterId") REFERENCES "starters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
