import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SimulationStatus } from "@prisma/client";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const url = new URL(req.url);
  const scenarioId = url.searchParams.get("scenarioId");
  const levelRaw = url.searchParams.get("level") ?? "1";
  const level = Math.max(1, Math.min(3, Number(levelRaw) || 1));

  if (!scenarioId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Ensure shadow user exists
  await prisma.appUser.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });

  const run = await prisma.simulationRun.create({
    data: {
      userId,
      scenarioId,
      level,
      status: SimulationStatus.inProgress,
    },
    select: { id: true },
  });

  return NextResponse.redirect(new URL(`/simulate/${run.id}`, req.url));
}
