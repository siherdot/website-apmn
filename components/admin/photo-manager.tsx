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

  const categoryOptions = [...GALLERY_CATEGORIES];
  const filterOptions = ["Semua", ...GALLERY_CATEGORIES];

  return (
    <div className="adm-shell">
      <header className="adm-top">
        <div>
          <Text type="supporting" weight="semibold" color="accent" className="adm-kicker">
            APMN / Content management
          </Text>
          <Heading level={1}>Manajer Foto</Heading>
          <Text as="p" color="secondary" className="adm-sub">
            Unggah foto baru, atur judul dan kategori, lalu tentukan mana yang tampil di
            galeri publik.
          </Text>
        </div>
        <div className="adm-actions">
          <AdminTabs active="foto" />
          <Link className="adm-link" href="/galeri" target="_blank" isStandalone isExternalLink>
            Lihat galeri
          </Link>
          <Link className="adm-link" href="/" target="_blank" isStandalone isExternalLink>
            Situs utama
          </Link>
          <Button label="Keluar" variant="secondary" onClick={logout} />
        </div>
      </header>

      <div className="adm-stats" aria-label="Ringkasan galeri">
        <div><Text type="supporting" color="secondary">Total foto</Text><Heading level={3}>{stats.total}</Heading></div>
        <div><Text type="supporting" color="secondary">Tampil di publik</Text><Heading level={3}>{stats.published}</Heading></div>
        <div><Text type="supporting" color="secondary">Arsip situs lama</Text><Heading level={3}>{stats.arsip}</Heading></div>
        <div><Text type="supporting" color="secondary">Kategori</Text><Heading level={3}>{stats.kategori}</Heading></div>
      </div>

      {error && <Banner status="error" title={error} container="card" />}
      {!error && notice && <Banner status="success" title={notice} container="card" />}

      <div className="adm-grid">
        <section className="adm-card adm-upload">
          <div className="adm-card-head">
            <Heading level={2}>Tambah foto</Heading>
            <Text type="supporting" color="secondary">
              JPG, PNG, WebP, atau GIF · maksimal 12 MB
            </Text>
          </div>
          <form className="admin-form-stack" onSubmit={upload}>
            <FileInput
              label="Berkas foto"
              value={file}
              onChange={(files) => setFile(Array.isArray(files) ? files[0] ?? null : files)}
              accept="image/jpeg,image/png,image/webp,image/gif"
              maxSize={12 * 1024 * 1024}
              isRequired
            />
            <TextInput
              label="Judul"
              value={title}
              onChange={(value) => setTitle(value)}
              placeholder="Contoh: Ruang perawatan"
              isRequired
            />
            <Selector
              label="Kategori"
              options={categoryOptions}
              value={category}
              onChange={(value) => setCategory(value)}
            />
            <TextArea
              label="Caption"
              value={caption}
              onChange={(value) => setCaption(value)}
              isOptional
              placeholder="Keterangan singkat"
              rows={3}
            />
            <CheckboxInput
              label="Tampilkan di galeri publik"
              value={published}
              onChange={(checked) => setPublished(checked)}
            />
            <Button
              label="Unggah foto"
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
              <Heading level={2}>Daftar foto</Heading>
              <Text type="supporting" color="secondary">
                {visible.length} dari {items.length} foto
              </Text>
            </div>
            <div className="adm-filters">
              <TextInput
                label="Cari foto"
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
            {visible.map((photo) => {
              const draft = drafts[photo.id];
              const isEditing = editing === photo.id && draft;
              return (
                <article className="adm-photo-row" key={photo.id}>
                  <img src={photo.src} alt="" loading="lazy" />
                  {isEditing ? (
                    <div className="adm-edit">
                      <div className="adm-edit-grid">
                        <TextInput
                          label="Judul"
                          value={draft.title}
                          onChange={(value) => changeDraft(photo.id, { title: value })}
                        />
                        <Selector
                          label="Kategori"
                          options={Array.from(new Set([...categoryOptions, draft.category]))}
                          value={draft.category}
                          onChange={(value) => changeDraft(photo.id, { category: value })}
                        />
                        <NumberInput
                          label="Urutan"
                          value={draft.order}
                          onChange={(value) => changeDraft(photo.id, { order: value })}
                        />
                        <div className="adm-edit-caption">
                          <TextInput
                            label="Caption"
                            value={draft.caption}
                            onChange={(value) => changeDraft(photo.id, { caption: value })}
                          />
                        </div>
                      </div>
                      <CheckboxInput
                        label="Tampil di publik"
                        value={draft.published}
                        onChange={(checked) => changeDraft(photo.id, { published: checked })}
                      />
                      <div className="adm-row-actions">
                        <Button label="Simpan" size="sm" variant="primary" isLoading={busy} onClick={() => save(photo.id)} />
                        <Button label="Batal" size="sm" variant="secondary" onClick={() => setEditing(null)} />
                      </div>
                    </div>
                  ) : (
                    <div className="adm-photo-body">
                      <div className="adm-photo-title">
                        <Text type="label" weight="semibold">{photo.title}</Text>
                        <Badge label={photo.category} variant="green" />
                        {photo.source === "arsip" && <Badge label="Arsip lama" variant="neutral" />}
                        {!photo.published && <Badge label="Tersembunyi" variant="orange" />}
                      </div>
                      {photo.caption && <Text type="supporting" color="secondary">{photo.caption}</Text>}
                      <div className="adm-row-actions">
                        <Button label="Edit" size="sm" variant="secondary" onClick={() => startEdit(photo)} />
                        <Button label="Hapus" size="sm" variant="destructive" isLoading={busy} onClick={() => remove(photo)} />
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
            {visible.length === 0 && <Text as="p" color="secondary" className="adm-empty">Tidak ada foto yang cocok.</Text>}
          </div>
        </section>
      </div>
    </div>
  );
}
