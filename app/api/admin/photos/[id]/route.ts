import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { removePhoto, updatePhoto } from "@/lib/gallery";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });

  const patch: Record<string, string | boolean | number> = {};
  for (const key of ["title", "category", "caption"] as const) {
    if (typeof body[key] === "string") patch[key] = (body[key] as string).trim();
  }
  if (typeof body.published === "boolean") patch.published = body.published;
  if (typeof body.order === "number" && Number.isFinite(body.order)) patch.order = Math.round(body.order);

  const photo = await updatePhoto(id, patch);
  if (!photo) return NextResponse.json({ error: "Foto tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ photo });
}

export async function DELETE(_request: Request, context: Context) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const photo = await removePhoto(id);
  if (!photo) return NextResponse.json({ error: "Foto tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
