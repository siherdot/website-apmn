export type ReportSource = "situs" | "tautan" | "upload";

export type Report = {
  id: string;
  title: string;
  category: string;
  slug: string;
  description: string;
  url: string;
  source: ReportSource;
  published: boolean;
  order: number;
  createdAt: string;
};

export const REPORT_CATEGORIES = [
  "Investor",
  "Tahunan",
  "Tata kelola",
  "Kinerja",
  "Publik",
  "Laporan keuangan",
] as const;
