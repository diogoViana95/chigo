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
- After schema changes, regenerate the client and update the database with the appropriate Prisma command. `npm run db:setup` applies the schema and seeds initial records; `npm run db:seed` only seeds.
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
