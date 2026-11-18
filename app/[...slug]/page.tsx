import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pages } from "@/lib/content";

type Props = { params: Promise<{ slug: string[] }> };

export function generateStaticParams() {
  return pages.map((p) => ({ slug: [p.slug] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = pages.find((p) => p.slug === slug.join("/"));
  return { title: page?.judul ?? "Halaman" };
}

export default async function Halaman({ params }: Props) {
  const { slug } = await params;
  const page = pages.find((p) => p.slug === slug.join("/"));
  if (!page) notFound();

  return (
    <article className="wrap halaman">
      <h1>{page.judul}</h1>
      <p className="pimpinan">{page.ringkas}</p>
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
              <p key={t.url} className="kotak">
                <a href={t.url} target="_blank" rel="noreferrer">
                  {t.teks} ↗
                </a>
              </p>
            ),
          )}
        </section>
      ))}
    </article>
  );
}
