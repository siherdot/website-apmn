import { Tab } from "@astryxdesign/core/TabList";
import { TabList } from "@astryxdesign/core/TabList";

export default function AdminTabs({ active }: { active: "foto" | "laporan" }) {
  return (
    <TabList value={active} onChange={() => {}} size="sm" aria-label="Navigasi admin">
      <Tab value="foto" label="Foto" href="/admin" />
      <Tab value="laporan" label="Laporan" href="/admin/laporan" />
    </TabList>
  );
}
