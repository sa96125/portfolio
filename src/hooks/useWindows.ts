import { create } from "zustand";
import type { WindowState, WindowKind, WindowPayload } from "../types/window";
import { MENU_H, DOCK_H } from "../types/window";

let nextZ = 100;
let cascadeStep = 0;

interface WindowsState {
  windows: WindowState[];
  openWindow: (opts: {
    id: string;
    kind: WindowKind;
    title: string;
    payload?: WindowPayload;
    width?: number;
    height?: number;
  }) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
}

export const useWindows = create<WindowsState>((set, get) => ({
  windows: [],

  openWindow: ({ id, kind, title, payload = {}, width = 700, height = 500 }) => {
    const existing = get().windows.find((w) => w.id === id);
    if (existing) {
      get().focusWindow(id);
      return;
    }

    let ox: number;
    let oy: number;

    if (kind === "finder") {
      ox = Math.round(window.innerWidth / 2 - width / 2);
      oy = Math.round(window.innerHeight / 2 - height / 2);
    } else {
      const CASCADE_OFFSET = 30;
      const baseX = 80;
      const baseY = MENU_H + 20;
      ox = baseX + cascadeStep * CASCADE_OFFSET;
      oy = baseY + cascadeStep * CASCADE_OFFSET;
      cascadeStep += 1;

      if (ox + width > window.innerWidth - 40 || oy + height > window.innerHeight - DOCK_H - 20) {
        cascadeStep = 0;
        ox = baseX;
        oy = baseY;
      }
    }

    oy = Math.max(oy, MENU_H);

    nextZ += 1;
    const win: WindowState = {
      id,
      kind,
      title,
      payload,
      x: ox,
      y: oy,
      width,
      height,
      zIndex: nextZ,
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
    };

    set((s) => ({
      windows: [
        ...s.windows.map((w) => ({ ...w, isFocused: false })),
        win,
      ],
    }));
  },

  closeWindow: (id) => {
    set((s) => ({ windows: s.windows.filter((w) => w.id !== id) }));
  },

  focusWindow: (id) => {
    nextZ += 1;
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id
          ? { ...w, zIndex: nextZ, isFocused: true, isMinimized: false }
          : { ...w, isFocused: false }
      ),
    }));
  },

  updatePosition: (id, x, y) => {
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    }));
  },

  updateSize: (id, width, height) => {
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, width, height } : w)),
    }));
  },

  minimizeWindow: (id) => {
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
      ),
    }));
  },

  toggleMaximize: (id) => {
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          const prev = w._prev ?? { x: w.x, y: w.y, width: w.width, height: w.height };
          return { ...w, ...prev, isMaximized: false, _prev: undefined };
        }
        return {
          ...w,
          _prev: { x: w.x, y: w.y, width: w.width, height: w.height },
          x: 0,
          y: MENU_H,
          width: window.innerWidth,
          height: window.innerHeight - MENU_H - DOCK_H,
          isMaximized: true,
        };
      }),
    }));
  },
}));
