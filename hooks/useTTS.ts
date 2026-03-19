"use client";

import { useState, useCallback, useEffect } from "react";
import { useSettingsStore } from "@/lib/stores/settingsStore";

// Detect support at module level (safe for SSR — window not accessed)
function checkTTSSupport() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isSupported = checkTTSSupport();
  const ttsRate = useSettingsStore((s) => s.ttsRate);
  const translation = useSettingsStore((s) => s.translation);

  useEffect(() => {
    return () => {
      if (checkTTSSupport()) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = translation === "rvr60" ? "es-ES" : "en-US";
      utterance.rate = ttsRate;
      utterance.pitch = 1;

      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) => v.lang.startsWith(utterance.lang.split("-")[0]));
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, ttsRate, translation]
  );

  const cancel = useCallback(() => {
    if (isSupported) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return { speak, cancel, isSpeaking, isSupported };
}
