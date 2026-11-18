"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
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
  const fileRef = useRef<HTMLInputElement>(null);

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
      if (fileRef.current) fileRef.current.value = "";
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

  return (
    <div className="adm-shell">
      <header className="adm-top">
        <div>
          <p className="adm-kicker">APMN / Content management</p>
          <h1>Manajer Laporan</h1>
          <p className="adm-sub">Tambahkan laporan atau dokumen investor. Berkas PDF akan tersimpan permanen; tautan eksternal juga didukung.</p>
        </div>
        <div className="adm-actions">
          <AdminTabs active="laporan" />
          <Link className="adm-link" href="/" target="_blank">Situs utama ↗</Link>
          <button className="adm-quiet" type="button" onClick={logout}>Keluar</button>
        </div>
      </header>

      <div className="adm-stats" aria-label="Ringkasan laporan">
        <div><span>Total laporan</span><strong>{stats.total}</strong></div>
        <div><span>Tampil di publik</span><strong>{stats.published}</strong></div>
        <div><span>Berkas PDF</span><strong>{stats.pdf}</strong></div>
        <div><span>Kategori</span><strong>{stats.kategori}</strong></div>
      </div>

      {(error || notice) && (
        <div className={error ? "adm-msg adm-msg-error" : "adm-msg adm-msg-ok"} role="status">
          {error || notice}
        </div>
      )}

      <div className="adm-grid">
        <section className="adm-card adm-upload">
          <div className="adm-card-head">
            <h2>Tambah laporan</h2>
            <p>PDF maksimal 25 MB, atau tautan http(s)/halaman internal</p>
          </div>
          <form onSubmit={submit}>
            <label className="adm-field">
              <span>Berkas PDF <em>(opsional)</em></span>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => {
                  const next = e.target.files?.[0] || null;
                  setFile(next);
                  if (next && !title) setTitle(next.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
                }}
              />
            </label>
            <label className="adm-field">
              <span>URL <em>(bila tanpa berkas)</em></span>
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… atau /halaman" />
            </label>
            <label className="adm-field">
              <span>Judul</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Laporan Tahunan 2025" required />
            </label>
            <label className="adm-field">
              <span>Kategori</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {REPORT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="adm-field">
              <span>Slug halaman <em>(opsional)</em></span>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="contoh: laporan-tahunan" />
            </label>
            <label className="adm-field">
              <span>Keterangan <em>(opsional)</em></span>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Ringkasan dokumen" />
            </label>
            <label className="adm-check">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              <span>Tampilkan di situs publik</span>
            </label>
            <button className="adm-primary" type="submit" disabled={busy}>Simpan laporan</button>
          </form>
        </section>

        <section className="adm-card adm-list">
          <div className="adm-card-head adm-list-head">
            <div>
              <h2>Daftar laporan</h2>
              <p>{visible.length} dari {items.length} laporan</p>
            </div>
            <div className="adm-filters">
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari judul…" aria-label="Cari laporan" />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter kategori">
                <option>Semua</option>
                {REPORT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
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
                        <label><span>Judul</span><input value={draft.title} onChange={(e) => changeDraft(report.id, { title: e.target.value })} /></label>
                        <label><span>Kategori</span>
                          <select value={draft.category} onChange={(e) => changeDraft(report.id, { category: e.target.value })}>
                            {REPORT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            {!REPORT_CATEGORIES.includes(draft.category as typeof REPORT_CATEGORIES[number]) && <option value={draft.category}>{draft.category}</option>}
                          </select>
                        </label>
                        <label><span>Urutan</span><input type="number" value={draft.order} onChange={(e) => changeDraft(report.id, { order: Number(e.target.value) })} /></label>
                        <label><span>Slug</span><input value={draft.slug} onChange={(e) => changeDraft(report.id, { slug: e.target.value })} /></label>
                        <label className="adm-edit-caption"><span>URL</span><input value={draft.url} onChange={(e) => changeDraft(report.id, { url: e.target.value })} /></label>
                        <label className="adm-edit-caption"><span>Keterangan</span><input value={draft.description} onChange={(e) => changeDraft(report.id, { description: e.target.value })} /></label>
                      </div>
                      <label className="adm-check">
                        <input type="checkbox" checked={draft.published} onChange={(e) => changeDraft(report.id, { published: e.target.checked })} />
                        <span>Tampil di publik</span>
                      </label>
                      <div className="adm-row-actions">
                        <button className="adm-primary small" type="button" onClick={() => save(report.id)} disabled={busy}>Simpan</button>
                        <button className="adm-quiet" type="button" onClick={() => setEditing(null)}>Batal</button>
                      </div>
                    </div>
                  ) : (
                    <div className="adm-report-body">
                      <div className="adm-photo-title">
                        <strong>{report.title}</strong>
                        <span className="adm-tag">{report.category}</span>
                        <span className="adm-tag muted">{sourceLabel[report.source]}</span>
                        {!report.published && <span className="adm-tag off">Tersembunyi</span>}
                      </div>
                      {report.description && <p>{report.description}</p>}
                      <p className="adm-report-url">{report.url}</p>
                      <div className="adm-row-actions">
                        <a className="adm-link" href={report.url} target={report.url.startsWith("/") ? undefined : "_blank"} rel="noreferrer">Buka</a>
                        <button className="adm-quiet" type="button" onClick={() => startEdit(report)}>Edit</button>
                        <button className="adm-danger" type="button" onClick={() => remove(report)}>Hapus</button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
            {visible.length === 0 && <p className="adm-empty">Tidak ada laporan yang cocok.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
