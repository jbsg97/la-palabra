"use client";

import { useEffect, useRef, useState } from "react";
import { useCompanion } from "@/hooks/useCompanion";
import { useReaderStore } from "@/lib/stores/readerStore";
import { VoiceButton } from "./VoiceButton";

export function CompanionPanel() {
  const {
    isOpen,
    isLoading,
    messages,
    closePanel,
    sendMessage,
    handleVoicePress,
    handleVoiceRelease,
    isRecording,
    isVoiceSupported,
    isSpeaking,
    stopSpeaking,
  } = useCompanion();

  const [textInput, setTextInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reader = useReaderStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || isLoading) return;
    sendMessage(textInput);
    setTextInput("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={closePanel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Compañero de IA"
        className="fixed bottom-[64px] left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-app shrink-0">
          <div>
            <h2 className="text-app font-bold text-lg">Compañero Bíblico</h2>
            <p className="text-muted text-sm">
              {reader.bookName} {reader.chapterNumber}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                aria-label="Parar lectura"
                className="min-h-[48px] min-w-[48px] flex items-center justify-center text-accent font-semibold rounded-xl"
              >
                ⏹ Parar
              </button>
            )}
            <button
              onClick={closePanel}
              aria-label="Cerrar compañero"
              className="min-h-[48px] min-w-[48px] flex items-center justify-center text-muted text-2xl rounded-xl active:opacity-70"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 min-h-[120px]"
          aria-live="polite"
          aria-label="Conversación"
        >
          {messages.length === 0 && (
            <p className="text-muted text-center text-lg py-8">
              Pregúntame sobre {reader.bookName} {reader.chapterNumber} 🙏
            </p>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={[
                "max-w-[85%] px-4 py-3 rounded-2xl text-lg leading-relaxed",
                msg.role === "user"
                  ? "self-end bg-accent text-accent-fg rounded-br-sm"
                  : "self-start bg-secondary text-app rounded-bl-sm",
              ].join(" ")}
            >
              {msg.role === "assistant" && msg.content === "" && isLoading ? (
                <span className="animate-pulse">Pensando...</span>
              ) : (
                msg.content
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-4 pb-4 pt-3 border-t border-app shrink-0 flex flex-col gap-3">
          {isVoiceSupported && (
            <VoiceButton
              isRecording={isRecording}
              isLoading={isLoading}
              onPressStart={handleVoicePress}
              onPressEnd={handleVoiceRelease}
            />
          )}
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <label htmlFor="companion-input" className="sr-only">
              Escriba su pregunta
            </label>
            <input
              id="companion-input"
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Escriba su pregunta..."
              disabled={isLoading}
              className="flex-1 min-h-[52px] px-4 rounded-2xl border border-app bg-card text-app text-lg placeholder:text-muted disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button
              type="submit"
              disabled={isLoading || !textInput.trim()}
              aria-label="Enviar pregunta"
              className="min-h-[52px] min-w-[52px] bg-accent text-accent-fg rounded-2xl font-bold text-xl disabled:opacity-30 active:opacity-70"
            >
              ↑
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
