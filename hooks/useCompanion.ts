"use client";

import { useCallback } from "react";
import { useCompanionStore } from "@/lib/stores/companionStore";
import { useReaderStore } from "@/lib/stores/readerStore";
import { useAudioRecorder } from "./useAudioRecorder";
import { useTTS } from "./useTTS";

export function useCompanion() {
  const store = useCompanionStore();
  const reader = useReaderStore();
  const recorder = useAudioRecorder();
  const tts = useTTS();

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim()) return;

      store.addUserMessage(userText);
      store.setLoading(true);
      store.startAssistantMessage();

      // Build passage context from reader store
      const passageContext = {
        translation: reader.translation === "rvr60" ? "Reina-Valera 1960" : "King James Version",
        bookName: reader.bookName,
        chapter: reader.chapterNumber,
        text:
          reader.currentBook?.chapters
            .find((c) => c.chapter === reader.chapterNumber)
            ?.verses.map((v) => `${v.verse}. ${v.text}`)
            .join(" ") ?? "",
      };

      // Keep last 6 messages (3 turns) for context
      const history = store.messages.slice(-7, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const res = await fetch("/api/companion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userMessage: userText,
            passageContext,
            conversationHistory: history,
          }),
        });

        if (!res.ok || !res.body) {
          store.appendChunk("Lo siento, hubo un problema. Por favor intente de nuevo.");
          store.setLoading(false);
          return;
        }

        const reader2 = res.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader2.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // Parse SSE: "data: {text}\n\n"
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const text = line.slice(6);
              if (text !== "[DONE]") {
                store.appendChunk(text);
                fullResponse += text;
              }
            }
          }
        }

        store.setLoading(false);

        // Auto-read the response aloud
        if (fullResponse) {
          tts.speak(fullResponse);
        }
      } catch {
        store.appendChunk("No hay conexión. El compañero de IA necesita internet.");
        store.setLoading(false);
      }
    },
    [store, reader, tts]
  );

  const handleVoicePress = useCallback(async () => {
    if (recorder.isRecording) return;
    await recorder.startRecording();
  }, [recorder]);

  const handleVoiceRelease = useCallback(async () => {
    if (!recorder.isRecording) return;
    const audioBlob = await recorder.stopRecording();
    if (!audioBlob || audioBlob.size < 1000) return; // Ignore very short recordings

    store.setLoading(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("language", "es");

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Transcription failed");
      const { text } = await res.json();

      if (text?.trim()) {
        await sendMessage(text);
      } else {
        store.setLoading(false);
      }
    } catch {
      store.setLoading(false);
    }
  }, [recorder, store, sendMessage]);

  return {
    ...store,
    isRecording: recorder.isRecording,
    isVoiceSupported: recorder.isSupported,
    isSpeaking: tts.isSpeaking,
    stopSpeaking: tts.cancel,
    handleVoicePress,
    handleVoiceRelease,
    sendMessage,
  };
}
