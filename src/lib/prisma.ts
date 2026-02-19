import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Neon: pooled connection string (has `-pooler` in hostname) for runtime.
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  // This module is used on the server only.
  // In development you may not have env vars loaded. Fail with a clear error.
  throw new Error(
    "DATABASE_URL is not set (expected pooled Neon URL for runtime)."
  );
}

// Neon docs recommend passing the connection string directly to the adapter.
const adapter = new PrismaNeon({ connectionString });

// Avoid exhausting connections during dev hot-reload
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
