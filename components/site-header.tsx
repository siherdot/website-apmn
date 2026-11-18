import Link from "next/link";
import { navGroups } from "@/lib/content";

export default function SiteHeader() {
  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span>PT Ade Putri Medical Nusantara</span>
          <Link href="/kontak">Kontak Perseroan</Link>
        </div>
      </div>
      <header className="site">
        <div className="wrap bar">
          <Link href="/" className="brand">
            <img src="/images/logo-apmn.png" alt="Logo APMN" width={38} height={38} />
            <span className="brand-text">
              <b>APMN</b>
              <small>Ade Putri Medical Nusantara</small>
            </span>
          </Link>
          <nav className="main" aria-label="Navigasi utama">
            {navGroups.map((g) => (
              <details key={g.label}>
                <summary>{g.label}</summary>
                <div className="drop">
                  {g.items.map((i) => (
                    <Link key={i.slug} href={`/${i.slug}`}>
                      {i.judul}
                    </Link>
                  ))}
                </div>
              </details>
            ))}
          </nav>
          <Link className="header-cta" href="/prospektus">
            Investor Relations
          </Link>
        </div>
      </header>
    </>
  );
}
