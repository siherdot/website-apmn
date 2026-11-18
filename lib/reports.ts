import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Report } from "./report-types";

export type { Report, ReportSource } from "./report-types";
export { REPORT_CATEGORIES } from "./report-types";
export { uploadPath } from "./gallery";

const SEED_REPORTS: Report[] = [
  { id: "doc-prospektus", title: "Prospektus", category: "Investor", slug: "prospektus", description: "Dokumen penawaran umum perseroan.", url: "/prospektus", source: "situs", published: true, order: 1, createdAt: "" },
  { id: "doc-laporan-tahunan", title: "Laporan Tahunan", category: "Tahunan", slug: "laporan-tahunan", description: "Laporan pertanggungjawaban tahunan perseroan.", url: "/laporan-tahunan", source: "situs", published: true, order: 2, createdAt: "" },
  { id: "doc-piagam-komite-audit", title: "Piagam Komite Audit", category: "Tata kelola", slug: "piagam-komite-audit", description: "Piagam resmi Komite Audit perseroan.", url: "/piagam-komite-audit", source: "situs", published: true, order: 3, createdAt: "" },
  { id: "doc-dividen", title: "Kebijakan Dividen", category: "Kinerja", slug: "dividen", description: "Kebijakan pembagian dividen perseroan.", url: "/dividen", source: "situs", published: true, order: 4, createdAt: "" },
  { id: "doc-keterbukaan", title: "Keterbukaan Informasi", category: "Publik", slug: "keterbukaan-informasi", description: "Kanal informasi material perseroan.", url: "/keterbukaan-informasi", source: "situs", published: true, order: 5, createdAt: "" },
];

const dataDir = () => process.env.DATA_DIR || path.join(process.cwd(), "data");
const dataFile = () => path.join(dataDir(), "reports.json");

let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(() => undefined, () => undefined);
  return run;
}

async function ensureDirs() {
  await fs.mkdir(dataDir(), { recursive: true });
  await fs.mkdir(path.join(dataDir(), "uploads"), { recursive: true });
}

async function readUnsafe(): Promise<Report[]> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(dataFile(), "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Format reports.json tidak valid");
    return (parsed as Report[]).sort((a, b) => a.order - b.order);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    await writeUnsafe(SEED_REPORTS);
    return [...SEED_REPORTS];
  }
}

async function writeUnsafe(reports: Report[]) {
  await ensureDirs();
  const target = dataFile();
  const tmp = `${target}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(reports, null, 2), "utf8");
  await fs.rename(tmp, target);
}

async function transaction<T>(task: (reports: Report[]) => Promise<{ reports: Report[]; result: T }>): Promise<T> {
  return withLock(async () => {
    const current = await readUnsafe();
    const { reports, result } = await task(current);
    await writeUnsafe(reports.sort((a, b) => a.order - b.order));
    return result;
  });
}

export async function listReports(): Promise<Report[]> {
  return readUnsafe();
}

export async function listPublishedReports(): Promise<Report[]> {
  return (await readUnsafe()).filter((r) => r.published);
}

function cleanUrl(value: string) {
  const url = value.trim();
  if (!url) return "";
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  if (/^https?:\/\//i.test(url)) return url;
  throw new Error("URL_TIDAK_VALID");
}

function cleanSlug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9/-]+/g, "-").replace(/^-+|-+$/g, "");
}

export type NewReport = {
  title: string;
  category: string;
  slug: string;
  description: string;
  url: string;
  published: boolean;
  order?: number;
  file?: { name: string; mime: string; bytes: Uint8Array };
};

export async function addReport(input: NewReport): Promise<Report> {
  const title = input.title.trim();
  if (!title) throw new Error("JUDUL_KOSONG");

  let url = "";
  let source: Report["source"] = "tautan";
  let filename = "";

  if (input.file && input.file.bytes.byteLength > 0) {
    if (input.file.mime !== "application/pdf") throw new Error("TIPE_PDF");
    if (input.file.bytes.byteLength > 25 * 1024 * 1024) throw new Error("UKURAN_PDF");
    await ensureDirs();
    filename = `doc-${Date.now()}-${randomUUID().slice(0, 8)}.pdf`;
    await fs.writeFile(path.join(dataDir(), "uploads", filename), input.file.bytes);
    url = `/uploads/${filename}`;
    source = "upload";
  } else {
    url = cleanUrl(input.url);
    if (!url) throw new Error("URL_KOSONG");
    source = url.startsWith("/") ? "situs" : "tautan";
  }

  const record: Report = {
    id: randomUUID(),
    title,
    category: input.category.trim() || "Investor",
    slug: cleanSlug(input.slug),
    description: input.description.trim(),
    url,
    source,
    published: input.published,
    order: input.order ?? Date.now(),
    createdAt: new Date().toISOString(),
  };

  try {
    return await transaction(async (reports) => ({
      reports: [...reports, record],
      result: record,
    }));
  } catch (error) {
    if (filename) await fs.unlink(path.join(dataDir(), "uploads", filename)).catch(() => undefined);
    throw error;
  }
}

export type ReportPatch = Partial<Pick<Report, "title" | "category" | "slug" | "description" | "url" | "published" | "order">>;

export async function updateReport(id: string, patch: ReportPatch): Promise<Report | null> {
  const clean: ReportPatch = { ...patch };
  for (const key of ["title", "category", "description"] as const) {
    if (typeof clean[key] === "string") clean[key] = (clean[key] as string).trim();
  }
  if (typeof clean.slug === "string") clean.slug = cleanSlug(clean.slug);
  if (typeof clean.url === "string") clean.url = cleanUrl(clean.url);
  if (clean.title === "") throw new Error("JUDUL_KOSONG");
  if (clean.url === "") throw new Error("URL_KOSONG");

  return transaction(async (reports) => {
    const index = reports.findIndex((r) => r.id === id);
    if (index < 0) return { reports, result: null };
    const next = { ...reports[index], ...clean };
    const copy = [...reports];
    copy[index] = next;
    return { reports: copy, result: next };
  });
}

export async function removeReport(id: string): Promise<Report | null> {
  const removed = await transaction(async (reports) => {
    const found = reports.find((r) => r.id === id) || null;
    return { reports: reports.filter((r) => r.id !== id), result: found };
  });
  if (removed?.source === "upload") {
    const filename = removed.url.split("/").pop() || "";
    await fs.unlink(path.join(dataDir(), "uploads", filename)).catch(() => undefined);
  }
  return removed;
}
