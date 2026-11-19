"use client";

import { useMemo, useState } from "react";
import { AspectRatio } from "@astryxdesign/core/AspectRatio";
import { Button } from "@astryxdesign/core/Button";
import { Lightbox } from "@astryxdesign/core/Lightbox";
import { Tab } from "@astryxdesign/core/TabList";
import { TabList } from "@astryxdesign/core/TabList";
import { Text } from "@astryxdesign/core/Text";
import type { Photo } from "@/lib/gallery-types";

export default function GalleryView({ photos }: { photos: Photo[] }) {
  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(photos.map((photo) => photo.category)))],
    [photos],
  );
  const [active, setActive] = useState("Semua");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const visible = active === "Semua" ? photos : photos.filter((p) => p.category === active);
  const media = visible.map((photo) => ({
    src: photo.src,
    alt: photo.title,
    caption: photo.caption || photo.category,
  }));

  return (
    <section className="page-section gallery-section">
      <div className="wrap">
        <div className="gallery-toolbar">
          <TabList
            value={active}
            onChange={(value) => {
              setActive(value);
              setSelectedIndex(null);
            }}
            size="sm"
            role="tablist"
            aria-label="Kategori foto"
          >
            {categories.map((category) => (
              <Tab key={category} value={category} label={category} />
            ))}
          </TabList>
          <Text type="supporting" color="secondary">
            {visible.length} foto
          </Text>
        </div>

        {visible.length === 0 ? (
          <Text as="p" color="secondary" className="gallery-empty">
            Belum ada foto yang tampil pada kategori ini.
          </Text>
        ) : (
          <div className="gallery-grid">
            {visible.map((photo, index) => (
              <button
                type="button"
                key={photo.id}
                className="gallery-card"
                aria-label={`Buka foto ${photo.title}`}
                onClick={() => setSelectedIndex(index)}
              >
                <AspectRatio ratio={4 / 3} fit="cover">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.src} alt={photo.title} loading="lazy" />
                </AspectRatio>
                <span className="gallery-card-body">
                  <Text type="supporting" weight="semibold" color="accent">
                    {photo.category}
                  </Text>
                  <Text type="label" weight="semibold">
                    {photo.title}
                  </Text>
                  {photo.caption && (
                    <Text type="supporting" color="secondary">
                      {photo.caption}
                    </Text>
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Lightbox
        isOpen={selectedIndex !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedIndex(null);
        }}
        media={media}
        index={selectedIndex ?? 0}
        onIndexChange={setSelectedIndex}
        hasZoom
      />
    </section>
  );
}
