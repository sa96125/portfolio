import styled from "@emotion/styled";
import { memo, useCallback, useRef, type ReactNode } from "react";
import { useWindows } from "../../hooks/useWindows";
import type { WindowState } from "../../types/window";

interface Props {
  win: WindowState;
  children: ReactNode;
  toolbarContent?: ReactNode;
  dark?: boolean;
}

export default memo(function WindowFrame({ win, children, toolbarContent, dark }: Props) {
  const { closeWindow, focusWindow, minimizeWindow, toggleMaximize, updatePosition, updateSize } = useWindows();
  const dragging = useRef(false);
  const resizing = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const rafId = useRef(0);

  /* ── 타이틀바 드래그 ── */
  const onDragStart = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-traffic]")) return;
      if (win.isMaximized) return;
      e.preventDefault();
      dragging.current = true;
      offset.current = { x: e.clientX - win.x, y: e.clientY - win.y };
      focusWindow(win.id);

      const onMove = (ev: MouseEvent) => {
        if (!dragging.current) return;
        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
          updatePosition(win.id, ev.clientX - offset.current.x, ev.clientY - offset.current.y);
        });
      };
      const onUp = () => {
        dragging.current = false;
        cancelAnimationFrame(rafId.current);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [win.id, win.x, win.y, win.isMaximized, focusWindow, updatePosition]
  );

  /* ── 리사이즈 ── */
  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      resizing.current = true;
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = win.width;
      const startH = win.height;

      const onMove = (ev: MouseEvent) => {
        if (!resizing.current) return;
        cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
          updateSize(win.id, Math.max(300, startW + ev.clientX - startX), Math.max(200, startH + ev.clientY - startY));
        });
      };
      const onUp = () => {
        resizing.current = false;
        cancelAnimationFrame(rafId.current);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [win.id, win.width, win.height, updateSize]
  );

  if (win.isMinimized) return null;

  return (
    <Frame
      style={{
        left: win.x,
        top: win.y,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      }}
      data-focused={win.isFocused}
      onMouseDown={() => focusWindow(win.id)}
    >
      <TitleBar onMouseDown={onDragStart} data-dark={dark}>
        <TrafficLights data-traffic>
          <TrafficBtn
            data-color="close"
            onClick={() => closeWindow(win.id)}
            aria-label="닫기"
          >
            <svg width="6" height="6" viewBox="0 0 6 6">
              <path d="M0.5,0.5 L5.5,5.5 M5.5,0.5 L0.5,5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </TrafficBtn>
          <TrafficBtn
            data-color="minimize"
            onClick={() => minimizeWindow(win.id)}
            aria-label="최소화"
          >
            <svg width="6" height="2" viewBox="0 0 6 2">
              <path d="M0.5,1 L5.5,1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </TrafficBtn>
          <TrafficBtn data-color="maximize" aria-label="전체화면" onClick={() => toggleMaximize(win.id)}>
            <svg width="6" height="6" viewBox="0 0 6 6">
              <path d="M0.5,3.5 L0.5,5.5 L2.5,5.5 M3.5,0.5 L5.5,0.5 L5.5,2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </TrafficBtn>
        </TrafficLights>
        {toolbarContent ?? <Title>{win.title}</Title>}
      </TitleBar>

      <Content>{children}</Content>

      <ResizeHandle onMouseDown={onResizeStart} />
    </Frame>
  );
});

const Frame = styled.div`
  position: fixed;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #ececec;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.08),
    0 12px 36px rgba(0, 0, 0, 0.18);
  transition: box-shadow 0.2s;
  will-change: transform;

  &[data-focused="false"] {
    box-shadow:
      0 0 0 0.5px rgba(0, 0, 0, 0.05),
      0 4px 16px rgba(0, 0, 0, 0.08);
  }
`;

const TitleBar = styled.div`
  height: 52px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  background: linear-gradient(180deg, #e8e6e6 0%, #d6d2d2 100%);
  user-select: none;
  cursor: default;
  flex-shrink: 0;
  position: relative;

  [data-focused="false"] & {
    background: linear-gradient(180deg, #f0efef 0%, #e5e3e3 100%);
  }

  &[data-dark="true"] {
    background: linear-gradient(180deg, #3d3d3d 0%, #343434 100%);
    border-bottom: 1px solid #1a1a1a;
  }
  [data-focused="false"] &[data-dark="true"] {
    background: linear-gradient(180deg, #3a3a3a 0%, #303030 100%);
  }
`;

const TrafficLights = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  position: relative;
  z-index: 1;

  /* 호버 시 아이콘 표시 */
  svg {
    opacity: 0;
    color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.1s;
  }
  &:hover svg {
    opacity: 1;
  }
`;

const TrafficBtn = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.1s;

  &[data-color="close"] {
    background: #FF5F57;
  }
  &[data-color="minimize"] {
    background: #FEBC2E;
  }
  &[data-color="maximize"] {
    background: #28C840;
  }

  &:active {
    filter: brightness(0.82);
  }

  /* 비활성 창 (라이트) */
  [data-focused="false"] & {
    background: #d4d4d4 !important;
    border-color: rgba(0, 0, 0, 0.06);
    svg { opacity: 0 !important; }
  }

  /* 다크 모드 버튼 */
  [data-dark="true"] & {
    border-color: rgba(0, 0, 0, 0.3);
  }
  [data-dark="true"] &[data-color="close"] {
    background: #FF5F57;
  }
  [data-dark="true"] &[data-color="minimize"] {
    background: #FEBC2E;
  }
  [data-dark="true"] &[data-color="maximize"] {
    background: #28C840;
  }

  /* 비활성 창 (다크) */
  [data-focused="false"] [data-dark="true"] & {
    background: #4a4a4a !important;
    border-color: rgba(255, 255, 255, 0.06);
    svg { opacity: 0 !important; }
  }
`;

const Title = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 80px;
  pointer-events: none;

  [data-focused="true"] & {
    color: #1d1d1f;
  }

  /* 다크 모드 타이틀 색상 */
  [data-dark="true"] & {
    color: #999;
  }
  [data-focused="true"] [data-dark="true"] & {
    color: #f0f0f0;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow: hidden;
`;

const ResizeHandle = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 14px;
  height: 14px;
  cursor: nwse-resize;
`;
