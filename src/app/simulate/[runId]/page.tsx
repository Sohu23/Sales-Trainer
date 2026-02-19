import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AppNav } from "@/components/Nav";
import SimClient from "./sim-client";

export default async function SimulateRunPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const { runId } = await params;

  const run = await prisma.simulationRun.findFirst({
    where: { id: runId, userId },
    include: {
      scenario: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!run) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AppNav />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs text-slate-300">Szenario</div>
          <div className="mt-1 text-lg font-semibold">{run.scenario.title}</div>
          <div className="mt-2 text-sm text-slate-200">
            <div>
              <span className="text-slate-400">Persona:</span> {run.scenario.persona}
            </div>
            <div>
              <span className="text-slate-400">Ziel:</span> {run.scenario.goal}
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Status: {run.status}
          </div>
        </div>

        <div className="mt-4">
          <SimClient
            runId={run.id}
            initialMessages={run.messages
              .filter((m) => m.role === "user" || m.role === "bot")
              .map((m) => ({
                id: m.id,
                role: m.role as "user" | "bot",
                text: m.text,
                createdAt: m.createdAt.toISOString(),
              }))}
          />
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
          MVP: Bot-Antworten sind noch Platzhalter. Als nächstes koppeln wir ein LLM an und bauen die Rubrik-Auswertung.
        </div>
      </main>
    </div>
  );
}
