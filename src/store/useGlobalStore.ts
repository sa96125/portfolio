import { create } from "zustand";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface GlobalState {
  isChatbotOpen: boolean;
  toggleChatbot: () => void;
  closeChatbot: () => void;
  isAboutOpen: boolean;
  openAbout: () => void;
  closeAbout: () => void;
  selectedIconId: string | null;
  selectIcon: (id: string) => void;
  clearSelection: () => void;
  messages: Message[];
  addMessage: (role: "user" | "assistant", content: string) => void;
  pendingSafariUrl: string | null;
  openInSafari: (url: string) => void;
  clearPendingSafariUrl: () => void;
}

let msgId = 0;

export const useGlobalStore = create<GlobalState>((set) => ({
  isChatbotOpen: false,
  toggleChatbot: () => set((s) => ({ isChatbotOpen: !s.isChatbotOpen })),
  closeChatbot: () => set({ isChatbotOpen: false }),
  isAboutOpen: false,
  openAbout: () => set({ isAboutOpen: true }),
  closeAbout: () => set({ isAboutOpen: false }),
  selectedIconId: null,
  selectIcon: (id) => set({ selectedIconId: id }),
  clearSelection: () => set({ selectedIconId: null }),
  messages: [],
  addMessage: (role, content) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { id: String(++msgId), role, content, timestamp: Date.now() },
      ],
    })),
  pendingSafariUrl: null,
  openInSafari: (url) => set({ pendingSafariUrl: url }),
  clearPendingSafariUrl: () => set({ pendingSafariUrl: null }),
}));
