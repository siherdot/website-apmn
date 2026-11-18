import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://adeputrimedicalnusantara.co.id"),
  title: { default: "APMN — PT Ade Putri Medical Nusantara", template: "%s | APMN" },
  description: "Berkomitmen menghadirkan layanan kesehatan yang mudah, cepat, dan setara.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "PT Ade Putri Medical Nusantara",
    title: "APMN — PT Ade Putri Medical Nusantara",
    description: "Berkomitmen menghadirkan layanan kesehatan yang mudah, cepat, dan setara.",
    images: ["/images/og-apmn.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
