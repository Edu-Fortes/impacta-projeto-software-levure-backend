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
