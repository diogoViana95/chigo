# AGENTS.md

## Project overview

- This is the chigo. Creative Studio storefront and backoffice.
- Use Next.js App Router, React, TypeScript, Tailwind CSS, Auth.js Credentials and Prisma ORM with Prisma Postgres.
- Keep the public storefront minimal and aligned with the brand: near-black/white surfaces, violet-to-cyan accents, and responsive layouts.
- Public copy and customer-facing interface must support Portuguese and English. Preserve the existing language toggle and light/dark theme behavior.

## Data and Prisma

- The database is PostgreSQL hosted by Prisma Postgres. Do not switch it to SQLite or add a local database fallback.
- The Prisma schema is `prisma/schema.prisma`; Prisma CLI configuration is `prisma.config.ts`.
- Prisma Client is generated into `generated/prisma`. Import it from `@/generated/prisma/client` in app code.
- Runtime queries use `@prisma/adapter-ppg` and the server-side `DATABASE_URL` connection string.
- Never print, commit, or expose `.env` values. `.env` and `.env.local` are secrets and must remain ignored by Git.
- The current dev database was initially created with `db push`; the Prisma Migrate baseline has not yet been established. Before enabling automatic deploy migrations, create and review a baseline for that existing database without resetting it, then mark the baseline as applied on that dev database. A new, empty production database must apply the baseline normally.
- After the baseline exists, use Prisma Migrate for every schema change intended to be shared or deployed: run `npx prisma migrate dev --name <descriptive_name>`, review the generated SQL, and commit both `prisma/schema.prisma` and the new `prisma/migrations/` directory. Do not use `db push` for production or for changes that need an automatic deployment history.
- Deploy environments apply committed migrations with `npx prisma migrate deploy`. The planned Vercel Build Command is `npx prisma migrate deploy && npm run build`; it still needs to be configured in Vercel. Use separate `DATABASE_URL` values for Preview and Production.
- `npm run db:setup` currently uses `db push` and seeds initial records; treat it only as a bootstrap command until the migration baseline/workflow is established. `npm run db:seed` only seeds.
- Seed data provides the initial admin and example products. Avoid resetting existing credentials or data on subsequent seeds.

## Storefront and backoffice

- The public homepage is statically generated with ISR (`revalidate = 3600`). Backoffice product mutations that affect the homepage must call `revalidatePath('/')`.
- Keep customer orders as contact requests. Do not add online payment processing unless the user asks for it.
- Protect all backoffice pages and server actions with Auth.js session checks. Hash passwords with bcrypt, enforce the first-login password change for newly seeded/created users, and keep credentials out of client bundles.
- Backoffice pages must remain `noindex` and excluded from `robots.txt` and the public sitemap.
- Validate server-side all customer inputs, order items, and prices. Treat client-provided values as untrusted; calculate totals from database records.

## Commands

- `npm run dev` starts the local development server.
- `npm run build` generates Prisma Client and builds the production app.
- `npm run db:setup` applies the current schema and seeds an initial admin and catalog.

Keep dependencies and Prisma packages compatible with the versions in `package.json`. Update this file if the project stack or workflows materially change.
