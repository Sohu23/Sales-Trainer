import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SimulationStatus } from "@prisma/client";
import { openRouterChat } from "@/lib/openrouter";
import { buildCustomerSystemPrompt } from "@/lib/simPrompt";

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
    include: {
      scenario: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
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

  const level = Math.max(1, Math.min(3, run.level || 1));

  const system = buildCustomerSystemPrompt({
    scenarioTitle: run.scenario.title,
    persona: run.scenario.persona,
    goal: run.scenario.goal,
    level,
  });

  // Build chat history (last N messages)
  const history = run.messages.slice(-20).map((m) => ({
    role: m.role === "bot" ? ("assistant" as const) : ("user" as const),
    content: m.text,
  }));

  let botText = "";
  try {
    const { content } = await openRouterChat({
      messages: [
        { role: "system", content: system },
        ...history,
        { role: "user", content: text },
      ],
      temperature: 0.7,
    });
    botText = content.trim();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown_error";
    return NextResponse.json(
      {
        error: "openrouter_failed",
        detail: msg.slice(0, 500),
      },
      { status: 502 }
    );
  }

  await prisma.runMessage.create({
    data: {
      runId,
      role: "bot",
      text: botText,
    },
  });

  return NextResponse.json({ reply: botText });
}
