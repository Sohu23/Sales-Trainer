"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Msg = {
  id: string;
  role: "user" | "bot";
  text: string;
  createdAt: string;
};

type MessageResponse = {
  reply?: string;
  detail?: string;
  error?: string;
};

type EvaluateResponse = {
  passed?: boolean;
  rubric?: {
    pitch: number;
    discovery: number;
    objections: number;
    closing: number;
    tone: number;
  };
  feedback?: {
    summary?: string;
    nextFocus?: string;
  };
  error?: string;
};

export default function SimClient({
  runId,
  initialMessages,
}: {
  runId: string;
  initialMessages: Msg[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [text, setText] = useState("");
  const [busySend, setBusySend] = useState(false);
  const [busyEval, setBusyEval] = useState(false);
  const busy = busySend || busyEval;

  const sorted = useMemo(
    () => [...messages].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [messages]
  );

  async function fetchJson<T>(
    input: RequestInfo,
    init: RequestInit & { timeoutMs?: number } = {}
  ): Promise<{ res: Response; data: T }> {
    const { timeoutMs = 20000, ...rest } = init;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(input, { ...rest, signal: controller.signal });
      const data = (await res.json().catch(() => ({}))) as T;
      return { res, data };
    } finally {
      clearTimeout(id);
    }
  }

  async function send() {
    const t = text.trim();
    if (!t || busySend || busyEval) return;

    setBusySend(true);

    const optimistic: Msg = {
      id: `tmp-${Date.now()}`,
      role: "user",
      text: t,
      createdAt: new Date().toISOString(),
    };

    setMessages((m) => [...m, optimistic]);
    setText("");

    try {
      const { res, data } = await fetchJson<MessageResponse>(`/api/simulate/${runId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
        timeoutMs: 30000,
      });

      if (!res.ok || !data.reply) {
        throw new Error(data.detail || data.error || `HTTP ${res.status}`);
      }

      const bot: Msg = {
        id: `bot-${Date.now()}`,
        role: "bot",
        text: data.reply,
        createdAt: new Date().toISOString(),
      };

      setMessages((m) => [...m, bot]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `err-${Date.now()}`,
          role: "bot",
          text: "Fehler beim Senden. Bitte nochmal versuchen.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setBusySend(false);
    }
  }

  async function finishAndEvaluate() {
    if (busyEval || busySend) return;
    setBusyEval(true);
    try {
      // Finish
      await fetchJson<unknown>(`/api/simulate/${runId}/finish`, { method: "POST", timeoutMs: 20000 });
      // Evaluate
      const { res, data } = await fetchJson<EvaluateResponse>(`/api/simulate/${runId}/evaluate`, {
        method: "POST",
        timeoutMs: 60000,
      });
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      const rubric = data?.rubric;
      const passed = data?.passed;
      const summary = data?.feedback?.summary;
      const nextFocus = data?.feedback?.nextFocus;

      const textParts = [
        `Auswertung: ${passed ? "✅ Bestanden" : "❌ Nicht bestanden"}`,
        rubric
          ? `Rubrik (1-5): Pitch ${rubric.pitch}, Discovery ${rubric.discovery}, Einwände ${rubric.objections}, Closing ${rubric.closing}, Tonalität ${rubric.tone}`
          : "",
        summary ? `Kurzfazit: ${summary}` : "",
        nextFocus ? `Nächstes Fokus-Thema: ${nextFocus}` : "",
      ].filter(Boolean);

      setMessages((m) => [
        ...m,
        {
          id: `eval-${Date.now()}`,
          role: "bot",
          text: textParts.join("\n"),
          createdAt: new Date().toISOString(),
        },
      ]);

      router.push(`/simulate/${runId}/result`);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `evalerr-${Date.now()}`,
          role: "bot",
          text: "Fehler bei Auswertung. Bitte später erneut versuchen.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setBusyEval(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5">
      <div className="max-h-[55vh] overflow-y-auto p-4">
        {sorted.length === 0 ? (
          <div className="text-sm text-slate-300">
            Starte den Call: Schreib deine Eröffnung.
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl bg-indigo-500 px-4 py-2 text-sm text-white"
                      : "max-w-[80%] rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-100"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="mb-2 flex items-center justify-between">
          <button
            onClick={() => void finishAndEvaluate()}
            disabled={busy}
            className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-400 disabled:opacity-60"
          >
            Beenden & Auswerten
          </button>
          <div className="text-xs text-slate-400">
            Success: Ø ≥ 3.5 & Closing ≥ 3
          </div>
        </div>

        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Deine Nachricht…"
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => void send()}
            disabled={busy}
            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:opacity-60"
          >
            Senden
          </button>
        </div>
      </div>
    </div>
  );
}
