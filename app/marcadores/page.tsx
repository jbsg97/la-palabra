import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { BookmarksClient } from "@/components/bookmarks/BookmarksClient";

export default function MarcadoresPage() {
  return (
    <AppShell>
      <TopBar title="Mis Marcadores" />
      <div className="max-w-2xl mx-auto w-full px-4 py-4">
        <BookmarksClient />
      </div>
    </AppShell>
  );
}
