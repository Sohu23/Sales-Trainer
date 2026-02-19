import { cookies } from "next/headers";
import Link from "next/link";
import { AppNav } from "@/components/Nav";
// Auth handled via cookie check (mock, replace later)
import { mockProgress, mockRuns, mockScenarios } from "@/lib/mockData";
import { redirect } from "next/navigation";

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-slate-300">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold text-white">{children}</h2>;
}

export default async function DashboardPage() {
  const jar = await cookies();
  const authed = jar.get("st_logged_in")?.value === "1";
  if (!authed) redirect("/login");

  const { callsCompleted, avgRating, trainingHours, conversionLiftPct } =
    mockProgress;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AppNav />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-300">
              Dein Trainingsfortschritt auf einen Blick.
            </p>
          </div>
          <Link
            href="#start"
            className="inline-flex w-fit rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Neue Simulation starten
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Calls abgeschlossen" value={String(callsCompleted)} />
          <StatCard title="Ø Rating" value={`${avgRating.toFixed(1)}/5`} />
          <StatCard title="Training (Stunden)" value={trainingHours.toFixed(1)} />
          <StatCard title="Conversion Lift" value={`${conversionLiftPct}%`} />
        </div>

        <section className="mt-10">
          <SectionTitle>Skills verbessert</SectionTitle>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {mockProgress.skillsImproved.map((s) => (
              <div
                key={s.name}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="text-sm font-medium">{s.name}</div>
                <div className="mt-2 text-xs text-slate-300">Fortschritt</div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${Math.min(100, s.deltaPct)}%` }}
                  />
                </div>
                <div className="mt-2 text-sm text-slate-200">+{s.deltaPct}%</div>
              </div>
            ))}
          </div>
        </section>

        <section id="start" className="mt-10">
          <SectionTitle>Neue Outbound Call Simulation</SectionTitle>
          <p className="mt-1 text-sm text-slate-300">
            Wähle ein Szenario (Mock). Voice-Realtime kommt als nächster Schritt.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
            {mockScenarios.map((sc) => (
              <div
                key={sc.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="text-xs text-slate-300">{sc.difficulty}</div>
                <div className="mt-1 text-base font-semibold">{sc.title}</div>
                <div className="mt-2 text-sm text-slate-200">
                  <div>
                    <span className="text-slate-400">Persona:</span> {sc.persona}
                  </div>
                  <div>
                    <span className="text-slate-400">Ziel:</span> {sc.goal}
                  </div>
                  <div>
                    <span className="text-slate-400">Dauer:</span> {sc.durationMin} min
                  </div>
                </div>
                <Link
                  href={`/demo?scenario=${encodeURIComponent(sc.id)}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15"
                >
                  Starten
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <SectionTitle>Letzte Simulationen</SectionTitle>
          <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
            <div className="grid grid-cols-12 bg-white/5 px-4 py-3 text-xs text-slate-300">
              <div className="col-span-5">Szenario</div>
              <div className="col-span-3">Ergebnis</div>
              <div className="col-span-2">Rating</div>
              <div className="col-span-2">Zeit</div>
            </div>
            {mockRuns.map((r) => {
              const sc = mockScenarios.find((s) => s.id === r.scenarioId);
              return (
                <div
                  key={r.id}
                  className="grid grid-cols-12 border-t border-white/10 px-4 py-3 text-sm"
                >
                  <div className="col-span-5 font-medium">{sc?.title ?? r.scenarioId}</div>
                  <div className="col-span-3 text-slate-200">{r.result}</div>
                  <div className="col-span-2 text-slate-200">{r.rating}/5</div>
                  <div className="col-span-2 text-slate-400">
                    {new Date(r.startedAt).toLocaleString("de-DE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </div>
                  <div className="col-span-12 mt-2 text-xs text-slate-300">
                    {r.notes}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
