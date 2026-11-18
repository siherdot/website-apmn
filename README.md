# Website APMN

Situs korporat PT Ade Putri Medical Nusantara. Project Next.js baru, bukan turunan template rumah sakit.

## Jalankan lokal

```bash
npm install
npm run dev
```

Produksi:

```bash
npm run build
npm start
```

## Isi

- `lib/content.ts`: identitas, menu, dan 20 halaman korporat.
- `app/[...slug]/page.tsx`: halaman statis dari `pages`.
- `app/sitemap.ts`, `app/robots.ts`: SEO dasar.
- `public/images/`: logo dan hero dari aset resmi APMN.

Warna mengikuti grup: `#0a6b12`, `#0b8f1b`, `#69c445`.

Belum ada deploy. Coolify/DNS hanya setelah perintah eksplisit.
