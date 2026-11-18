import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { addReport, listReports } from "@/lib/reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ reports: await listReports() });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const title = String(form?.get("title") || "").trim();
  const url = String(form?.get("url") || "").trim();

  if (!title) return NextResponse.json({ error: "Judul laporan wajib diisi." }, { status: 422 });

  try {
    const report = await addReport({
      title,
      category: String(form?.get("category") || "Investor").trim(),
      slug: String(form?.get("slug") || ""),
      description: String(form?.get("description") || "").trim(),
      url,
      published: form?.get("published") === "on",
      file: file instanceof File && file.size > 0 ? {
        name: file.name,
        mime: file.type,
        bytes: new Uint8Array(await file.arrayBuffer()),
      } : undefined,
    });
    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "GAGAL";
    if (message === "TIPE_PDF") return NextResponse.json({ error: "Berkas harus PDF." }, { status: 422 });
    if (message === "UKURAN_PDF") return NextResponse.json({ error: "Ukuran PDF maksimal 25 MB." }, { status: 422 });
    if (message === "URL_KOSONG") return NextResponse.json({ error: "Isi URL atau unggah berkas PDF." }, { status: 422 });
    if (message === "URL_TIDAK_VALID") return NextResponse.json({ error: "URL harus http(s) atau dimulai dengan /." }, { status: 422 });
    throw error;
  }
}
