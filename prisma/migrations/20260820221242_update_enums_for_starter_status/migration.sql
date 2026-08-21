/*
  Warnings:

  - The values [HEALTHY,ATTENTION] on the enum `StarterStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StarterStatus_new" AS ENUM ('ACTIVE', 'FRIDGE', 'NEW');
ALTER TABLE "public"."starters" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "starters" ALTER COLUMN "status" TYPE "StarterStatus_new" USING ("status"::text::"StarterStatus_new");
ALTER TYPE "StarterStatus" RENAME TO "StarterStatus_old";
ALTER TYPE "StarterStatus_new" RENAME TO "StarterStatus";
DROP TYPE "public"."StarterStatus_old";
ALTER TABLE "starters" ALTER COLUMN "status" SET DEFAULT 'NEW';
COMMIT;
