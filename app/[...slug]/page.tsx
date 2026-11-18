import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { navGroups, pages } from "@/lib/content";

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return pages.map((p) => ({ slug: [p.slug] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = pages.find((p) => p.slug === slug.join("/"));
  return {
    title: page?.judul ?? "Halaman",
    description: page?.ringkas,
  };
}

export default async function Halaman({ params }: Props) {
  const { slug } = await params;
  const page = pages.find((p) => p.slug === slug.join("/"));
  if (!page) notFound();

  return (
    <div className="wrap">
      <nav className="crumb" aria-label="Lokasi halaman">
        <Link href="/">Beranda</Link> / {page.kelompok} / <span className="active">{page.judul}</span>
      </nav>
      <div className="doc-layout">
        <aside className="doc-nav" aria-label="Navigasi halaman">
          {navGroups.map((g) => (
            <div key={g.label}>
              <h2>{g.label}</h2>
              {g.items.map((i) => (
                <Link
                  key={i.slug}
                  href={`/${i.slug}`}
                  className={i.slug === page.slug ? "active" : undefined}
                  aria-current={i.slug === page.slug ? "page" : undefined}
                >
                  {i.judul}
                </Link>
              ))}
            </div>
          ))}
        </aside>
        <article className="article">
          <h1>{page.judul}</h1>
          <p className="ringkas">{page.ringkas}</p>
          {page.bagian.map((b) => (
            <section key={b.h}>
              <h2>{b.h}</h2>
              {b.p?.map((t, i) => <p key={i}>{t}</p>)}
              {b.li && (
                <ul>
                  {b.li.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              )}
              {b.taut?.map((t) =>
                t.url.startsWith("/") ? (
                  <p key={t.url}>
                    <Link href={t.url}>{t.teks} →</Link>
                  </p>
                ) : (
                  <div className="doc-callout" key={t.url}>
                    <a href={t.url} target="_blank" rel="noreferrer">
                      {t.teks} →
                    </a>
                    <small>Tautan resmi eksternal. Dokumen dibuka di tab baru.</small>
                  </div>
                ),
              )}
            </section>
          ))}
          <Link className="back" href="/">
            ← Kembali ke beranda
          </Link>
        </article>
      </div>
    </div>
  );
}
