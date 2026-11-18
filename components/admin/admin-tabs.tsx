import Link from "next/link";

export default function AdminTabs({ active }: { active: "foto" | "laporan" }) {
  return (
    <nav className="adm-tabs" aria-label="Navigasi admin">
      <Link href="/admin" className={active === "foto" ? "active" : undefined}>Foto</Link>
      <Link href="/admin/laporan" className={active === "laporan" ? "active" : undefined}>Laporan</Link>
    </nav>
  );
}
