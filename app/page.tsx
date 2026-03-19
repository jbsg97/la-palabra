import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { HomeClient } from "@/components/home/HomeClient";

export default function HomePage() {
  return (
    <AppShell>
      <TopBar title="La Palabra" />
      <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        <HomeClient />
      </div>
    </AppShell>
  );
}
