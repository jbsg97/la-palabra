import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { SearchClient } from "@/components/search/SearchClient";

export default function BuscarPage() {
  return (
    <AppShell>
      <TopBar title="Buscar" />
      <div className="max-w-2xl mx-auto w-full px-4 py-4">
        <SearchClient />
      </div>
    </AppShell>
  );
}
