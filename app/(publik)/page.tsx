import Link from "next/link";
import { canonicLinks, site } from "@/lib/content";
import { listPublishedReports } from "@/lib/reports";
import type { Report } from "@/lib/report-types";

export const dynamic = "force-dynamic";

function DocRow({ report }: { report: Report }) {
  const inner = (
    <>
      <span className="meta">{report.category}</span>
      <span className="title">{report.title}</span>
      <span className="go">→</span>
    </>
  );
  return report.url.startsWith("/")
    ? <Link className="docrow" href={report.url} key={report.id}>{inner}</Link>
    : <a className="docrow" href={report.url} key={report.id} target="_blank" rel="noreferrer">{inner}</a>;
}

function MiniDoc({ report }: { report: Report }) {
  return report.url.startsWith("/")
    ? <li><Link href={report.url}><span>{report.title}</span> →</Link></li>
    : <li><a href={report.url} target="_blank" rel="noreferrer"><span>{report.title}</span> →</a></li>;
}

export default async function Home() {
  const reports = await listPublishedReports();
  return (
    <>
      <section className="masthead">
        <div className="wrap masthead-in">
          <div>
            <p className="eyebrow">PT Ade Putri Medical Nusantara</p>
            <h1>
              Layanan kesehatan yang mudah, cepat, dan <em>setara.</em>
            </h1>
            <p className="lead">
              Kami mengelola fasilitas pelayanan kesehatan dengan prinsip tata kelola yang
              baik, transparan, dan akuntabel — untuk pasien, mitra, dan pemangku kepentingan.
            </p>
            <div className="actions">
              <Link className="btn" href="/prospektus">
                Baca Prospektus <span className="arrow">→</span>
              </Link>
              <Link className="textlink" href="/tata-kelola">
                Lihat Tata Kelola
              </Link>
            </div>
          </div>
          <aside className="masthead-side" aria-label="Akses cepat">
            <p className="side-label">Akses cepat</p>
            <ol className="quick">
              <li><Link href="/sekilas-apmn"><span>01</span> Profil Perseroan</Link></li>
              <li><Link href="/tata-kelola"><span>02</span> Tata Kelola</Link></li>
              <li><Link href="/keterbukaan-informasi"><span>03</span> Kinerja &amp; Informasi</Link></li>
            </ol>
            <div className="doc-panel">
              <h3>Dokumen utama</h3>
              <ul>
                {reports.slice(0, 3).map((report) => <MiniDoc report={report} key={report.id} />)}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Ringkasan</p>
              <h2>Perseroan</h2>
            </div>
            <p>
              Gambaran singkat fokus usaha, portofolio, dan prinsip yang mendasari
              pengelolaan perseroan.
            </p>
          </div>
          <div className="facts">
            <div className="fact">
              <span className="n">01 / Fokus usaha</span>
              <h3>Pengelolaan kesehatan</h3>
              <p>
                Mengelola rumah sakit serta mengembangkan layanan spesialis dan penunjang
                medis.
              </p>
            </div>
            <div className="fact">
              <span className="n">02 / Portofolio</span>
              <h3>RSU Putri Bidadari</h3>
              <p>
                Fasilitas utama perseroan di Kabupaten Langkat, Sumatera Utara, dengan
                layanan rawat jalan, rawat inap, dan gawat darurat.
              </p>
            </div>
            <div className="fact">
              <span className="n">03 / Tata kelola</span>
              <h3>Transparan &amp; akuntabel</h3>
              <p>
                Pengawasan Dewan Komisaris, pengelolaan Direksi, serta komite pendukung
                dalam pengambilan keputusan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Dokumen</p>
              <h2>Investor Relations</h2>
            </div>
            <p>
              Prospektus, laporan tahunan, tata kelola, dan keterbukaan informasi dalam
              satu tempat.
            </p>
          </div>
          <div className="doclist">
            {reports.map((report) => <DocRow report={report} key={report.id} />)}
            {reports.length === 0 && (
              <p className="ir-empty">Dokumen investor akan ditampilkan setelah tersedia.</p>
            )}
          </div>
          <p className="ir-contact">
            Pertanyaan investor:{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
      </section>

      <section className="network">
        <div className="wrap network-in">
          <div>
            <h2>Jaringan Rumah Sakit Grup</h2>
            <p>
              Informasi layanan, fasilitas, dan jadwal dokter tersedia melalui situs resmi
              masing-masing rumah sakit.
            </p>
          </div>
          <div className="network-links">
            {canonicLinks.map((r) => (
              <a className="cta" href={r.url} key={r.url} target="_blank" rel="noreferrer">
                {r.nama} →
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
