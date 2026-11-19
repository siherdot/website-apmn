import type { Metadata } from "next";
import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { Text } from "@astryxdesign/core/Text";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import LoginForm from "@/components/admin/login-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Masuk Admin", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="admin-login-shell">
      <div className="admin-login-panel">
        <Link href="/" className="brand-lockup" isStandalone>
          <img src="/images/logo-apmn.png" alt="" width={40} height={40} />
          <span>
            <Text type="label" weight="bold">
              APMN
            </Text>
            <Text type="supporting">Content management</Text>
          </span>
        </Link>
        <Text type="supporting" weight="semibold" color="accent" className="adm-kicker">
          Area terbatas
        </Text>
        <Heading level={1}>Masuk dashboard</Heading>
        <Text as="p" color="secondary">
          Kelola foto galeri dan dokumen investor perseroan.
        </Text>
        <LoginForm />
        <Link className="back-link" href="/" isStandalone>
          ← Kembali ke situs
        </Link>
      </div>
    </div>
  );
}
