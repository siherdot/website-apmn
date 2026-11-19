"use client";

import NextLink from "next/link";
import { LinkProvider } from "@astryxdesign/core/Link";
import { InternationalizationProvider } from "@astryxdesign/core/i18n";
import { Theme } from "@astryxdesign/core/theme";
import { defaultThemeSlug, themes } from "../astryx-themes";

const bahasaIndonesia = {
  "@astryx.field.optional": "Opsional",
  "@astryx.field.required": "Wajib",
  "@astryx.fileInput.required": "Wajib",
  "@astryx.fileInput.placeholder": "Pilih berkas",
  "@astryx.fileInput.placeholderMultiple": "Pilih beberapa berkas",
};

export default function AstryxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Theme theme={themes[defaultThemeSlug]} mode="light">
      <InternationalizationProvider locale="id" overrides={{ id: bahasaIndonesia }}>
        <LinkProvider component={NextLink}>{children}</LinkProvider>
      </InternationalizationProvider>
    </Theme>
  );
}
