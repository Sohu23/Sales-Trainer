import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/Nav";
// Auth handled via cookie check (mock, replace later)
import { mockTips, SalesTip } from "@/lib/mockData";

function TipCard({ tip }: { tip: SalesTip }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs text-slate-300">{tip.category}</div>
      <div className="mt-1 text-base font-semibold text-white">{tip.title}</div>
      <p className="mt-2 text-sm text-slate-200">{tip.body}</p>
      <div className="mt-3 rounded-lg bg-white/5 p-3 text-sm">
        <div className="text-xs font-semibold text-slate-300">Takeaway</div>
        <div className="mt-1 text-slate-100">{tip.takeaway}</div>
      </div>
    </div>
  );
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams?: { q?: string; cat?: string };
}) {
  const jar = await cookies();
  const authed = jar.get("st_logged_in")?.value === "1";
  if (!authed) redirect("/login");

  const q = (searchParams?.q ?? "").toLowerCase().trim();
  const cat = (searchParams?.cat ?? "").trim();

  const categories = Array.from(new Set(mockTips.map((t) => t.category))).sort();

  const filtered = mockTips.filter((t) => {
    const matchesQ =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.body.toLowerCase().includes(q) ||
      t.takeaway.toLowerCase().includes(q);
    const matchesCat = !cat || t.category === cat;
    return matchesQ && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AppNav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight">Ressourcen</h1>
        <p className="mt-1 text-sm text-slate-300">
          Nützliche Tipps, Patterns und Formulierungen für Outbound Sales.
        </p>

        <form className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-6">
          <input
            name="q"
            defaultValue={searchParams?.q ?? ""}
            placeholder="Suche (z.B. Einwand, Discovery, Next Step…)"
            className="sm:col-span-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            name="cat"
            defaultValue={searchParams?.cat ?? ""}
            className="sm:col-span-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Alle Kategorien</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="sm:col-span-6 w-fit rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400"
          >
            Filtern
          </button>
        </form>

        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
            Keine Treffer. Versuch’s mit einem anderen Suchbegriff.
          </div>
        )}
      </main>
    </div>
  );
}
