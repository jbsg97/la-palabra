import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-app flex flex-col items-center justify-center px-6 text-center gap-6">
      <span className="text-7xl" aria-hidden="true">📖</span>
      <h1 className="text-3xl font-bold text-app">Sin conexión</h1>
      <p className="text-muted text-xl max-w-xs">
        No hay conexión a internet. Puede seguir leyendo la Biblia sin conexión.
      </p>
      <Link
        href="/"
        className="min-h-[64px] px-8 flex items-center justify-center bg-accent text-accent-fg rounded-2xl font-bold text-xl"
      >
        Ir al inicio
      </Link>
    </div>
  );
}
