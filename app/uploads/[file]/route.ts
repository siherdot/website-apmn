import path from "node:path";
import { promises as fs } from "node:fs";
import { uploadPath } from "@/lib/gallery";

export const runtime = "nodejs";

const types: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(_request: Request, context: { params: Promise<{ file: string }> }) {
  const { file } = await context.params;
  const safe = path.basename(file);
  if (safe !== file || !types[path.extname(safe).toLowerCase()]) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const bytes = await fs.readFile(uploadPath(safe));
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": types[path.extname(safe).toLowerCase()],
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": "inline",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
