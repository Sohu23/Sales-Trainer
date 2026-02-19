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
  const body = (await req.json().catch(() => null)) as null | { text?: string };
  const text = (body?.text ?? "").trim();
  if (!text) return NextResponse.json({ error: "missing_text" }, { status: 400 });

  const run = await prisma.simulationRun.findFirst({
    where: { id: runId, userId },
    include: { scenario: true },
  });

  if (!run) return NextResponse.json({ error: "not_found" }, { status: 404 });
  // Prisma enum type from generated client
  if (run.status !== SimulationStatus.inProgress) {
    return NextResponse.json({ error: "run_not_in_progress" }, { status: 409 });
  }

  // Store user message
  await prisma.runMessage.create({
    data: {
      runId,
      role: "user",
      text,
    },
  });

  // MVP: placeholder bot response. We'll replace with LLM integration.
  const botText = `Verstanden. Kurze Rückfrage: Was genau ist dir daran am wichtigsten – Zeitersparnis, Risiko-Reduktion oder Kosten?`;

  await prisma.runMessage.create({
    data: {
      runId,
      role: "bot",
      text: botText,
    },
  });

  return NextResponse.json({ reply: botText });
}
