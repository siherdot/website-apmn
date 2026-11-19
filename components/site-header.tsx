import { Button } from "@astryxdesign/core/Button";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { navGroups } from "@/lib/content";

export default function SiteHeader() {
  return (
    <>
      <div className="top-strip">
        <div className="wrap">
          <Text type="supporting">PT Ade Putri Medical Nusantara</Text>
          <Link href="/kontak" isStandalone>
            Kontak Perseroan
          </Link>
        </div>
      </div>

      <header className="site-header-wrap">
        <div className="wrap site-bar">
          <Link href="/" className="brand-lockup">
            <img src="/images/logo-apmn.png" alt="Logo APMN" width={40} height={40} />
            <span>
              <Text type="label" weight="bold">
                APMN
              </Text>
              <Text type="supporting">Ade Putri Medical Nusantara</Text>
            </span>
          </Link>

          <div className="nav-area">
            <nav aria-label="Navigasi utama" className="nav-menu">
              <Link href="/" isStandalone>
                Beranda
              </Link>
              {navGroups.map((group) => (
                <details key={group.label}>
                  <summary>{group.label}</summary>
                  <div className="nav-dropdown">
                    {group.items.map((item) => (
                      <Link key={item.slug} href={`/${item.slug}`} isStandalone>
                        {item.judul}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
            </nav>
          </div>

          <Button
            href="/prospektus"
            label="Hubungan Investor"
            variant="primary"
            size="sm"
          />
        </div>
      </header>
    </>
  );
}
