import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FALLBACK_MODELS, UNIKEY_DEFAULT_BASE } from "@/lib/unikey";
import { uid } from "@/lib/utils";

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
};

type Settings = {
  apiKey: string;
  model: string;
  baseUrl: string;
};

type ChatState = {
  hydrated: boolean;
  settings: Settings;
  conversations: Conversation[];
  currentId: string | null;
  setHydrated: () => void;
  setSettings: (patch: Partial<Settings>) => void;
  newChat: () => string;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  appendMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessage: (conversationId: string, messageId: string, content: string) => void;
};

function blankConversation(): Conversation {
  return {
    id: uid(),
    title: "แชทใหม่",
    messages: [],
    updatedAt: Date.now(),
  };
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      hydrated: false,
      settings: {
        apiKey: "",
        model: FALLBACK_MODELS[0].id,
        baseUrl: UNIKEY_DEFAULT_BASE,
      },
      conversations: [],
      currentId: null,
      setHydrated: () => set({ hydrated: true }),
      setSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      newChat: () => {
        const chat = blankConversation();
        set((s) => ({
          conversations: [chat, ...s.conversations],
          currentId: chat.id,
        }));
        return chat.id;
      },
      selectChat: (id) => set({ currentId: id }),
      deleteChat: (id) =>
        set((s) => {
          const conversations = s.conversations.filter((c) => c.id !== id);
          const currentId =
            s.currentId === id ? (conversations[0]?.id ?? null) : s.currentId;
          return { conversations, currentId };
        }),
      appendMessage: (conversationId, message) =>
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const title =
              c.title === "แชทใหม่" && message.role === "user"
                ? message.content.slice(0, 40) || c.title
                : c.title;
            return {
              ...c,
              title,
              messages: [...c.messages, message],
              updatedAt: Date.now(),
            };
          }),
        })),
      updateMessage: (conversationId, messageId, content) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id !== conversationId
              ? c
              : {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, content } : m,
                  ),
                  updatedAt: Date.now(),
                },
          ),
        })),
    }),
    {
      name: "ai-creator-chat",
      partialize: (s) => ({
        settings: s.settings,
        conversations: s.conversations,
        currentId: s.currentId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
        if (state && !state.currentId && state.conversations[0]) {
          state.selectChat(state.conversations[0].id);
        }
      },
    },
  ),
);
