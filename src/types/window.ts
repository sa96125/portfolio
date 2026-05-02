export type WindowKind = "finder" | "viewer" | "pdf" | "video" | "safari" | "notes" | "music" | "photos";

export interface WindowPayload {
  folderId?: string;
  src?: string;
  file?: string;
  hasDocPath?: boolean;
}

export interface WindowPrev {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  kind: WindowKind;
  title: string;
  payload: WindowPayload;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  _prev?: WindowPrev;
}

export const TITLEBAR_H = 52;
export const MAX_WIN_H = 660;
export const MAX_WIN_W = 1000;
export const MENU_H = 28;
export const DOCK_H = 78;
