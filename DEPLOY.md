# Deploy ke Vercel

## Kenapa SQLite tidak bisa di Vercel
Vercel adalah platform serverless — filesystem-nya tidak persistent. File `.db` akan hilang setiap cold start. Solusinya: pakai **Neon** (PostgreSQL serverless gratis).

---

## Langkah 1 — Buat database di Neon

1. Buka [console.neon.tech](https://console.neon.tech) → Sign up gratis
2. Klik **New Project** → beri nama (misal: `portfolio-aiot`)
3. Pilih region terdekat (Singapore untuk Asia Tenggara)
4. Setelah project dibuat, buka tab **Connection Details**
5. Catat dua URL:
   - **Pooled connection** → untuk `DATABASE_URL` (pakai `pgbouncer=true`)
   - **Direct connection** → untuk `DIRECT_URL`

Format URL Neon:
```
# Pooled (untuk DATABASE_URL):
postgresql://USER:PASS@ep-xxx-yyy.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15

# Direct (untuk DIRECT_URL):
postgresql://USER:PASS@ep-xxx-yyy.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

---

## Langkah 2 — Set Environment Variables di Vercel

Buka **Vercel Dashboard → Project → Settings → Environment Variables**, tambahkan:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Pooled connection URL dari Neon |
| `DIRECT_URL` | Direct connection URL dari Neon |
| `JWT_SECRET` | String random minimal 32 karakter |
| `ADMIN_EMAIL` | Email untuk login admin |
| `ADMIN_PASSWORD` | Password admin |
| `BLOB_READ_WRITE_TOKEN` | (Opsional) Token Vercel Blob untuk upload gambar |

> **JWT_SECRET** bisa dibuat dengan: `openssl rand -base64 32`

---

## Langkah 3 — Setup Vercel Blob (untuk upload gambar)

Tanpa Blob, form admin tetap bisa pakai URL eksternal (paste URL gambar dari internet).
Untuk upload file langsung dari admin:

1. Vercel Dashboard → **Storage** → **Create Database** → pilih **Blob**
2. Beri nama → **Create**
3. Connect ke project portfolio → copy `BLOB_READ_WRITE_TOKEN`
4. Tambahkan ke Environment Variables Vercel

---

## Langkah 4 — Push schema ke Neon

Jalankan sekali dari lokal setelah set env production:

```powershell
# Set DATABASE_URL sementara ke Neon URL
$env:DATABASE_URL="postgresql://USER:PASS@HOST/neondb?sslmode=require"
$env:DIRECT_URL="postgresql://USER:PASS@HOST/neondb?sslmode=require"

# Push schema (buat semua tabel di Neon)
npx prisma db push

# Buat akun admin pertama
npx prisma db seed
```

Atau pakai file `.env.production.local` (tidak di-commit):
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="..."
ADMIN_EMAIL="admin@domain.com"
ADMIN_PASSWORD="password"
```

Lalu:
```powershell
npx dotenv -e .env.production.local -- npx prisma db push
npx dotenv -e .env.production.local -- npx prisma db seed
```

---

## Langkah 5 — Deploy

```powershell
git add .
git commit -m "migrate to postgresql for vercel"
git push
```

Vercel akan otomatis build dan deploy.

---

## Langkah 6 — Verifikasi

1. Buka URL Vercel → pastikan homepage load
2. Buka `/admin/login` → login dengan `ADMIN_EMAIL` dan `ADMIN_PASSWORD`
3. Tambah profile, experience, dll dari dashboard admin

---

## Troubleshooting

**Error: `DATABASE_URL` not found**
→ Pastikan env var sudah di-set di Vercel dan sudah re-deploy setelah set.

**Error: `url must start with protocol file:`**
→ Nilai `DATABASE_URL` masih format SQLite (`file:./dev.db`). Ganti dengan URL PostgreSQL dari Neon.

**Error: `prepared statement already exists`**
→ Pastikan `DATABASE_URL` menggunakan URL pooled (dengan `pgbouncer=true`) bukan direct URL.

**Upload gambar tidak berfungsi**
→ Tanpa `BLOB_READ_WRITE_TOKEN`, upload filesystem tidak tersedia di Vercel. Gunakan URL gambar eksternal atau setup Vercel Blob.

**Data lokal tidak muncul di production**
→ Database Neon kosong. Jalankan `prisma db seed` dengan `DIRECT_URL` mengarah ke Neon.

---

## Local Development (tetap pakai SQLite)

File `.env` lokal tetap menggunakan:
```env
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"
```

Prisma otomatis detect SQLite dari prefix `file:` dan PostgreSQL dari prefix `postgresql://`.
