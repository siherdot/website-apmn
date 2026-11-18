"use client";

import { useEffect, useMemo, useState } from "react";
import type { Photo } from "@/lib/gallery-types";

export default function GalleryView({ photos }: { photos: Photo[] }) {
  const categories = useMemo(() => ["Semua", ...Array.from(new Set(photos.map((p) => p.category)))], [photos]);
  const [active, setActive] = useState("Semua");
  const [selected, setSelected] = useState<Photo | null>(null);

  const visible = active === "Semua" ? photos : photos.filter((p) => p.category === active);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section className="section gallery-section">
      <div className="wrap">
        <div className="gallery-toolbar">
          <div className="gallery-tabs" role="tablist" aria-label="Kategori foto">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active === category}
                className={active === category ? "active" : ""}
                onClick={() => setActive(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <p>{visible.length} foto</p>
        </div>

        {visible.length === 0 ? (
          <p className="gallery-empty">Belum ada foto yang tampil pada kategori ini.</p>
        ) : (
          <div className="gallery-grid">
            {visible.map((photo) => (
              <button className="gallery-card" type="button" key={photo.id} onClick={() => setSelected(photo)}>
                <span className="gallery-thumb"><img src={photo.src} alt={photo.title} loading="lazy" /></span>
                <span className="gallery-meta">
                  <small>{photo.category}</small>
                  <strong>{photo.title}</strong>
                  {photo.caption && <span>{photo.caption}</span>}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}>
          <button className="gallery-close" type="button" aria-label="Tutup" onClick={() => setSelected(null)}>×</button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={selected.src} alt={selected.title} />
            <figcaption>
              <small>{selected.category}</small>
              <strong>{selected.title}</strong>
              {selected.caption && <span>{selected.caption}</span>}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
