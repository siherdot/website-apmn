import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { listPhotos } from "@/lib/gallery";
import PhotoManager from "@/components/admin/photo-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Manajer Foto", robots: { index: false, follow: false } };

export default async function AdminPage() {
  await requireAdmin();
  const photos = await listPhotos();
  return <PhotoManager initialPhotos={photos} />;
}
