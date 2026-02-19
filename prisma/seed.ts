import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.scenario.upsert({
    where: { slug: "saas-cto-1" },
    update: {},
    create: {
      slug: "saas-cto-1",
      title: "SaaS für IT-Security",
      persona: "CTO (skeptisch, wenig Zeit)",
      difficulty: "Medium",
      durationMin: 8,
      goal: "Termin für Demo vereinbaren",
      industry: "SaaS",
    },
  });

  await prisma.scenario.upsert({
    where: { slug: "hr-lead-1" },
    update: {},
    create: {
      slug: "hr-lead-1",
      title: "HR Software",
      persona: "Head of HR (freundlich, aber unentschlossen)",
      difficulty: "Easy",
      durationMin: 6,
      goal: "Need & Timeline klären",
      industry: "HR Tech",
    },
  });

  await prisma.scenario.upsert({
    where: { slug: "procurement-1" },
    update: {},
    create: {
      slug: "procurement-1",
      title: "Procurement / Einkauf",
      persona: "Einkauf (preisfokussiert, hart)",
      difficulty: "Hard",
      durationMin: 10,
      goal: "Nächsten Step sichern trotz Preis-Einwand",
      industry: "Procurement",
    },
  });

  const skills = ["Pitch", "Discovery", "Einwandbehandlung", "Closing", "Tonalität"];
  for (const name of skills) {
    await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  await prisma.resourceTip.createMany({
    data: [
      {
        category: "ColdCalling",
        title: "Erster Satz: Kontext + Permission",
        body: "Starte mit Kontext und frag um Erlaubnis: \"Ich rufe kurz an wegen X — passt’s dir, wenn ich 30 Sekunden erkläre warum?\"",
        takeaway: "Permission-based opener reduziert Abwehr und erhöht Gesprächszeit.",
      },
      {
        category: "Discovery",
        title: "Von Problem zu Impact",
        body: "Wenn ein Problem genannt wird, geh sofort in Impact: \"Was passiert, wenn ihr das nicht löst?\" Dann quantifizieren: \"Wie oft / wie teuer / wie riskant?\".",
        takeaway: "Impact-Fragen schaffen Dringlichkeit und Budget-Rahmen.",
      },
      {
        category: "Einwandbehandlung",
        title: "Einwand = Information, nicht Ablehnung",
        body: "Reframe: \"Wenn du 'zu teuer' sagst, meinst du im Vergleich zu was?\" — erst Referenzrahmen klären.",
        takeaway: "Erst klären, dann argumentieren.",
      },
      {
        category: "Closing",
        title: "Immer ein konkreter Next Step",
        body: "Nie \"Ich schick dir was\". Immer zwei Optionen anbieten: \"Dienstag 10:00 oder Mittwoch 15:00?\".",
        takeaway: "Two-option close erhöht Verbindlichkeit.",
      },
      {
        category: "Mindset",
        title: "Pro Call 1 Lernziel",
        body: "Definiere vor jedem Call ein Micro-Goal (z.B. 2 Impact-Fragen). Danach kurzer Review.",
        takeaway: "Micro-Goals machen Fortschritt messbar.",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
