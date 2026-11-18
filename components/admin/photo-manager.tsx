"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { Photo } from "@/lib/gallery-types";
import { GALLERY_CATEGORIES } from "@/lib/gallery-types";
import AdminTabs from "./admin-tabs";

type Draft = { title: string; category: string; caption: string; published: boolean; order: number };

export default function PhotoManager({ initialPhotos }: { initialPhotos: Photo[] }) {
  const [items, setItems] = useState<Photo[]>(initialPhotos);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Fasilitas");
  const [caption, setCaption] = useState("");
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
    published: items.filter((p) => p.published).length,
    arsip: items.filter((p) => p.source === "arsip").length,
    kategori: new Set(items.map((p) => p.category)).size,
  }), [items]);

  const visible = useMemo(() => items.filter((p) => {
    const matchFilter = filter === "Semua" || p.category === filter;
    const needle = query.trim().toLowerCase();
    const matchQuery = !needle || p.title.toLowerCase().includes(needle) || p.caption.toLowerCase().includes(needle);
    return matchFilter && matchQuery;
  }), [items, filter, query]);

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!file) { setError("Pilih berkas foto terlebih dahulu."); return; }
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("title", title);
      body.append("category", category);
      body.append("caption", caption);
      if (published) body.append("published", "on");
      const response = await fetch("/api/admin/photos", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal mengunggah foto.");
      setItems((prev) => [result.photo as Photo, ...prev]);
      setTitle(""); setCaption(""); setFile(null); setPublished(true);
      if (fileRef.current) fileRef.current.value = "";
      setNotice("Foto berhasil ditambahkan.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengunggah foto.");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(photo: Photo) {
    setError(""); setNotice("");
    setEditing(photo.id);
    setDrafts((prev) => ({
      ...prev,
      [photo.id]: {
        title: photo.title,
        category: photo.category,
        caption: photo.caption,
        published: photo.published,
        order: photo.order,
      },
    }));
  }

  function changeDraft(id: string, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function save(id: string) {
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/photos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(drafts[id]),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menyimpan.");
      setItems((prev) => prev.map((p) => p.id === id ? result.photo as Photo : p));
      setEditing(null);
      setNotice("Perubahan disimpan.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(photo: Photo) {
    if (!window.confirm(`Hapus foto "${photo.title}"?`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/photos/${photo.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal menghapus foto.");
      setItems((prev) => prev.filter((p) => p.id !== photo.id));
      setNotice("Foto dihapus.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal menghapus foto.");
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
          <h1>Manajer Foto</h1>
          <p className="adm-sub">Unggah foto baru, atur judul dan kategori, lalu tentukan mana yang tampil di galeri publik.</p>
        </div>
        <div className="adm-actions">
          <AdminTabs active="foto" />
          <Link className="adm-link" href="/galeri" target="_blank">Lihat galeri ↗</Link>
          <Link className="adm-link" href="/">Situs utama ↗</Link>
          <button className="adm-quiet" type="button" onClick={logout}>Keluar</button>
        </div>
      </header>

      <div className="adm-stats" aria-label="Ringkasan galeri">
        <div><span>Total foto</span><strong>{stats.total}</strong></div>
        <div><span>Tampil di publik</span><strong>{stats.published}</strong></div>
        <div><span>Arsip situs lama</span><strong>{stats.arsip}</strong></div>
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
            <h2>Tambah foto</h2>
            <p>JPG, PNG, WebP, atau GIF · maksimal 12 MB</p>
          </div>
          <form onSubmit={upload}>
            <label className="adm-field">
              <span>Berkas foto</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) => {
                  const next = e.target.files?.[0] || null;
                  setFile(next);
                  if (next && !title) setTitle(next.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
                }}
                required
              />
            </label>
            <label className="adm-field">
              <span>Judul</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Ruang perawatan" required />
            </label>
            <label className="adm-field">
              <span>Kategori</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="adm-field">
              <span>Caption <em>(opsional)</em></span>
              <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} placeholder="Keterangan singkat" />
            </label>
            <label className="adm-check">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              <span>Tampilkan di galeri publik</span>
            </label>
            <button className="adm-primary" type="submit" disabled={busy}>Unggah foto</button>
          </form>
        </section>

        <section className="adm-card adm-list">
          <div className="adm-card-head adm-list-head">
            <div>
              <h2>Daftar foto</h2>
              <p>{visible.length} dari {items.length} foto</p>
            </div>
            <div className="adm-filters">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul…"
                aria-label="Cari foto"
              />
              <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter kategori">
                <option>Semua</option>
                {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="adm-rows">
            {visible.map((photo) => {
              const draft = drafts[photo.id];
              const isEditing = editing === photo.id && draft;
              return (
                <article className="adm-photo-row" key={photo.id}>
                  <img src={photo.src} alt="" loading="lazy" />
                  {isEditing ? (
                    <div className="adm-edit">
                      <div className="adm-edit-grid">
                        <label><span>Judul</span><input value={draft.title} onChange={(e) => changeDraft(photo.id, { title: e.target.value })} /></label>
                        <label><span>Kategori</span>
                          <select value={draft.category} onChange={(e) => changeDraft(photo.id, { category: e.target.value })}>
                            {GALLERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            {!GALLERY_CATEGORIES.includes(draft.category as typeof GALLERY_CATEGORIES[number]) &&
                              <option value={draft.category}>{draft.category}</option>}
                          </select>
                        </label>
                        <label><span>Urutan</span><input type="number" value={draft.order} onChange={(e) => changeDraft(photo.id, { order: Number(e.target.value) })} /></label>
                        <label className="adm-edit-caption"><span>Caption</span><input value={draft.caption} onChange={(e) => changeDraft(photo.id, { caption: e.target.value })} /></label>
                      </div>
                      <label className="adm-check">
                        <input type="checkbox" checked={draft.published} onChange={(e) => changeDraft(photo.id, { published: e.target.checked })} />
                        <span>Tampil di publik</span>
                      </label>
                      <div className="adm-row-actions">
                        <button className="adm-primary small" type="button" onClick={() => save(photo.id)} disabled={busy}>Simpan</button>
                        <button className="adm-quiet" type="button" onClick={() => setEditing(null)}>Batal</button>
                      </div>
                    </div>
                  ) : (
                    <div className="adm-photo-body">
                      <div className="adm-photo-title">
                        <strong>{photo.title}</strong>
                        <span className="adm-tag">{photo.category}</span>
                        {photo.source === "arsip" && <span className="adm-tag muted">Arsip lama</span>}
                        {!photo.published && <span className="adm-tag off">Tersembunyi</span>}
                      </div>
                      {photo.caption && <p>{photo.caption}</p>}
                      <div className="adm-row-actions">
                        <button className="adm-quiet" type="button" onClick={() => startEdit(photo)}>Edit</button>
                        <button className="adm-danger" type="button" onClick={() => remove(photo)} disabled={busy}>Hapus</button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
            {visible.length === 0 && <p className="adm-empty">Tidak ada foto yang cocok.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
