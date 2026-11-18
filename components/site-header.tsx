import Link from "next/link";
import { navGroups } from "@/lib/content";

export default function SiteHeader() {
  return (
    <header>
      <div className="wrap bar">
        <Link href="/" className="brand">
          {/* ponto: logo asli APMN dipakai; teks dibawa terpisah karena file logo tanpa tipografi */}
          <img src="/images/logo-apmn.png" alt="Logo APMN" width={42} height={42} />
          <b>APMN</b>
        </Link>
        <nav aria-label="Navigasi utama">
          {navGroups.map((g) => (
            <details className="menu" key={g.label}>
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
      </div>
    </header>
  );
}
