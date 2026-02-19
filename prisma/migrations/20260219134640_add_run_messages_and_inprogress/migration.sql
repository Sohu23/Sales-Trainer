-- AlterEnum
ALTER TYPE "SimulationStatus" ADD VALUE 'inProgress';

-- AlterTable
ALTER TABLE "SimulationRun" ALTER COLUMN "status" SET DEFAULT 'inProgress';

-- CreateTable
CREATE TABLE "RunMessage" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RunMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RunMessage_runId_createdAt_idx" ON "RunMessage"("runId", "createdAt");

-- AddForeignKey
ALTER TABLE "RunMessage" ADD CONSTRAINT "RunMessage_runId_fkey" FOREIGN KEY ("runId") REFERENCES "SimulationRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
