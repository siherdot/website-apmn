import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Photo } from "./gallery-types";

export type { Photo } from "./gallery-types";
export { GALLERY_CATEGORIES } from "./gallery-types";

const SEED_PHOTOS: Photo[] = [
  { id: "arsip-01", title: "Ruang farmasi", category: "Fasilitas", caption: "Area farmasi yang menjadi bagian dari layanan kefarmasian perseroan.", src: "/gallery/arsip-farmasi.webp", source: "arsip", published: true, order: 1, createdAt: "" },
  { id: "arsip-02", title: "Peralatan diagnostik", category: "Fasilitas", caption: "Perlengkapan diagnostik yang digunakan dalam mendukung layanan pemeriksaan.", src: "/gallery/arsip-diagnostik.webp", source: "arsip", published: true, order: 2, createdAt: "" },
  { id: "arsip-03", title: "Layanan bank darah", category: "Fasilitas", caption: "Fasilitas bank darah yang mendukung layanan transfusi dan ketersediaan darah.", src: "/gallery/arsip-bank-darah.webp", source: "arsip", published: true, order: 3, createdAt: "" },
  { id: "arsip-04", title: "Area layanan darah", category: "Fasilitas", caption: "Area pendukung layanan darah di lingkungan fasilitas.", src: "/gallery/arsip-layanan-darah.webp", source: "arsip", published: true, order: 4, createdAt: "" },
  { id: "arsip-05", title: "Potret tim", category: "Fasilitas", caption: "Dokumentasi tim dari arsip situs perseroan sebelumnya.", src: "/gallery/arsip-staf.webp", source: "arsip", published: true, order: 5, createdAt: "" },
  { id: "arsip-06", title: "Area resepsionis", category: "Fasilitas", caption: "Area resepsionis sebagai titik penyambutan dan informasi pengunjung.", src: "/gallery/arsip-resepsionis.webp", source: "arsip", published: true, order: 6, createdAt: "" },
  { id: "arsip-07", title: "Pintu masuk fasilitas", category: "Fasilitas", caption: "Pintu masuk gedung yang terekam dalam arsip dokumentasi perseroan.", src: "/gallery/arsip-pintu-masuk.webp", source: "arsip", published: true, order: 7, createdAt: "" },
  { id: "arsip-08", title: "Area lobby", category: "Fasilitas", caption: "Area lobby yang digunakan untuk penyambutan dan ruang tunggu singkat.", src: "/gallery/arsip-lobby.webp", source: "arsip", published: true, order: 8, createdAt: "" },
  { id: "arsip-09", title: "Ruang tunggu", category: "Fasilitas", caption: "Ruang tunggu yang menjadi bagian dari area layanan publik.", src: "/gallery/arsip-ruang-tunggu.webp", source: "arsip", published: true, order: 9, createdAt: "" },
  { id: "arsip-10", title: "Fasad gedung", category: "Gedung", caption: "Tampak depan gedung dari arsip dokumentasi perseroan.", src: "/gallery/arsip-fasad.webp", source: "arsip", published: true, order: 10, createdAt: "" },
  { id: "arsip-11", title: "Tampilan gedung", category: "Gedung", caption: "Tampilan bangunan keseluruhan dari arsip dokumentasi perseroan.", src: "/gallery/arsip-tampak-gedung.webp", source: "arsip", published: true, order: 11, createdAt: "" },
  { id: "arsip-12", title: "Rumah sakit modular", category: "Gedung", caption: "Dokumentasi bangunan rumah sakit modular dalam arsip perseroan.", src: "/gallery/arsip-rumah-sakit-modular.webp", source: "arsip", published: true, order: 12, createdAt: "" },
  { id: "arsip-13", title: "Prestasi rekrutmen", category: "Prestasi", caption: "Dokumentasi terkait rekrutmen dari arsip situs perseroan sebelumnya.", src: "/gallery/arsip-prestasi-rekrutmen.webp", source: "arsip", published: true, order: 13, createdAt: "" },
  { id: "arsip-14", title: "Prestasi sistem rumah sakit", category: "Prestasi", caption: "Dokumentasi sistem informasi rumah sakit dari arsip situs perseroan sebelumnya.", src: "/gallery/arsip-prestasi-sistem.webp", source: "arsip", published: true, order: 14, createdAt: "" },
];

const SEED_POLISH: Record<string, { title: string; caption: string }> = Object.fromEntries(
  SEED_PHOTOS.map((photo) => [photo.id, { title: photo.title, caption: photo.caption }]),
);
const OLD_GENERIC_CAPTIONS = new Set([
  "Dokumentasi fasilitas dari situs perseroan sebelumnya.",
  "Dokumentasi gedung dari situs perseroan sebelumnya.",
  "Dokumentasi prestasi dari situs perseroan sebelumnya.",
]);

function polishSeedCaptions(photos: Photo[]): Photo[] {
  return photos.map((photo) => {
    const polish = SEED_POLISH[photo.id];
    return polish && OLD_GENERIC_CAPTIONS.has(photo.caption)
      ? { ...photo, title: polish.title, caption: polish.caption }
      : photo;
  });
}


const dataDir = () => process.env.DATA_DIR || path.join(process.cwd(), "data");
const dataFile = () => path.join(dataDir(), "photos.json");
const uploadDir = () => path.join(dataDir(), "uploads");

let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.then(() => undefined, () => undefined);
  return run;
}

async function ensureDirs() {
  await fs.mkdir(dataDir(), { recursive: true });
  await fs.mkdir(uploadDir(), { recursive: true });
}

async function readUnsafe(): Promise<Photo[]> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(dataFile(), "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Format photos.json tidak valid");
    const polished = polishSeedCaptions(parsed as Photo[]);
    if (polished.some((photo, index) => photo !== (parsed as Photo[])[index])) {
      await writeUnsafe(polished);
    }
    return polished.sort((a, b) => a.order - b.order);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    await writeUnsafe(SEED_PHOTOS);
    return [...SEED_PHOTOS];
  }
}

async function writeUnsafe(photos: Photo[]) {
  await ensureDirs();
  const target = dataFile();
  const tmp = `${target}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(photos, null, 2), "utf8");
  await fs.rename(tmp, target);
}

async function transaction<T>(task: (photos: Photo[]) => Promise<{ photos: Photo[]; result: T }>): Promise<T> {
  return withLock(async () => {
    const current = await readUnsafe();
    const { photos, result } = await task(current);
    await writeUnsafe(photos.sort((a, b) => a.order - b.order));
    return result;
  });
}

export async function listPhotos(): Promise<Photo[]> {
  return readUnsafe();
}

export async function listPublishedPhotos(): Promise<Photo[]> {
  return (await readUnsafe()).filter((p) => p.published);
}

export function uploadPath(filename: string) {
  const safe = path.basename(filename);
  return path.join(uploadDir(), safe);
}

export type NewPhoto = {
  title: string;
  category: string;
  caption: string;
  published: boolean;
  order?: number;
  file: { name: string; mime: string; bytes: Uint8Array };
};

export async function addPhoto(input: NewPhoto): Promise<Photo> {
  const extByMime: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  const ext = extByMime[input.file.mime];
  if (!ext) throw new Error("TIPE_FOTO");
  if (input.file.bytes.byteLength > 12 * 1024 * 1024) throw new Error("UKURAN_FOTO");
  await ensureDirs();
  const filename = `up-${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
  await fs.writeFile(uploadPath(filename), input.file.bytes);
  const record: Photo = {
    id: randomUUID(),
    title: input.title.trim(),
    category: input.category.trim() || "Dokumentasi",
    caption: input.caption.trim(),
    src: `/uploads/${filename}`,
    source: "upload",
    published: input.published,
    order: input.order ?? Date.now(),
    createdAt: new Date().toISOString(),
  };
  try {
    return await transaction(async (photos) => ({
      photos: [...photos, record],
      result: record,
    }));
  } catch (error) {
    await fs.unlink(uploadPath(filename)).catch(() => undefined);
    throw error;
  }
}

export type PhotoPatch = Partial<Pick<Photo, "title" | "category" | "caption" | "published" | "order">>;

export async function updatePhoto(id: string, patch: PhotoPatch): Promise<Photo | null> {
  return transaction(async (photos) => {
    const index = photos.findIndex((p) => p.id === id);
    if (index < 0) return { photos, result: null };
    const next = { ...photos[index], ...patch };
    const copy = [...photos];
    copy[index] = next;
    return { photos: copy, result: next };
  });
}

export async function removePhoto(id: string): Promise<Photo | null> {
  const removed = await transaction(async (photos) => {
    const found = photos.find((p) => p.id === id) || null;
    return { photos: photos.filter((p) => p.id !== id), result: found };
  });
  if (removed?.source === "upload") {
    await fs.unlink(uploadPath(removed.src.split("/").pop() || "")).catch(() => undefined);
  }
  return removed;
}
