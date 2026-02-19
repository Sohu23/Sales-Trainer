import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SimulationStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { runId } = await params;

  const run = await prisma.simulationRun.findFirst({
    where: { id: runId, userId },
    include: { rubric: true },
  });

  if (!run) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // For now we just close the run. Evaluation endpoint will set rubric + passed.
  const updated = await prisma.simulationRun.update({
    where: { id: runId },
    data: {
      status: SimulationStatus.completed,
      endedAt: new Date(),
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, runId: updated.id });
}
