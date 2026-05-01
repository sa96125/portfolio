export type WindowKind = "finder" | "viewer" | "pdf" | "video" | "safari";

export interface WindowState {
  id: string;
  kind: WindowKind;
  title: string;
  payload: unknown;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
}
