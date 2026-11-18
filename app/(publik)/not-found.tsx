import Link from "next/link";

export default function NotFound() {
  return (
    <article className="wrap halaman">
      <h1>Halaman tidak ditemukan</h1>
      <p className="pimpinan">Alamat yang Anda cari tidak tersedia.</p>
      <p>
        <Link href="/">Kembali ke beranda</Link>
      </p>
    </article>
  );
}
