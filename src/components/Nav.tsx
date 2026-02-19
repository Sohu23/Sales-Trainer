import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
};

const items: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/resources", label: "Ressourcen" },
];

export function AppNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
          Outbound Sales Trainer
        </Link>
        <nav className="flex items-center gap-2">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-white"
            >
              {it.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-md bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
          >
            Abmelden
          </Link>
        </nav>
      </div>
    </header>
  );
}
