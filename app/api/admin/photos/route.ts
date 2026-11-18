import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { addPhoto, listPhotos } from "@/lib/gallery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ photos: await listPhotos() });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const title = String(form?.get("title") || "").trim();
  const category = String(form?.get("category") || "Dokumentasi").trim();

  if (!title) return NextResponse.json({ error: "Judul foto wajib diisi." }, { status: 422 });
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Pilih berkas foto terlebih dahulu." }, { status: 422 });
  }

  try {
    const photo = await addPhoto({
      title,
      category,
      caption: String(form?.get("caption") || "").trim(),
      published: form?.get("published") === "on",
      file: {
        name: file.name,
        mime: file.type,
        bytes: new Uint8Array(await file.arrayBuffer()),
      },
    });
    return NextResponse.json({ photo }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "GAGAL";
    if (message === "TIPE_FOTO") {
      return NextResponse.json({ error: "Format harus JPG, PNG, WebP, atau GIF." }, { status: 422 });
    }
    if (message === "UKURAN_FOTO") {
      return NextResponse.json({ error: "Ukuran maksimal 12 MB." }, { status: 422 });
    }
    throw error;
  }
}
