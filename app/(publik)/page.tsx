import Link from "next/link";
import { site } from "@/lib/content";

const docs = [
  { meta: "Investor", title: "Prospektus", href: "/prospektus" },
  { meta: "Tahunan", title: "Laporan Tahunan", href: "/laporan-tahunan" },
  { meta: "Tata kelola", title: "Piagam Komite Audit", href: "/piagam-komite-audit" },
  { meta: "Kinerja", title: "Kebijakan Dividen", href: "/dividen" },
  { meta: "Publik", title: "Keterbukaan Informasi", href: "/keterbukaan-informasi" },
];

export default function Home() {
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
                <li><Link href="/prospektus"><span>Prospektus</span> →</Link></li>
                <li><Link href="/laporan-tahunan"><span>Laporan Tahunan</span> →</Link></li>
                <li><Link href="/piagam-komite-audit"><span>Piagam Komite Audit</span> →</Link></li>
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
            {docs.map((d) => (
              <Link className="docrow" href={d.href} key={d.href}>
                <span className="meta">{d.meta}</span>
                <span className="title">{d.title}</span>
                <span className="go">→</span>
              </Link>
            ))}
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
              RSU Putri Bidadari.
            </p>
          </div>
          <a className="cta" href={site.rsUrl} target="_blank" rel="noreferrer">
            Kunjungi situs RSU →
          </a>
        </div>
      </section>
    </>
  );
}
