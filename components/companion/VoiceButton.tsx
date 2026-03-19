"use client";

interface VoiceButtonProps {
  isRecording: boolean;
  isLoading: boolean;
  onPressStart: () => void;
  onPressEnd: () => void;
}

export function VoiceButton({ isRecording, isLoading, onPressStart, onPressEnd }: VoiceButtonProps) {
  return (
    <button
      onPointerDown={onPressStart}
      onPointerUp={onPressEnd}
      onPointerLeave={onPressEnd}
      disabled={isLoading}
      aria-label={isRecording ? "Grabando — suelte para enviar" : "Mantener presionado para hablar"}
      aria-pressed={isRecording}
      className={[
        "w-full min-h-[80px] rounded-2xl font-bold text-xl flex items-center justify-center gap-3",
        "select-none touch-none transition-all duration-100",
        isRecording
          ? "bg-red-500 text-white scale-95 shadow-lg"
          : "bg-accent text-accent-fg shadow-app",
        isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95",
      ].join(" ")}
    >
      <span
        className={isRecording ? "animate-pulse" : ""}
        aria-hidden="true"
      >
        🎤
      </span>
      {isRecording ? "Grabando... suelte para enviar" : "Mantener para hablar"}
    </button>
  );
}
