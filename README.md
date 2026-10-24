# rio-portfolio

Website portfolio software engineer — Next.js 16 (App Router), Tailwind CSS 4, TypeScript, Prisma + SQLite.

## Konten

| Apa | Diatur di |
| --- | --- |
| Daftar project (portfolio) | `/admin` |
| Email, telepon, lokasi, pesan kontak, link sosial | `/admin/contact` |
| Nama, tagline, about, skills, experience | [`src/data/profile.ts`](src/data/profile.ts) |

Login admin memakai satu password dari env `ADMIN_PASSWORD`. Session disimpan di cookie
HttpOnly yang ditandatangani dengan `SESSION_SECRET` (berlaku 7 hari).

## Konfigurasi

Salin `.env.example` ke `.env`, lalu isi:

```bash
ADMIN_PASSWORD="password-yang-kuat"
SESSION_SECRET="$(openssl rand -base64 32)"   # minimal 32 karakter
PORTFOLIO_API_KEY="$(openssl rand -hex 32)"   # opsional, untuk POST /api/projects
```

`docker compose` membaca `ADMIN_PASSWORD` dan `SESSION_SECRET` dari `.env` dan menolak start
kalau keduanya kosong.

Cookie admin bertanda `Secure` di production. Itu tetap jalan di `http://localhost`, tapi kalau
admin diakses lewat HTTP biasa di alamat lain (misalnya IP LAN), set `COOKIE_SECURE=false`.
Untuk server publik, pasang HTTPS dan biarkan default-nya.

## REST API

Base URL: `http://localhost:3005` (atau domain production).

### `GET /api/projects` — daftar portfolio (publik)

```bash
curl http://localhost:3005/api/projects
```

```json
{
  "projects": [
    {
      "id": "seed-tcg",
      "title": "TCG Collectors Platform",
      "description": "Marketplace and catalogue for ...",
      "tech": ["Laravel", "Next.js", "MySQL"],
      "href": null,
      "repo": null,
      "order": 0,
      "createdAt": "2026-10-24T05:01:51.000Z",
      "updatedAt": "2026-10-24T05:01:51.000Z"
    }
  ]
}
```

### `POST /api/projects` — tambah project (butuh API key)

Header: `Authorization: Bearer <PORTFOLIO_API_KEY>` dan `Content-Type: application/json`.

| Field | Tipe | Wajib | Aturan |
| --- | --- | --- | --- |
| `title` | string | ya | maks. 120 karakter |
| `description` | string | ya | maks. 1000 karakter |
| `tech` | string[] atau `"a, b"` | tidak | maks. 300 karakter total |
| `href` | string | tidak | URL `http(s)://` (link live) |
| `repo` | string | tidak | URL `http(s)://` (source code) |

```bash
curl -X POST http://localhost:3005/api/projects \
  -H "Authorization: Bearer $PORTFOLIO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title":"My CLI Tool","description":"A fast CLI for ...","tech":["Go","Cobra"],"repo":"https://github.com/me/tool"}'
```

Sukses → `201 {"project": {...}}`. Project baru ditaruh di urutan paling akhir dan langsung
tampil di website; urutannya bisa diatur ulang di `/admin`.

| Status | `error` | Arti |
| --- | --- | --- |
| 400 | `invalid_json` / `invalid_body` | body bukan JSON object |
| 401 | `unauthorized` | API key tidak ada / salah |
| 413 | `payload_too_large` | body > 16 KB |
| 415 | `unsupported_media_type` | bukan `application/json` |
| 422 | `validation_failed` | lihat `fields` untuk pesan per field |
| 503 | `api_disabled` | `PORTFOLIO_API_KEY` belum di-set di server |

## Docker

```bash
docker compose up -d --build     # http://localhost:3005, admin di /admin
docker compose down              # data tetap aman di volume db_data
APP_PORT=8080 docker compose up -d --build   # ganti port
```

Saat container start, `prisma migrate deploy` dijalankan otomatis. Database SQLite ada di volume
`db_data` (`/app/data/portfolio.db`). Migration pertama sudah berisi data contoh.

## Development lokal (tanpa Docker)

```bash
npm install
npx prisma migrate dev    # buat prisma/dev.db + data contoh
npm run dev               # http://localhost:3000
```
