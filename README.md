# AIoT Portfolio — Full Stack CRUD

Modern minimalist white-theme portfolio for a professional **AIoT Engineer**.

Public site + admin panel (full create / edit / delete) for:

- Profile (name, photo, bio, links)
- Working experience
- Bootcamp experience
- Projects (case studies)
- Project stakeholders + logos
- Problem statement + technology solution points
- Documentation cards
- Visualization cards
- Skills

Built for **Vercel** deploy.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Prisma 6** + SQLite (local) / PostgreSQL (production)
- **JWT cookie auth** for admin
- **Zod** validation on API routes

## Quick start (local)

```bash
cd portfolio-aiot
npm install
# .env already included for local SQLite — copy from .env.example if needed
npx prisma db push
npm run db:seed
npm run dev
```

Open:

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

Default admin (from seed / `.env`):

```
email: admin@portfolio.local
password: admin123
```

**Change these before any public deploy.**

## Public pages

| Route | Content |
|---|---|
| `/` | Hero (name + photo), experience, bootcamp, portfolio grid, skills, CTA |
| `/projects/[slug]` | Full case study: description, stakeholders, highlighted problem, tech solutions, docs, visualization cards |
| `/contact` | Contact channels from profile |

## Admin CRUD

| Route | Manages |
|---|---|
| `/admin` | Dashboard counts + quick actions |
| `/admin/profile` | Profile upsert |
| `/admin/experiences` | List / create / edit / delete |
| `/admin/bootcamps` | List / create / edit / delete |
| `/admin/projects` | Projects + nested stakeholders, docs, visualizations |
| `/admin/skills` | Inline add / edit / delete |

All write APIs require an authenticated admin session cookie.

## Deploy to Vercel

### 1) Database (recommended: Neon free Postgres)

1. Create a Neon project → copy connection string.
2. In `prisma/schema.prisma`, switch provider:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Point `DATABASE_URL` at Postgres and run:

```bash
npx prisma db push
npm run db:seed
```

### 2) Push repo + import on Vercel

```bash
git init
git add .
git commit -m "Initial AIoT portfolio"
# create GitHub repo, push, then Import on vercel.com
```

### 3) Vercel environment variables

Set in Project → Settings → Environment Variables:

| Key | Value |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Long random string |
| `ADMIN_EMAIL` | Your admin email |
| `ADMIN_PASSWORD` | Strong password (used only if you re-seed) |

Build command (already in `package.json`):

```
prisma generate && next build
```

After first deploy, seed the production DB once (from your machine with prod `DATABASE_URL`), or create content via `/admin` after manually inserting an admin row.

### SQLite note

SQLite (`file:./dev.db`) is perfect for local demo. **Do not use SQLite on Vercel** — filesystem is ephemeral. Use Neon / Supabase / Vercel Postgres for production.

## Project structure

```
portfolio-aiot/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── page.tsx                 # home
│   │   ├── contact/
│   │   ├── projects/[slug]/
│   │   ├── admin/                   # CRUD UI
│   │   └── api/                     # REST CRUD + auth
│   ├── components/
│   ├── lib/                         # prisma, auth, data helpers
│   └── middleware.ts                # protect /admin + write APIs
└── public/
```

## Customize content

1. Login to `/admin`
2. Edit **Profile** (name, photo URL, title)
3. Add real experiences / bootcamps
4. Create projects → open each project to attach stakeholders, docs, viz cards
5. Replace Unsplash placeholders with your own image URLs

## License

Private portfolio use — adapt freely.
