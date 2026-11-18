import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { removeReport, updateReport } from "@/lib/reports";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });

  const patch: Record<string, string | boolean | number> = {};
  for (const key of ["title", "category", "slug", "description", "url"] as const) {
    if (typeof body[key] === "string") patch[key] = (body[key] as string).trim();
  }
  if (typeof body.published === "boolean") patch.published = body.published;
  if (typeof body.order === "number" && Number.isFinite(body.order)) patch.order = Math.round(body.order);

  try {
    const report = await updateReport(id, patch);
    if (!report) return NextResponse.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
    return NextResponse.json({ report });
  } catch (error) {
    const message = error instanceof Error ? error.message : "GAGAL";
    if (message === "JUDUL_KOSONG") return NextResponse.json({ error: "Judul laporan wajib diisi." }, { status: 422 });
    if (message === "URL_KOSONG") return NextResponse.json({ error: "URL tidak boleh kosong." }, { status: 422 });
    if (message === "URL_TIDAK_VALID") return NextResponse.json({ error: "URL harus http(s) atau dimulai dengan /." }, { status: 422 });
    throw error;
  }
}

export async function DELETE(_request: Request, context: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const report = await removeReport(id);
  if (!report) return NextResponse.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
