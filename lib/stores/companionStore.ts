"use client";

import { create } from "zustand";

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface CompanionState {
  isOpen: boolean;
  isRecording: boolean;
  isLoading: boolean;
  messages: Message[];
  openPanel: () => void;
  closePanel: () => void;
  setRecording: (recording: boolean) => void;
  setLoading: (loading: boolean) => void;
  addUserMessage: (content: string) => void;
  startAssistantMessage: () => void;
  appendChunk: (chunk: string) => void;
  clearConversation: () => void;
}

export const useCompanionStore = create<CompanionState>()((set) => ({
  isOpen: false,
  isRecording: false,
  isLoading: false,
  messages: [],

  openPanel: () => set({ isOpen: true }),
  closePanel: () => set({ isOpen: false }),
  setRecording: (isRecording) => set({ isRecording }),
  setLoading: (isLoading) => set({ isLoading }),

  addUserMessage: (content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { role: "user", content, timestamp: Date.now() },
      ],
    })),

  startAssistantMessage: () =>
    set((state) => ({
      messages: [
        ...state.messages,
        { role: "assistant", content: "", timestamp: Date.now() },
      ],
    })),

  appendChunk: (chunk) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last?.role === "assistant") {
        messages[messages.length - 1] = { ...last, content: last.content + chunk };
      }
      return { messages };
    }),

  clearConversation: () => set({ messages: [] }),
}));
