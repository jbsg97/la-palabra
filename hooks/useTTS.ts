"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSettingsStore } from "@/lib/stores/settingsStore";

// Detect support at module level (safe for SSR — window not accessed)
function checkTTSSupport() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Android Chrome silently drops utterances longer than ~300 chars — split by sentence
function splitIntoChunks(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  for (const s of sentences) {
    if (current.length + s.length > 300) {
      if (current) chunks.push(current.trim());
      current = s;
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSupported = checkTTSSupport();
  const ttsRate = useSettingsStore((s) => s.ttsRate);
  const translation = useSettingsStore((s) => s.translation);
  const cancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      if (checkTTSSupport()) window.speechSynthesis.cancel();
    };
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    if (isSupported) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text) return;
      cancelledRef.current = false;
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();

      const lang = translation === "rvr60" ? "es-ES" : "en-US";
      const chunks = splitIntoChunks(text);

      const speakChunk = (index: number, voices: SpeechSynthesisVoice[]) => {
        if (cancelledRef.current || index >= chunks.length) {
          setIsSpeaking(false);
          return;
        }
        const utterance = new SpeechSynthesisUtterance(chunks[index]);
        utterance.lang = lang;
        utterance.rate = ttsRate;
        utterance.pitch = 1;

        const preferred = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
        if (preferred) utterance.voice = preferred;

        if (index === 0) utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => speakChunk(index + 1, voices);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      };

      const start = (voices: SpeechSynthesisVoice[]) => speakChunk(0, voices);

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        start(voices);
      } else {
        window.speechSynthesis.addEventListener(
          "voiceschanged",
          () => start(window.speechSynthesis.getVoices()),
          { once: true }
        );
      }
    },
    [isSupported, ttsRate, translation]
  );

  return { speak, cancel, isSpeaking, isSupported };
}
