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

  const system = `Du bist ein Sales-Coach und bewertest ein Outbound-Rollenspiel.\n\nBewerte NUR anhand des Transkripts und gib ein JSON-Objekt zurück.\n\n1) Rubrik (1-5): pitch, discovery, objections, closing, tone\n\n2) SPIN (1-5 je Kategorie): spinSituation, spinProblem, spinImplication, spinNeedPayoff\n   + spinNotes (string)\n\n3) Sandler / Schmerz:\n   - painLevel (1-10) = wie stark der Kunde tatsächlich Schmerz/Dringlichkeit hat (aus dem Transkript abgeleitet)\n   - sandlerUpFrontContract (1-5)\n   - sandlerPainFunnel (1-5)\n   - sandlerNextSteps (1-5)\n   + sandlerNotes (string)\n\n4) BANT (1-5 je Dimension) + Notizen:\n   bantBudget, bantAuthority, bantNeed, bantTiming\n   bantNotes (string)\n\n5) Gesprächsfluss (nicht im Gesamtscore gewichten, nur analysieren):\n   - rapportScore (1-5)\n   - interrogationRisk (1-5) = wie stark es wie ein Verhör wirkt\n   - oneQuestionAtATime (1-5) = stellt der Vertriebler typischerweise nur eine Frage pro Turn?\n   - evidence (array of strings) = 3-5 konkrete Beispiele/Zitate aus dem Transkript\n\nZusätzlich: strengths (array), improvements (array), summary (string), nextFocus (string).\n\nGib ausschließlich gültiges JSON zurück, ohne Markdown.`;

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

  const avg = (pitch + discovery + objections + closing + tone) / 5;
  const overallRating = clamp15(avg);

  await prisma.simulationRun.update({
    where: { id: runId },
    data: {
      evaluatedAt: new Date(),
      passed,
      overallRating,
      // Store feedback in notes as JSON (MVP). Later we can normalize this.
      notes: JSON.stringify({
        summary: typeof obj.summary === "string" ? obj.summary : "",
        nextFocus: typeof obj.nextFocus === "string" ? obj.nextFocus : "",
        strengths: Array.isArray(obj.strengths) ? obj.strengths : [],
        improvements: Array.isArray(obj.improvements) ? obj.improvements : [],
      }),
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
