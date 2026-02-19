import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  const mod = await import("../src/lib/prisma");
  const prisma = mod.prisma;
  const result = await prisma.scenario.count();
  console.log({ scenarioCount: result });
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
