import Link from "next/link";
import { canonicLinks, navGroups, site } from "@/lib/content";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-in">
          <div>
            <h1>{site.short}</h1>
            <p>{site.tagline}</p>
            <Link className="tombol" href="/sekilas-apmn">
              Kenali APMN
            </Link>
          </div>
          <img src="/images/hero-apmn.webp" alt="Layanan kesehatan APMN" width={700} height={393} />
        </div>
      </section>
      <section className="bagian">
        <div className="wrap">
          <h2 className="judul">Jelajahi APMN</h2>
          <p className="subjudul">Profil perseroan, tata kelola, kinerja, dan informasi rumah sakit grup.</p>
          <div className="kartu">
            {navGroups.map((g) => (
              <div key={g.label}>
                <h3>{g.label}</h3>
                {g.items.slice(0, 4).map((i) => (
                  <p key={i.slug}>
                    <Link href={`/${i.slug}`}>{i.judul}</Link>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bagian lembut">
        <div className="wrap">
          <h2 className="judul">Rumah Sakit Grup</h2>
          <p className="subjudul">Jaringan rumah sakit di bawah naungan Bidadari Group.</p>
          <div className="kartu">
            {canonicLinks.map((r) => (
              <a key={r.url} href={r.url} target="_blank" rel="noreferrer">
                <h3>{r.nama}</h3>
                <p>{r.url.replace("https://", "")}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
