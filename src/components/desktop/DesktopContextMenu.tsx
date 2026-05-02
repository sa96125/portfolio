import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { useGlobalStore } from "../../store/useGlobalStore";

interface Props {
  x: number;
  y: number;
  onClose: () => void;
}

const WALLPAPERS = [
  { path: "/wallpaper.jpg", label: "wallpaper.jpg" },
  { path: "/wallpaper2.jpeg", label: "wallpaper2.jpeg" },
  { path: "/wallpaper3.jpeg", label: "wallpaper3.jpeg" },
];

export default function DesktopContextMenu({ x, y, onClose }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [subOpen, setSubOpen] = useState(false);
  const wallpaper = useGlobalStore((s) => s.wallpaper);
  const setWallpaper = useGlobalStore((s) => s.setWallpaper);
  const [pos, setPos] = useState({ x, y });

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = x + rect.width > window.innerWidth ? window.innerWidth - rect.width - 6 : x;
    const ny = y + rect.height > window.innerHeight ? window.innerHeight - rect.height - 6 : y;
    if (nx !== pos.x || ny !== pos.y) setPos({ x: nx, y: ny });
  }, [x, y]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handleClick);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  return (
    <Menu ref={menuRef} style={{ left: pos.x, top: pos.y }}>
      <Item
        onMouseDown={(e) => {
          e.stopPropagation();
          window.location.reload();
        }}
        onMouseEnter={() => setSubOpen(false)}
      >
        새로고침
      </Item>

      <Sep />

      <SubTrigger
        onMouseEnter={() => setSubOpen(true)}
      >
        <span>배경화면</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>▶</span>
      </SubTrigger>

      {subOpen && (
        <SubMenu>
          {WALLPAPERS.map((wp) => (
            <SubItem
              key={wp.path}
              onMouseDown={(e) => {
                e.stopPropagation();
                setWallpaper(wp.path);
                onClose();
              }}
            >
              <Thumb src={wp.path} />
              <span>{wp.label}</span>
              {wallpaper === wp.path && <Check>✓</Check>}
            </SubItem>
          ))}
        </SubMenu>
      )}
    </Menu>
  );
}

const Menu = styled.div`
  position: fixed;
  z-index: 1100;
  min-width: 220px;
  background: rgba(52, 44, 44, 0.6);
  backdrop-filter: blur(32px) saturate(170%);
  -webkit-backdrop-filter: blur(32px) saturate(170%);
  border: 0.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.12),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.1);
  padding: 5px;
  animation: ctxIn 0.12s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes ctxIn {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Item = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  padding: 6px 10px;
  border-radius: 5px;
  cursor: default;
  user-select: none;

  &:hover {
    background: #3478f6;
    color: #fff;
  }
`;

const Sep = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 4px 10px;
`;

const SubTrigger = styled(Item)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SubMenu = styled.div`
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 2px;
  min-width: 200px;
  background: rgba(52, 44, 44, 0.6);
  backdrop-filter: blur(32px) saturate(170%);
  -webkit-backdrop-filter: blur(32px) saturate(170%);
  border: 0.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.12),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.1);
  padding: 5px;
`;

const SubItem = styled(Item)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Thumb = styled.img`
  width: 32px;
  height: 20px;
  border-radius: 3px;
  object-fit: cover;
  flex-shrink: 0;
`;

const Check = styled.span`
  margin-left: auto;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
`;
