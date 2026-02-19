export type ProgressStats = {
  callsCompleted: number;
  avgRating: number; // 1-5
  trainingHours: number;
  conversionLiftPct: number;
  skillsImproved: Array<{ name: string; deltaPct: number }>;
};

export type SimulationScenario = {
  id: string;
  title: string;
  persona: string;
  difficulty: "Easy" | "Medium" | "Hard";
  durationMin: number;
  goal: string;
};

export type SimulationRun = {
  id: string;
  scenarioId: string;
  startedAt: string;
  result: "Bestanden" | "Knapp" | "Nicht bestanden";
  rating: number; // 1-5
  notes: string;
};

export type SalesTip = {
  id: string;
  category:
    | "Cold Calling"
    | "Discovery"
    | "Einwandbehandlung"
    | "Closing"
    | "Mindset";
  title: string;
  body: string;
  takeaway: string;
};

export const mockProgress: ProgressStats = {
  callsCompleted: 12,
  avgRating: 3.9,
  trainingHours: 4.5,
  conversionLiftPct: 8,
  skillsImproved: [
    { name: "Struktur im Pitch", deltaPct: 18 },
    { name: "Einwandbehandlung", deltaPct: 12 },
    { name: "Fragetechnik", deltaPct: 9 },
  ],
};

export const mockScenarios: SimulationScenario[] = [
  {
    id: "saas-cto-1",
    title: "SaaS für IT-Security",
    persona: "CTO (skeptisch, wenig Zeit)",
    difficulty: "Medium",
    durationMin: 8,
    goal: "Termin für Demo vereinbaren",
  },
  {
    id: "hr-lead-1",
    title: "HR Software",
    persona: "Head of HR (freundlich, aber unentschlossen)",
    difficulty: "Easy",
    durationMin: 6,
    goal: "Need & Timeline klären",
  },
  {
    id: "procurement-1",
    title: "Procurement / Einkauf",
    persona: "Einkauf (preisfokussiert, hart)",
    difficulty: "Hard",
    durationMin: 10,
    goal: "Nächsten Step sichern trotz Preis-Einwand",
  },
];

export const mockRuns: SimulationRun[] = [
  {
    id: "run-001",
    scenarioId: "saas-cto-1",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    result: "Knapp",
    rating: 3,
    notes: "Guter Einstieg, aber zu wenig Discovery vor dem Pitch.",
  },
  {
    id: "run-002",
    scenarioId: "hr-lead-1",
    startedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    result: "Bestanden",
    rating: 4,
    notes: "Sauberer Call-Flow, nächstes Mal stärker auf Next Step drücken.",
  },
];

export const mockTips: SalesTip[] = [
  {
    id: "tip-cc-1",
    category: "Cold Calling",
    title: "Erster Satz: Kontext + Permission",
    body: "Starte mit einem klaren Kontext und frag um Erlaubnis: \"Ich rufe kurz an wegen X — passt’s dir, wenn ich 30 Sekunden erkläre warum?\" Das senkt Widerstand und hält dich strukturiert.",
    takeaway: "Permission-based opener reduziert Abwehr und erhöht Gesprächszeit.",
  },
  {
    id: "tip-dis-1",
    category: "Discovery",
    title: "Von Problem zu Impact",
    body: "Wenn ein Problem genannt wird, geh sofort in Impact: \"Was passiert, wenn ihr das nicht löst?\" Dann quantifizieren: \"Wie oft / wie teuer / wie riskant?\".",
    takeaway: "Impact-Fragen schaffen Dringlichkeit und Budget-Rahmen.",
  },
  {
    id: "tip-obj-1",
    category: "Einwandbehandlung",
    title: "Einwand = Information, nicht Ablehnung",
    body: "Reframe: \"Verstanden — wenn du \"zu teuer\" sagst, meinst du im Vergleich zu was?\" Dann klärst du den Referenzrahmen, statt zu verteidigen.",
    takeaway: "Erst Referenzrahmen klären, dann Value argumentieren.",
  },
  {
    id: "tip-close-1",
    category: "Closing",
    title: "Immer ein konkreter Next Step",
    body: "Nie \"Ich schick dir was\". Immer: \"Lass uns 20 Minuten blocken — Dienstag 10:00 oder Mittwoch 15:00?\".",
    takeaway: "Two-option close erhöht Verbindlichkeit.",
  },
  {
    id: "tip-ms-1",
    category: "Mindset",
    title: "Ziel: Lernen pro Call",
    body: "Definiere vor jedem Call 1 Lernziel (z.B. \"2 Impact-Fragen stellen\"). Danach kurzer Review: Hat’s geklappt? Das macht Training messbar.",
    takeaway: "Micro-Goals machen Fortschritt sichtbar und motivierend.",
  },
];
