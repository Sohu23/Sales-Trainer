import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/Nav";

function card(title: string, value: string) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-slate-300">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

export default async function RunResultPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const { runId } = await params;

  const run = await prisma.simulationRun.findFirst({
    where: { id: runId, userId },
    include: { scenario: true, rubric: true },
  });

  if (!run) redirect("/dashboard");

  const r = run.rubric;

  let summary = "";
  let nextFocus = "";
  try {
    const parsed = run.notes
      ? (JSON.parse(run.notes) as Record<string, unknown>)
      : null;
    summary = typeof parsed?.summary === "string" ? (parsed.summary as string) : "";
    nextFocus =
      typeof parsed?.nextFocus === "string" ? (parsed.nextFocus as string) : "";
  } catch {
    // ignore
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-slate-300">Ergebnis</div>
          <div className="mt-1 text-xl font-semibold">
            {run.passed ? "✅ Bestanden" : "❌ Nicht bestanden"}
          </div>
          <div className="mt-2 text-sm text-slate-200">
            <div>
              <span className="text-slate-400">Szenario:</span> {run.scenario.title}
            </div>
            <div>
              <span className="text-slate-400">Level:</span> {run.level}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {card("Gesamtscore", run.overallRating ? `${run.overallRating}/5` : "–")}
          {card("Status", run.passed ? "Pass" : "Fail")}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Rubrik (1–5)</h2>
          {!r ? (
            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
              Noch keine Auswertung vorhanden.
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {card("Pitch", `${r.pitch}/5`)}
              {card("Discovery", `${r.discovery}/5`)}
              {card("Einwände", `${r.objections}/5`)}
              {card("Closing", `${r.closing}/5`)}
              {card("Tonalität", `${r.tone}/5`)}
            </div>
          )}
        </div>

        {(summary || nextFocus) && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100">
            {summary && (
              <div>
                <div className="text-xs font-semibold text-slate-300">Kurzfazit</div>
                <div className="mt-1 whitespace-pre-wrap">{summary}</div>
              </div>
            )}
            {nextFocus && (
              <div className="mt-4">
                <div className="text-xs font-semibold text-slate-300">Nächstes Fokus-Thema</div>
                <div className="mt-1 whitespace-pre-wrap">{nextFocus}</div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <a
            href={`/simulate/${run.id}`}
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
          >
            Zurück zum Chat
          </a>
          <a
            href="/dashboard"
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Zum Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}
