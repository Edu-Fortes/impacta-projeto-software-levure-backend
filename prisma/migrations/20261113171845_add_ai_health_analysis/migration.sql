-- CreateTable
CREATE TABLE "health_analyses" (
    "id" TEXT NOT NULL,
    "starterId" TEXT NOT NULL,
    "healthScore" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "vigorObservation" TEXT NOT NULL,
    "acidityObservation" TEXT NOT NULL,
    "temperatureImpact" TEXT NOT NULL,
    "readyToBake" BOOLEAN NOT NULL,
    "bakingReason" TEXT NOT NULL,
    "recommendedRatio" TEXT NOT NULL,
    "flourTypeHint" TEXT NOT NULL,
    "targetAmbientTemp" TEXT NOT NULL,
    "recommendationsJson" JSONB NOT NULL,
    "analyzedFeedingsCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_analyses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "health_analyses" ADD CONSTRAINT "health_analyses_starterId_fkey" FOREIGN KEY ("starterId") REFERENCES "starters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
