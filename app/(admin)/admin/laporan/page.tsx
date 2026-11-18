import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { listReports } from "@/lib/reports";
import ReportManager from "@/components/admin/report-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Manajer Laporan", robots: { index: false, follow: false } };

export default async function AdminLaporanPage() {
  await requireAdmin();
  const reports = await listReports();
  return <ReportManager initialReports={reports} />;
}
