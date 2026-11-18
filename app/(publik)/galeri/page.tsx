import type { Metadata } from "next";
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
          <p className="eyebrow">Dokumentasi perseroan</p>
          <h1>Galeri Foto</h1>
          <p className="lead">
            Arsip visual fasilitas, gedung, dan prestasi perseroan. Foto ditampilkan setelah
            ditinjau melalui dashboard admin.
          </p>
        </div>
      </section>
      <GalleryView photos={photos} />
    </>
  );
}
