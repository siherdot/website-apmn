import { NextResponse } from "next/server";
import { checkPassword, clientKey, clearFailures, isRateLimited, recordFailure, setSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const key = await clientKey();
  if (isRateLimited(key)) {
    return NextResponse.json({ error: "Terlalu banyak percobaan. Coba lagi beberapa menit." }, { status: 429 });
  }

  const body = await request.json().catch(() => null) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!checkPassword(password)) {
    recordFailure(key);
    return NextResponse.json({ error: "Kata sandi tidak benar." }, { status: 401 });
  }

  clearFailures(key);
  const response = NextResponse.json({ ok: true });
  setSession(response);
  return response;
}
