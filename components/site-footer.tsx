import Link from "next/link";
import { canonicLinks, site } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap footer-grid">
        <div>
          <h4>{site.name}</h4>
          <p>{site.address}</p>
          <p>
            <a href={`tel:${site.phone.replace(/[^0-9+]/g, "")}`}>{site.phone}</a>
          </p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div>
          <h4>Informasi Investor</h4>
          <p><Link href="/prospektus">Prospektus</Link></p>
          <p><Link href="/laporan-tahunan">Laporan Tahunan</Link></p>
          <p><Link href="/keterbukaan-informasi">Keterbukaan Informasi</Link></p>
          <p><Link href="/tata-kelola">Tata Kelola</Link></p>
        </div>
        <div>
          <h4>Rumah Sakit Grup</h4>
          {canonicLinks.map((r) => (
            <p key={r.url}>
              <a href={r.url} target="_blank" rel="noreferrer">{r.nama}</a>
            </p>
          ))}
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} PT Ade Putri Medical Nusantara</span>
        <span>Informasi publik perseroan</span>
      </div>
    </footer>
  );
}
