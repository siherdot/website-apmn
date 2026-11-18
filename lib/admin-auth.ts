import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

const COOKIE_NAME = "apmn_admin_session";
const SESSION_HOURS = 12;
const FAILURE_WINDOW_MS = 10 * 60 * 1000;
const FAILURE_LIMIT = 5;

const failures = new Map<string, { count: number; resetAt: number }>();

function secret() {
  return process.env.AUTH_SECRET || (process.env.NODE_ENV === "production" ? "" : "apmn-local-dev-secret");
}

function expectedPassword() {
  return process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "apmn-local-dev-password");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function checkPassword(password: string) {
  const expected = expectedPassword();
  if (!expected) return false;
  return safeEqual(password, expected);
}

function sign(expiry: number) {
  return createHmac("sha256", secret()).update(String(expiry)).digest("base64url");
}

function validToken(token: string | undefined) {
  if (!token || !secret()) return false;
  const [rawExpiry, signature] = token.split(".");
  if (!rawExpiry || !signature) return false;
  const expiry = Number(rawExpiry);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;
  return safeEqual(signature, sign(expiry));
}

export async function isAdmin() {
  const jar = await cookies();
  return validToken(jar.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export function setSession(response: NextResponse) {
  const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  response.cookies.set({
    name: COOKIE_NAME,
    value: `${expiry}.${sign(expiry)}`,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export function clearSession(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function clientKey() {
  const h = await headers();
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function isRateLimited(key: string) {
  const now = Date.now();
  const entry = failures.get(key);
  if (!entry || entry.resetAt <= now) return false;
  return entry.count >= FAILURE_LIMIT;
}

export function recordFailure(key: string) {
  const now = Date.now();
  const entry = failures.get(key);
  if (!entry || entry.resetAt <= now) {
    failures.set(key, { count: 1, resetAt: now + FAILURE_WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearFailures(key: string) {
  failures.delete(key);
}
