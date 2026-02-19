#!/usr/bin/env bash
set -euo pipefail

# This script is a helper reminder for setting DATABASE_URL locally.
# Vercel sets DATABASE_URL in the deployment environment automatically,
# but Prisma migrations run locally need it too.

echo "To run migrations locally, set DATABASE_URL to your Neon connection string."
echo
if command -v vercel >/dev/null 2>&1; then
  echo "You can pull env vars from Vercel via:"
  echo "  vercel env pull .env.local"
else
  echo "Option A (recommended): Install Vercel CLI and pull env vars:"
  echo "  npm i -g vercel"
  echo "  vercel login"
  echo "  vercel link"
  echo "  vercel env pull .env.local"
fi

echo
echo "Option B: Copy the Neon DATABASE_URL from Vercel -> Settings -> Env Vars"
echo "and set it in .env.local (keep .env.local uncommitted)."
