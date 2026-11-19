import type { Metadata } from "next";
import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { notFound } from "next/navigation";
import { navGroups, pages } from "@/lib/content";
import { listPublishedReports } from "@/lib/reports";

type Props = { params: Promise<{ slug: string[] }> };

export const dynamic = "force-dynamic";

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
  const reports = await listPublishedReports();
  const report = reports.find((r) => r.slug === page.slug);

  return (
    <div className="wrap">
      <nav className="crumb" aria-label="Lokasi halaman">
        <Link href="/" isStandalone>
          Beranda
        </Link>{" "}
        / {page.kelompok} /{" "}
        <Text as="span" weight="bold" color="accent">
          {page.judul}
        </Text>
      </nav>

      <div className="doc-layout">
        <aside className="doc-nav" aria-label="Navigasi halaman">
          {navGroups.map((group) => (
            <div className="doc-nav-group" key={group.label}>
              <Text type="supporting" weight="semibold" color="secondary">
                {group.label}
              </Text>
              <div className="doc-nav-links">
                {group.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${item.slug}`}
                    isStandalone
                    data-current={item.slug === page.slug ? "true" : undefined}
                    aria-current={item.slug === page.slug ? "page" : undefined}
                  >
                    {item.judul}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <article className="article">
          <Heading level={1}>{page.judul}</Heading>
          <Text as="p" type="large" color="secondary" className="ringkas">
            {page.ringkas}
          </Text>

          {report && report.url !== `/${page.slug}` && (
            <div className="callout managed">
              {report.url.startsWith("/") ? (
                <Link href={report.url} isStandalone>
                  Dokumen resmi: {report.title} →
                </Link>
              ) : (
                <Link
                  href={report.url}
                  isStandalone
                  isExternalLink
                  target="_blank"
                >
                  Dokumen resmi: {report.title}
                </Link>
              )}
              <Text as="span" type="supporting" color="secondary">
                {report.description || "Dokumen dikelola melalui dashboard admin."} Tautan
                diperbarui oleh admin perseroan.
              </Text>
            </div>
          )}

          {page.bagian.map((section) => (
            <section key={section.h}>
              <Heading level={2}>{section.h}</Heading>
              {section.p?.map((paragraph, index) => (
                <Text as="p" key={index}>
                  {paragraph}
                </Text>
              ))}
              {section.li && (
                <ul>
                  {section.li.map((item, index) => (
                    <li key={index}>
                      <Text>{item}</Text>
                    </li>
                  ))}
                </ul>
              )}
              {section.taut
                ?.filter((link) => !(report && !link.url.startsWith("/")))
                .map((link) =>
                  link.url.startsWith("/") ? (
                    <Text as="p" key={link.url}>
                      <Link href={link.url} isStandalone>
                        {link.teks} →
                      </Link>
                    </Text>
                  ) : (
                    <div className="callout" key={link.url}>
                      <Link href={link.url} isStandalone isExternalLink target="_blank">
                        {link.teks}
                      </Link>
                      <Text as="span" type="supporting" color="secondary">
                        Tautan resmi eksternal. Dokumen dibuka di tab baru.
                      </Text>
                    </div>
                  ),
                )}
            </section>
          ))}

          <Link className="back-link" href="/" isStandalone>
            ← Kembali ke beranda
          </Link>
        </article>
      </div>
    </div>
  );
}
