import type { Metadata } from "next";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import GalleryView from "@/components/gallery-view";
import { listPublishedPhotos } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galeri Foto",
  description: "Dokumentasi fasilitas, gedung, dan prestasi PT Ade Putri Medical Nusantara.",
};

export default async function GaleriPage() {
  const photos = await listPublishedPhotos();

  return (
    <>
      <section className="gallery-intro">
        <div className="wrap">
          <Text type="supporting" weight="semibold" color="accent" className="eyebrow">
            Dokumentasi perseroan
          </Text>
          <Heading level={1}>Galeri Foto</Heading>
          <Text as="p" type="large" color="secondary">
            Arsip visual fasilitas, gedung, dan prestasi perseroan. Foto ditampilkan setelah
            ditinjau melalui dashboard admin.
          </Text>
        </div>
      </section>
      <GalleryView photos={photos} />
    </>
  );
}
