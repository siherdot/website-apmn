import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import LoginForm from "@/components/admin/login-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Masuk Admin", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="adm-login">
      <div className="adm-login-panel">
        <Link href="/" className="adm-login-brand">
          <img src="/images/logo-apmn.png" alt="" width={40} height={40} />
          <span>APMN <small>Content management</small></span>
        </Link>
        <p className="adm-kicker">Area terbatas</p>
        <h1>Masuk dashboard</h1>
        <p className="adm-sub">Kelola foto galeri publik perseroan.</p>
        <LoginForm />
        <Link className="adm-login-back" href="/">← Kembali ke situs</Link>
      </div>
    </div>
  );
}
