import Link from "next/link";
import { canonicLinks, site } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <h4>{site.name}</h4>
          <p>{site.address}</p>
        </div>
        <div>
          <h4>Kontak</h4>
          <p>{site.phone}</p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div>
          <h4>Rumah Sakit Grup</h4>
          {canonicLinks.map((r) => (
            <p key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer">
                {r.nama}
              </a>
            </p>
          ))}
        </div>
        <div>
          <h4>Halaman</h4>
          <p>
            <Link href="/sekilas-apmn">Sekilas APMN</Link>
          </p>
          <p>
            <Link href="/tata-kelola">Tata Kelola</Link>
          </p>
          <p>
            <Link href="/kontak">Kontak</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
