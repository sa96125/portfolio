import styled from "@emotion/styled";
import { useCallback, useMemo, useRef, useState } from "react";
import DockItem from "./DockItem";
import { useWindows } from "../../hooks/useWindows";

import type { WindowKind } from "../../types/window";

interface WindowConfig {
  kind: WindowKind;
  title: string;
  width: number;
  height: number;
}

interface DockApp {
  id: string;
  label: string;
  icon: string;
  badge?: number;
  bounce?: boolean;
  window?: WindowConfig;
}

const ICON_SIZE = 50;
const GAP = 4;
const PAD = 10;
const MAGNIFY_RANGE = 130;
const MAX_SCALE = 1.35;

const APPS: DockApp[] = [
  { id: "finder",   label: "Finder",              icon: "/dock-icons/finder.png",   window: { kind: "finder",  title: "프로젝트", width: 860,  height: 540 } },
  { id: "safari",   label: "Safari",              icon: "/dock-icons/safari.png",   window: { kind: "safari",  title: "Safari",  width: 1024, height: 680 } },
  { id: "vscode",   label: "Visual Studio Code",  icon: "/dock-icons/vscode.png" },
  { id: "docker",   label: "Docker",              icon: "/dock-icons/docker.png" },
  { id: "intellij", label: "IntelliJ IDEA",       icon: "/dock-icons/intellij.png" },
  { id: "datagrip", label: "DataGrip",            icon: "/dock-icons/datagrip.png" },
  { id: "photos",   label: "사진",                icon: "/dock-icons/photos.png",   window: { kind: "photos",  title: "사진",    width: 960,  height: 620 } },
  { id: "notes",    label: "메모",                icon: "/dock-icons/notes.png",    window: { kind: "notes",   title: "메모",    width: 860,  height: 540 }, badge: 1, bounce: true },
  { id: "music",    label: "음악",                icon: "/dock-icons/music.png",    window: { kind: "music",   title: "음악",    width: 960,  height: 600 } },
  { id: "settings", label: "시스템 설정",          icon: "/dock-icons/settings.png" },
];

export default function Dock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const rafId = useRef(0);
  const { openWindow } = useWindows();

  const handleAppClick = useCallback(
    (id: string) => {
      const app = APPS.find((a) => a.id === id);
      if (!app?.window) return;
      const { kind, title, width, height } = app.window;
      const payload = kind === "finder" ? { folderId: "projects" } : {};
      openWindow({ id: `${kind}-main`, kind, title, payload, width, height });
    },
    [openWindow]
  );

  // Stable click handlers per app id
  const clickHandlers = useMemo(
    () => Object.fromEntries(APPS.map((app) => [app.id, () => handleAppClick(app.id)])),
    [handleAppClick]
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const clientX = e.clientX;
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMouseX(clientX - rect.left);
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    setMouseX(null);
  }, []);

  const getScale = (index: number) => {
    if (mouseX === null) return 1;
    const iconCenter = PAD + index * (ICON_SIZE + GAP) + ICON_SIZE / 2;
    const dist = Math.abs(mouseX - iconCenter);
    if (dist > MAGNIFY_RANGE) return 1;
    const ratio = (1 + Math.cos((Math.PI * dist) / MAGNIFY_RANGE)) / 2;
    return 1 + (MAX_SCALE - 1) * ratio;
  };

  return (
    <Bar>
      <Glass
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {APPS.map((app, i) => (
          <DockItem
            key={app.id}
            label={app.label}
            icon={<AppIcon src={app.icon} alt={app.label} draggable={false} />}
            scale={getScale(i)}
            badge={app.badge}
            bounce={app.bounce}
            onClick={clickHandlers[app.id]}
          />
        ))}
      </Glass>
    </Bar>
  );
}

const Bar = styled.nav`
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 900;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const Glass = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${GAP}px;
  padding: 6px ${PAD}px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.04),
    0 8px 40px rgba(0, 0, 0, 0.12),
    inset 0 0.5px 0 rgba(255, 255, 255, 0.3);
`;

const AppIcon = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  user-select: none;
  pointer-events: none;
`;

