import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openRouterChat } from "@/lib/openrouter";
import { isPassedRubric } from "@/lib/progression";

function clamp15(n: number) {
  return Math.max(1, Math.min(5, Math.round(n)));
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { runId } = await params;

  const run = await prisma.simulationRun.findFirst({
    where: { id: runId, userId },
    include: {
      scenario: true,
      messages: { orderBy: { createdAt: "asc" } },
      rubric: true,
    },
  });

  if (!run) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const transcript = run.messages
    .map((m: { role: string; text: string }) =>
      `${m.role === "bot" ? "Kunde" : "Vertrieb"}: ${m.text}`
    )
    .join("\n");

  const system = `Du bist ein Sales-Coach und bewertest ein Outbound-Rollenspiel.\n\nBewerte NUR anhand des Transkripts und gib ein JSON-Objekt zurück.\n\nRubrik (1-5): pitch, discovery, objections, closing, tone\nZusätzlich: strengths (array), improvements (array), summary (string), nextFocus (string).\n\nGib ausschließlich gültiges JSON zurück, ohne Markdown.`;

  const user = `Szenario: ${run.scenario.title}\nGoal: ${run.scenario.goal}\nLevel: ${run.level}\n\nTranskript:\n${transcript}`;

  const { content } = await openRouterChat({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.2,
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(content) as unknown;
  } catch {
    return NextResponse.json(
      { error: "invalid_json_from_model", raw: content },
      { status: 502 }
    );
  }

  const obj = (parsed ?? {}) as Record<string, unknown>;

  const pitch = clamp15(Number(obj.pitch));
  const discovery = clamp15(Number(obj.discovery));
  const objections = clamp15(Number(obj.objections));
  const closing = clamp15(Number(obj.closing));
  const tone = clamp15(Number(obj.tone));

  const passed = isPassedRubric({ pitch, discovery, objections, closing, tone });

  await prisma.runRubric.upsert({
    where: { runId },
    update: { pitch, discovery, objections, closing, tone },
    create: { runId, pitch, discovery, objections, closing, tone },
  });

  await prisma.simulationRun.update({
    where: { id: runId },
    data: {
      evaluatedAt: new Date(),
      passed,
    },
  });

  return NextResponse.json({
    ok: true,
    rubric: { pitch, discovery, objections, closing, tone },
    passed,
    feedback: {
      strengths: Array.isArray(obj.strengths) ? (obj.strengths as unknown[]) : [],
      improvements: Array.isArray(obj.improvements) ? (obj.improvements as unknown[]) : [],
      summary: typeof obj.summary === "string" ? obj.summary : "",
      nextFocus: typeof obj.nextFocus === "string" ? obj.nextFocus : "",
    },
  });
}
