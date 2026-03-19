"use client";

interface ChapterSelectorProps {
  totalChapters: number;
  currentChapter: number;
  bookName: string;
  onSelect: (chapter: number) => void;
  onClose: () => void;
}

export function ChapterSelector({
  totalChapters,
  currentChapter,
  bookName,
  onSelect,
  onClose,
}: ChapterSelectorProps) {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Seleccionar capítulo de ${bookName}`}
        className="fixed inset-x-0 bottom-[64px] top-0 z-50 bg-card flex flex-col max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-app shrink-0">
          <h2 className="text-app font-bold text-xl">{bookName}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar selector"
            className="min-h-[48px] min-w-[48px] flex items-center justify-center text-muted text-2xl rounded-xl"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: totalChapters }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => {
                  onSelect(n);
                  onClose();
                }}
                aria-label={`Capítulo ${n}`}
                aria-pressed={n === currentChapter}
                className={[
                  "min-h-[56px] rounded-2xl font-bold text-xl flex items-center justify-center",
                  n === currentChapter
                    ? "bg-accent text-accent-fg"
                    : "bg-secondary text-app active:bg-accent active:text-accent-fg",
                ].join(" ")}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
