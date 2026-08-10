# Deploy & Run Documentation

## Prerequisites
- Node.js ≥ 20
- npm ≥ 10
- SQLite (local) or PostgreSQL (production)
- Vercel account (optional for cloud deploy)

## Local Development
1. Clone repo & install deps
   ```bash
   git clone <repo-url>
   cd portfolio-aiot
   npm install
   ```
2. Set up environment
   - Copy `.env.example` → `.env`
   - Ensure `DATABASE_URL=file:./dev.db` (SQLite default) or point to a local Postgres instance.
3. Push Prisma schema & seed data
   ```bash
   npx prisma db push      # create tables
   npm run db:seed         # populate admin, profile, experiences, etc.
   ```
4. Start dev server
   ```bash
   npm run dev
   ```
   Open <http://localhost:3000> (site) and <http://localhost:3000/admin/login> (admin).
   Default admin credentials (from seed):
   - **email:** admin@portfolio.local
   - **password:** admin123
   Change them after first login.

## Production Deploy (Vercel)
### 1️⃣ Database
- Recommended: Neon Postgres (free tier) or Vercel Postgres.
- Create Neon project → copy connection string.
- Edit `prisma/schema.prisma` datasource provider to `postgresql` (already shown in README).
- Set env var `DATABASE_URL` to Neon connection string in Vercel Settings → Environment Variables.
- Run schema migration and seed **once** from your machine:
  ```bash
  npx prisma db push                 # apply schema to Neon
  npm run db:seed                     # insert admin & starter data
  ```
  Alternatively, create content via the admin UI after deployment.

### 2️⃣ Vercel Import
```bash
git init
git add .
git commit -m "Initial AIoT portfolio"
# create GitHub repo, push
# Then in Vercel dashboard → New Project → Import Git repository.
```
Vercel will detect Next.js 15, install deps, and run the build command from `package.json`:
```
prisma generate && next build
```
### 3️⃣ Environment Variables (Vercel)
| Key            | Value                                 |
|----------------|---------------------------------------|
| DATABASE_URL   | Neon/Postgres connection string       |
| JWT_SECRET      | Long random string (e.g., `openssl rand -hex 32`)
| ADMIN_EMAIL     | Your admin email (optional)          |
| ADMIN_PASSWORD  | Strong password (used only for reseed)
```
### 4️⃣ Post‑Deploy Seeding
After first deploy, run the seed script locally pointing to the production DB:
```bash
export DATABASE_URL=<prod-connection-string>
npm run db:seed
```
or add a one‑off Vercel Build Hook that executes `npm run db:seed`.

## Running Locally in Production Mode
```bash
npm run build   # generate Prisma client & build Next.js
npm start       # runs compiled app on PORT 3000
```
Use same `.env` (with production `DATABASE_URL`) for testing.

## Security Notes
- **Never** use SQLite in Vercel; file system is transient.
- Rotate `JWT_SECRET` regularly.
- Change default admin credentials immediately after first launch.
- Store all secrets in Vercel Environment Variables (not in repo).

## Helpful Commands Summary
- `npm run db:push` – sync Prisma schema.
- `npm run db:seed` – insert seed data.
- `npm run dev` – start development server.
- `npm run build && npm start` – run production build.
- `npm run db:studio` – open Prisma Studio UI.

---
*Documentation generated on 2026‑08‑08.*