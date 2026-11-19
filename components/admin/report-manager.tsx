"use client";

import { useMemo, useState } from "react";
import { Badge } from "@astryxdesign/core/Badge";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { CheckboxInput } from "@astryxdesign/core/CheckboxInput";
import { FileInput } from "@astryxdesign/core/FileInput";
import { Heading } from "@astryxdesign/core/Heading";
import { Link } from "@astryxdesign/core/Link";
import { NumberInput } from "@astryxdesign/core/NumberInput";
import { Selector } from "@astryxdesign/core/Selector";
import { Text } from "@astryxdesign/core/Text";
import { TextArea } from "@astryxdesign/core/TextArea";
import { TextInput } from "@astryxdesign/core/TextInput";
import type { Report } from "@/lib/report-types";
import { REPORT_CATEGORIES } from "@/lib/report-types";
import AdminTabs from "./admin-tabs";

type Draft = {
  title: string;
  category: string;
  slug: string;
  description: string;
  url: string;
  published: boolean;
  order: number;
};

const sourceLabel: Record<Report["source"], string> = {
  situs: "Dari situs",
  tautan: "Tautan eksternal",
  upload: "Berkas PDF",
};

export default function ReportManager({ initialReports }: { initialReports: Report[] }) {
  const [items, setItems] = useState<Report[]>(initialReports);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Investor");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [published, setPublished] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [filter, setFilter] = useState("Semua");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const stats = useMemo(() => ({
    total: items.length,
    published: items.filter((r) => r.published).length,
    pdf: items.filter((r) => r.source === "upload").length,
    kategori: new Set(items.map((r) => r.category)).size,
  }), [items]);

  const visible = useMemo(() => items.filter((r) => {
    const matchFilter = filter === "Semua" || r.category === filter;
    const needle = query.trim().toLowerCase();
    const matchQuery = !needle || r.title.toLowerCase().includes(needle) || r.description.toLowerCase().includes(needle);
    return matchFilter && matchQuery;
  }), [items, filter, query]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setNotice("");
    if (!file && !url.trim()) { setError("Isi URL atau unggah berkas PDF."); return; }
    setBusy(true);
    try {
      const body = new FormData();
      if (file) body.append("file", file);
      body.append("title", title);
      body.append("category", category);
      body.append("slug", slug);
      body.append("description", description);
      body.append("url", url);
      if (published) body.append("published", "on");
      const response = await fetch("/api/admin/reports", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menambahkan laporan.");
      setItems((prev) => [result.report as Report, ...prev]);
      setTitle(""); setSlug(""); setDescription(""); setUrl(""); setFile(null); setPublished(true);
      setNotice("Laporan berhasil ditambahkan.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menambahkan laporan.");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(report: Report) {
    setError(""); setNotice(""); setEditing(report.id);
    setDrafts((prev) => ({
      ...prev,
      [report.id]: {
        title: report.title,
        category: report.category,
        slug: report.slug,
        description: report.description,
        url: report.url,
        published: report.published,
        order: report.order,
      },
    }));
  }

  function changeDraft(id: string, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function save(id: string) {
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(drafts[id]),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menyimpan.");
      setItems((prev) => prev.map((r) => r.id === id ? result.report as Report : r));
      setEditing(null);
      setNotice("Perubahan disimpan.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(report: Report) {
    if (!window.confirm(`Hapus laporan "${report.title}"?`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/reports/${report.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal menghapus laporan.");
      setItems((prev) => prev.filter((r) => r.id !== report.id));
      setNotice("Laporan dihapus.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus laporan.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const filterOptions = ["Semua", ...REPORT_CATEGORIES];

  return (
    <div className="adm-shell">
      <header className="adm-top">
        <div>
          <Text type="supporting" weight="semibold" color="accent" className="adm-kicker">
            APMN / Manajemen Konten
          </Text>
          <Heading level={1}>Manajer Laporan</Heading>
          <Text as="p" color="secondary" className="adm-sub">
            Tambahkan laporan atau dokumen investor. Berkas PDF akan tersimpan permanen;
            tautan eksternal juga didukung.
          </Text>
        </div>
        <div className="adm-actions">
          <AdminTabs active="laporan" />
          <Link className="adm-link" href="/" target="_blank" isStandalone isExternalLink>
            Situs utama
          </Link>
          <Button label="Keluar" variant="secondary" onClick={logout} />
        </div>
      </header>

      <div className="adm-stats" aria-label="Ringkasan laporan">
        <div><Text type="supporting" color="secondary">Total laporan</Text><Heading level={3}>{stats.total}</Heading></div>
        <div><Text type="supporting" color="secondary">Tampil di publik</Text><Heading level={3}>{stats.published}</Heading></div>
        <div><Text type="supporting" color="secondary">Berkas PDF</Text><Heading level={3}>{stats.pdf}</Heading></div>
        <div><Text type="supporting" color="secondary">Kategori</Text><Heading level={3}>{stats.kategori}</Heading></div>
      </div>

      {error && <Banner status="error" title={error} container="card" />}
      {!error && notice && <Banner status="success" title={notice} container="card" />}

      <div className="adm-grid">
        <section className="adm-card adm-upload">
          <div className="adm-card-head">
            <Heading level={2}>Tambah laporan</Heading>
            <Text type="supporting" color="secondary">
              PDF maksimal 25 MB, atau tautan http(s)/halaman internal
            </Text>
          </div>
          <form className="admin-form-stack" onSubmit={submit}>
            <FileInput
              label="Berkas PDF"
              value={file}
              onChange={(files) => setFile(Array.isArray(files) ? files[0] ?? null : files)}
              accept="application/pdf,.pdf"
              maxSize={25 * 1024 * 1024}
              isOptional
            />
            <TextInput
              label="URL"
              value={url}
              onChange={(value) => setUrl(value)}
              placeholder="https://… atau /halaman"
              isOptional
            />
            <TextInput
              label="Judul"
              value={title}
              onChange={(value) => setTitle(value)}
              placeholder="Contoh: Laporan Tahunan 2025"
              isRequired
            />
            <Selector
              label="Kategori"
              options={[...REPORT_CATEGORIES]}
              value={category}
              onChange={(value) => setCategory(value)}
            />
            <TextInput
              label="Slug halaman"
              value={slug}
              onChange={(value) => setSlug(value)}
              placeholder="contoh: laporan-tahunan"
              isOptional
            />
            <TextArea
              label="Keterangan"
              value={description}
              onChange={(value) => setDescription(value)}
              isOptional
              placeholder="Ringkasan dokumen"
              rows={3}
            />
            <CheckboxInput
              label="Tampilkan di situs publik"
              value={published}
              onChange={(checked) => setPublished(checked)}
            />
            <Button
              label="Simpan laporan"
              type="submit"
              variant="primary"
              isLoading={busy}
              isDisabled={busy}
            />
          </form>
        </section>

        <section className="adm-card adm-list">
          <div className="adm-card-head adm-list-head">
            <div>
              <Heading level={2}>Daftar laporan</Heading>
              <Text type="supporting" color="secondary">
                {visible.length} dari {items.length} laporan
              </Text>
            </div>
            <div className="adm-filters">
              <TextInput
                label="Cari laporan"
                type="search"
                value={query}
                onChange={(value) => setQuery(value)}
                placeholder="Cari judul…"
                isLabelHidden
              />
              <Selector
                label="Filter kategori"
                options={filterOptions}
                value={filter}
                onChange={(value) => setFilter(value)}
                isLabelHidden
              />
            </div>
          </div>

          <div className="adm-rows">
            {visible.map((report) => {
              const draft = drafts[report.id];
              const isEditing = editing === report.id && draft;
              return (
                <article className="adm-report-row" key={report.id}>
                  {isEditing ? (
                    <div className="adm-edit">
                      <div className="adm-edit-grid">
                        <TextInput
                          label="Judul"
                          value={draft.title}
                          onChange={(value) => changeDraft(report.id, { title: value })}
                        />
                        <Selector
                          label="Kategori"
                          options={Array.from(new Set([...REPORT_CATEGORIES, draft.category]))}
                          value={draft.category}
                          onChange={(value) => changeDraft(report.id, { category: value })}
                        />
                        <NumberInput
                          label="Urutan"
                          value={draft.order}
                          onChange={(value) => changeDraft(report.id, { order: value })}
                        />
                        <TextInput
                          label="Slug"
                          value={draft.slug}
                          onChange={(value) => changeDraft(report.id, { slug: value })}
                        />
                        <div className="adm-edit-caption">
                          <TextInput
                            label="URL"
                            value={draft.url}
                            onChange={(value) => changeDraft(report.id, { url: value })}
                          />
                        </div>
                        <div className="adm-edit-caption">
                          <TextInput
                            label="Keterangan"
                            value={draft.description}
                            onChange={(value) => changeDraft(report.id, { description: value })}
                          />
                        </div>
                      </div>
                      <CheckboxInput
                        label="Tampil di publik"
                        value={draft.published}
                        onChange={(checked) => changeDraft(report.id, { published: checked })}
                      />
                      <div className="adm-row-actions">
                        <Button label="Simpan" size="sm" variant="primary" isLoading={busy} onClick={() => save(report.id)} />
                        <Button label="Batal" size="sm" variant="secondary" onClick={() => setEditing(null)} />
                      </div>
                    </div>
                  ) : (
                    <div className="adm-report-body">
                      <div className="adm-photo-title">
                        <Text type="label" weight="semibold">{report.title}</Text>
                        <Badge label={report.category} variant="green" />
                        <Badge label={sourceLabel[report.source]} variant="neutral" />
                        {!report.published && <Badge label="Tersembunyi" variant="orange" />}
                      </div>
                      {report.description && (
                        <Text type="supporting" color="secondary">{report.description}</Text>
                      )}
                      <Text type="supporting" color="accent" className="adm-report-url">
                        {report.url}
                      </Text>
                      <div className="adm-row-actions">
                        <Link
                          className="adm-link"
                          href={report.url}
                          target={report.url.startsWith("/") ? undefined : "_blank"}
                          isStandalone
                          isExternalLink={!report.url.startsWith("/")}
                        >
                          Buka
                        </Link>
                        <Button label="Edit" size="sm" variant="secondary" onClick={() => startEdit(report)} />
                        <Button label="Hapus" size="sm" variant="destructive" isLoading={busy} onClick={() => remove(report)} />
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
            {visible.length === 0 && <Text as="p" color="secondary" className="adm-empty">Tidak ada laporan yang cocok.</Text>}
          </div>
        </section>
      </div>
    </div>
  );
}
