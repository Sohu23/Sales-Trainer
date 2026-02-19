import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UNLOCK_REQUIREMENTS } from "@/lib/progression";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const counts = await prisma.simulationRun.groupBy({
    by: ["level", "scenarioId"],
    where: {
      userId,
      passed: true,
      status: "completed",
    },
    _count: { _all: true },
  });

  // Count distinct scenarios passed per level
  const distinctByLevel = new Map<number, number>();
  for (const row of counts) {
    distinctByLevel.set(row.level, (distinctByLevel.get(row.level) || 0) + 1);
  }

  const passedL1 = distinctByLevel.get(1) || 0;
  const passedL2 = distinctByLevel.get(2) || 0;

  const unlock2 = passedL1 >= UNLOCK_REQUIREMENTS.level2.distinctScenarios;
  const unlock3 = passedL2 >= UNLOCK_REQUIREMENTS.level3.distinctScenarios;

  return NextResponse.json({
    passedDistinct: { level1: passedL1, level2: passedL2 },
    unlocked: { level2: unlock2, level3: unlock3 },
    requirements: UNLOCK_REQUIREMENTS,
  });
}
