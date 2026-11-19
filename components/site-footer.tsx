import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { canonicLinks, site } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <Heading level={4}>{site.name}</Heading>
          <Text as="p" type="supporting" color="inherit">
            {site.address}
          </Text>
          <Text as="p" type="supporting" color="inherit">
            <Link href={`tel:${site.phone.replace(/[^0-9+]/g, "")}`} isStandalone>
              {site.phone}
            </Link>
          </Text>
          <Text as="p" type="supporting" color="inherit">
            <Link href={`mailto:${site.email}`} isStandalone>
              {site.email}
            </Link>
          </Text>
          <Text as="p" type="supporting" color="inherit">
            <Link href="/galeri" isStandalone>
              Galeri Foto
            </Link>
          </Text>
        </div>

        <div>
          <Heading level={4}>Informasi Investor</Heading>
          <Text as="p" type="supporting" color="inherit">
            <Link href="/prospektus" isStandalone>
              Prospektus
            </Link>
          </Text>
          <Text as="p" type="supporting" color="inherit">
            <Link href="/laporan-tahunan" isStandalone>
              Laporan Tahunan
            </Link>
          </Text>
          <Text as="p" type="supporting" color="inherit">
            <Link href="/keterbukaan-informasi" isStandalone>
              Keterbukaan Informasi
            </Link>
          </Text>
          <Text as="p" type="supporting" color="inherit">
            <Link href="/tata-kelola" isStandalone>
              Tata Kelola
            </Link>
          </Text>
        </div>

        <div>
          <Heading level={4}>Rumah Sakit Grup</Heading>
          {canonicLinks.map((hospital) => (
            <Text as="p" type="supporting" color="inherit" key={hospital.url}>
              <Link href={hospital.url} isStandalone isExternalLink target="_blank">
                {hospital.nama}
              </Link>
            </Text>
          ))}
        </div>
      </div>

      <div className="wrap footer-bottom">
        <Text type="supporting" color="inherit">
          © {new Date().getFullYear()} PT Ade Putri Medical Nusantara
        </Text>
        <Text type="supporting" color="inherit">
          Informasi publik perseroan
        </Text>
      </div>
    </footer>
  );
}
