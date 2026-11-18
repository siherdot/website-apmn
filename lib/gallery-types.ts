export type Photo = {
  id: string;
  title: string;
  category: string;
  caption: string;
  src: string;
  source: "arsip" | "upload";
  published: boolean;
  order: number;
  createdAt: string;
};

export const GALLERY_CATEGORIES = ["Fasilitas", "Gedung", "Prestasi", "Dokumentasi"] as const;
