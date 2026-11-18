import type { MetadataRoute } from "next";
import { pages, site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/galeri`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...pages.map((p) => ({
      url: `${site.url}/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
