-- Add level + evaluation fields for gamification
ALTER TABLE "SimulationRun" ADD COLUMN "level" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "SimulationRun" ADD COLUMN "passed" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SimulationRun" ADD COLUMN "evaluatedAt" TIMESTAMP(3);

-- Helpful indexes
CREATE INDEX "SimulationRun_userId_level_startedAt_idx" ON "SimulationRun"("userId", "level", "startedAt");
CREATE INDEX "SimulationRun_userId_passed_startedAt_idx" ON "SimulationRun"("userId", "passed", "startedAt");
