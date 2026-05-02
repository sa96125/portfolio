import styled from "@emotion/styled";
import { useRef, useState } from "react";
import { useGlobalStore } from "../../store/useGlobalStore";

type IconType = "image" | "folder" | "file" | "video";

const DBLCLICK_DELAY = 400;
const DRAG_THRESHOLD = 4;

interface Props {
  id: string;
  label: string;
  type?: IconType;
  thumbnail?: string;
  defaultX?: number;
  defaultY?: number;
  onDoubleClick?: () => void;
}

export default function DesktopIcon({
  id,
  label,
  type = "file",
  thumbnail,
  defaultX = 0,
  defaultY = 0,
  onDoubleClick,
}: Props) {
  const selected = useGlobalStore((s) => s.selectedIconId === id);
  const selectIcon = useGlobalStore((s) => s.selectIcon);
  const [pos, setPos] = useState({ x: defaultX, y: defaultY });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const lastClickTime = useRef(0);
  const onDoubleClickRef = useRef(onDoubleClick);
  onDoubleClickRef.current = onDoubleClick;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectIcon(id);

    // 더블클릭 감지: mousedown 시점에서 바로 판단
    const now = Date.now();
    if (now - lastClickTime.current < DBLCLICK_DELAY) {
      lastClickTime.current = 0;
      onDoubleClickRef.current?.();
      return;
    }
    lastClickTime.current = now;

    // 드래그 준비
    dragging.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startPos.current.x;
      const dy = ev.clientY - startPos.current.y;
      if (!dragging.current && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD) return;
      dragging.current = true;
      setPos({
        x: ev.clientX - offset.current.x,
        y: ev.clientY - offset.current.y,
      });
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <Wrapper
      tabIndex={0}
      data-selected={selected}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      onMouseDown={handleMouseDown}
    >
      {type === "video" && thumbnail ? (
        <ImagePreview>
          <video src={thumbnail} muted preload="metadata" draggable={false} />
        </ImagePreview>
      ) : type === "image" && thumbnail ? (
        <ImagePreview>
          <img src={thumbnail} alt={label} draggable={false} />
        </ImagePreview>
      ) : type === "folder" ? (
        <FolderImg src="/dock-icons/folder.png" alt={label} draggable={false} />
      ) : (
        <FileIcon>
          <FileDogear />
        </FileIcon>
      )}
      <Label data-selected={selected}>{label}</Label>
    </Wrapper>
  );
}

/* ── 공통 래퍼 ── */
const Wrapper = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  outline: none;
  width: 100px;
  user-select: none;
  will-change: transform;
`;

/* ── 이미지 미리보기 (macOS 스타일) ── */
const ImagePreview = styled.div`
  width: 80px;
  height: 64px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;

  img, video {
    max-width: 76px;
    max-height: 64px;
    object-fit: cover;
    border-radius: 3px;
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.2),
      0 4px 12px rgba(0, 0, 0, 0.12);
    border: 0.5px solid rgba(255, 255, 255, 0.3);
    background: #2a2a2c;
  }
`;

/* ── macOS 폴더 아이콘 (실제 추출 이미지) ── */
const FolderImg = styled.img`
  width: 64px;
  height: 54px;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
`;

/* ── macOS 파일 아이콘 ── */
const FileIcon = styled.div`
  width: 50px;
  height: 62px;
  background: linear-gradient(180deg, #fff 0%, #f0f0f0 100%);
  border-radius: 3px;
  position: relative;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.15),
    0 4px 10px rgba(0, 0, 0, 0.08);
  border: 0.5px solid rgba(0, 0, 0, 0.1);
`;

const FileDogear = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #e0e0e0 50%, #fff 50%);
  border-bottom-left-radius: 2px;
`;

/* ── 라벨 ── */
const Label = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: #fff;
  text-align: center;
  word-break: keep-all;
  line-height: 1.3;
  padding: 1px 6px;
  border-radius: 3px;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow:
    0 0 3px rgba(0, 0, 0, 0.6),
    0 1px 2px rgba(0, 0, 0, 0.5);

  &[data-selected="true"] {
    background: #007AFF;
    text-shadow: none;
  }
`;
