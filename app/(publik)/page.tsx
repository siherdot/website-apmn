import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { canonicLinks, site } from "@/lib/content";
import { listPublishedReports } from "@/lib/reports";
import type { Report } from "@/lib/report-types";

export const dynamic = "force-dynamic";

function reportHref(report: Report) {
  return report.url || `/${report.slug || ""}`;
}

function DocRow({ report }: { report: Report }) {
  const href = reportHref(report);
  const external = href.startsWith("http") || href.startsWith("www.");
  const content = (
    <>
      <Badge label={report.category} variant="green" />
      <Text type="label" weight="semibold" className="doc-row-title">
        {report.title}
      </Text>
      <Text type="body" color="accent" aria-hidden="true">
        →
      </Text>
    </>
  );

  return external ? (
    <Link className="doc-row" href={href} isStandalone isExternalLink target="_blank">
      {content}
    </Link>
  ) : (
    <Link className="doc-row" href={href} isStandalone>
      {content}
    </Link>
  );
}

function MiniDoc({ report }: { report: Report }) {
  const href = reportHref(report);
  const external = href.startsWith("http") || href.startsWith("www.");
  return (
    <li>
      {external ? (
        <Link href={href} isStandalone isExternalLink target="_blank">
          {report.title}
        </Link>
      ) : (
        <Link href={href} isStandalone>
          {report.title}
        </Link>
      )}
    </li>
  );
}

export default async function Home() {
  const reports = await listPublishedReports();

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <Text type="supporting" weight="semibold" color="accent" className="eyebrow">
              PT Ade Putri Medical Nusantara
            </Text>
            <Heading level={1} className="hero-title">
              Layanan kesehatan yang mudah, cepat, dan <em>setara.</em>
            </Heading>
            <Text as="p" type="large" color="secondary" className="hero-lead">
              Kami mengelola fasilitas pelayanan kesehatan dengan prinsip tata kelola yang
              baik, transparan, dan akuntabel — untuk pasien, mitra, dan pemangku kepentingan.
            </Text>
            <div className="hero-actions">
              <Button
                href="/prospektus"
                label="Baca Prospektus"
                variant="primary"
                size="md"
              >
                Baca Prospektus <span aria-hidden="true">→</span>
              </Button>
              <Link href="/tata-kelola" isStandalone>
                Lihat Tata Kelola
              </Link>
            </div>
          </div>

          <aside className="side-panel" aria-label="Akses cepat">
            <Text type="supporting" weight="semibold" color="secondary" className="side-label">
              Akses cepat
            </Text>
            <ol className="quick-list">
              <li>
                <Link href="/sekilas-apmn" isStandalone>
                  <Text type="supporting" color="accent">
                    01
                  </Text>
                  Profil Perseroan
                </Link>
              </li>
              <li>
                <Link href="/tata-kelola" isStandalone>
                  <Text type="supporting" color="accent">
                    02
                  </Text>
                  Tata Kelola
                </Link>
              </li>
              <li>
                <Link href="/keterbukaan-informasi" isStandalone>
                  <Text type="supporting" color="accent">
                    03
                  </Text>
                  Kinerja &amp; Informasi
                </Link>
              </li>
            </ol>
            <div className="mini-doc-panel">
              <Heading level={3}>Dokumen utama</Heading>
              <ul className="mini-docs">
                {reports.slice(0, 3).map((report) => (
                  <MiniDoc report={report} key={report.id} />
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="page-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Text type="supporting" weight="semibold" color="accent" className="eyebrow">
                Ringkasan
              </Text>
              <Heading level={2}>Perseroan</Heading>
            </div>
            <Text as="p" color="secondary">
              Gambaran singkat fokus usaha, portofolio, dan prinsip yang mendasari
              pengelolaan perseroan.
            </Text>
          </div>
          <div className="fact-grid">
            <div className="fact-card">
              <Text type="supporting" color="accent" weight="semibold">
                01 / Fokus usaha
              </Text>
              <Heading level={3}>Pengelolaan kesehatan</Heading>
              <Text as="p" color="secondary">
                Mengelola rumah sakit serta mengembangkan layanan spesialis dan penunjang
                medis.
              </Text>
            </div>
            <div className="fact-card">
              <Text type="supporting" color="accent" weight="semibold">
                02 / Portofolio
              </Text>
              <Heading level={3}>RSU Putri Bidadari</Heading>
              <Text as="p" color="secondary">
                Fasilitas utama perseroan di Kabupaten Langkat, Sumatera Utara, dengan
                layanan rawat jalan, rawat inap, dan gawat darurat.
              </Text>
            </div>
            <div className="fact-card">
              <Text type="supporting" color="accent" weight="semibold">
                03 / Tata kelola
              </Text>
              <Heading level={3}>Transparan &amp; akuntabel</Heading>
              <Text as="p" color="secondary">
                Pengawasan Dewan Komisaris, pengelolaan Direksi, serta komite pendukung
                dalam pengambilan keputusan.
              </Text>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section muted">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Text type="supporting" weight="semibold" color="accent" className="eyebrow">
                Dokumen
              </Text>
              <Heading level={2}>Investor Relations</Heading>
            </div>
            <Text as="p" color="secondary">
              Prospektus, laporan tahunan, tata kelola, dan keterbukaan informasi dalam
              satu tempat.
            </Text>
          </div>
          <div className="doc-list">
            {reports.map((report) => (
              <DocRow report={report} key={report.id} />
            ))}
            {reports.length === 0 && (
              <Text as="p" color="secondary" className="ir-empty">
                Dokumen investor akan ditampilkan setelah tersedia.
              </Text>
            )}
          </div>
          <Text as="p" type="supporting" color="secondary" className="ir-contact">
            Pertanyaan investor:{" "}
            <Link href={`mailto:${site.email}`} isStandalone>
              {site.email}
            </Link>
          </Text>
        </div>
      </section>

      <section className="network-band">
        <div className="wrap network-inner">
          <div>
            <Heading level={2}>Jaringan Rumah Sakit Grup</Heading>
            <Text as="p" color="inherit">
              Informasi layanan, fasilitas, dan jadwal dokter tersedia melalui situs resmi
              masing-masing rumah sakit.
            </Text>
          </div>
          <div className="network-links">
            {canonicLinks.map((hospital) => (
              <Button
                key={hospital.url}
                href={hospital.url}
                target="_blank"
                label={hospital.nama}
                variant="secondary"
                size="sm"
              >
                {hospital.nama} <span aria-hidden="true">→</span>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
