import styled from "@emotion/styled";
import { useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Lock } from "lucide-react";
import { useWindows } from "../../hooks/useWindows";
import { useGlobalStore } from "../../store/useGlobalStore";
import { SIDEBAR_SECTIONS, FOLDER_CONTENTS } from "../../data/finderData";
import type { FileItem } from "../../data/finderData";
import { TITLEBAR_H, MAX_WIN_H, MAX_WIN_W } from "../../types/window";

const DBLCLICK_DELAY = 400;

export default function FinderApp() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeFolder, setActiveFolder] = useState("TC인텔리전스");
  const [lockedAlert, setLockedAlert] = useState<string | null>(null);
  const { openWindow } = useWindows();
  const lastClickTime = useRef(0);
  const lastClickIdx = useRef(-1);

  const handleRowClick = useCallback((idx: number, item: FileItem) => {
    const now = Date.now();
    if (now - lastClickTime.current < DBLCLICK_DELAY && lastClickIdx.current === idx) {
      // 더블클릭 — 파일 열기
      lastClickTime.current = 0;
      lastClickIdx.current = -1;
      if (item.url) {
        const { openInSafari } = useGlobalStore.getState();
        openInSafari(item.url);
        openWindow({
          id: "safari-main",
          kind: "safari",
          title: "Safari",
          payload: {},
          width: 1024,
          height: 680,
        });
        return;
      }
      if (item.name.endsWith(".pdf")) {
        const file = item.docPath ? `/docs/${item.docPath}` : item.name;
        openWindow({
          id: `pdf-${item.name}`,
          kind: "pdf",
          title: item.name,
          payload: { file: item.name, src: file, hasDocPath: !!item.docPath },
          width: 820,
          height: 600,
        });
      } else if (item.name.endsWith(".png") || item.name.endsWith(".jpg") || item.name.endsWith(".jpeg")) {
        const src = item.docPath ? `/docs/${item.docPath}` : item.name;
        const img = new window.Image();
        img.src = src;
        img.onerror = () => {};
        img.onload = () => {
          const ratio = img.width / img.height;
          let contentH = Math.min(img.height, MAX_WIN_H - TITLEBAR_H);
          let contentW = Math.round(contentH * ratio);
          if (contentW > MAX_WIN_W) {
            contentW = MAX_WIN_W;
            contentH = Math.round(contentW / ratio);
          }
          openWindow({
            id: `viewer-${item.name}`,
            kind: "viewer",
            title: item.name,
            payload: { src },
            width: contentW,
            height: contentH + TITLEBAR_H,
          });
        };
      }
      return;
    }
    lastClickTime.current = now;
    lastClickIdx.current = idx;
    setSelectedIndex(idx);
  }, [openWindow]);

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-row]")) return;
    setSelectedIndex(null);
  }, []);

  const files = FOLDER_CONTENTS[activeFolder] ?? [];

  return (
    <Container>
      <Body>
        {/* ── 사이드바 ── */}
        <Sidebar>
          {SIDEBAR_SECTIONS.map((section) => (
            <SidebarSectionWrap key={section.label}>
              <SectionLabel>{section.label}</SectionLabel>
              {section.folders.map((folder) => (
                <SidebarRow
                  key={folder.name}
                  data-active={activeFolder === folder.name}
                  data-locked={folder.locked}
                  onClick={() => {
                    if (folder.locked) {
                      setLockedAlert(folder.name);
                      return;
                    }
                    setActiveFolder(folder.name);
                    setSelectedIndex(null);
                  }}
                >
                  <SidebarFolderIcon src="/dock-icons/folder.png" alt="" />
                  <span>{folder.name}</span>
                  {folder.locked && <Lock size={10} style={{ marginLeft: "auto", opacity: 0.4 }} />}
                </SidebarRow>
              ))}
            </SidebarSectionWrap>
          ))}
        </Sidebar>

        {/* ── 파일 리스트 ── */}
        <FileArea onMouseDown={handleContentClick}>
          <ColumnHeader>
            <ColName>
              Name <SortArrow>▲</SortArrow>
            </ColName>
            <ColDate>Date Modified</ColDate>
            <ColSize>Size</ColSize>
            <ColKind>Kind</ColKind>
          </ColumnHeader>

          <FileList>
            {files.length === 0 ? (
              <EmptyState>폴더가 비어 있음</EmptyState>
            ) : (
              files.map((item, idx) => (
                <FileRow
                  key={item.name}
                  data-row
                  data-selected={selectedIndex === idx}
                  data-even={idx % 2 === 0}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleRowClick(idx, item);
                  }}
                >
                  <ColName>
                    {item.isFolder && <ExpandArrow>▶</ExpandArrow>}
                    {item.isFolder ? (
                      <FolderIcon src="/dock-icons/folder.png" alt="" />
                    ) : item.kind === "PNG" && item.docPath ? (
                      <ThumbnailIcon src={`/docs/${item.docPath}`} alt="" />
                    ) : item.kind === "PDF" ? (
                      <PdfFileIcon />
                    ) : item.kind === "Link" ? (
                      <ApiFileIcon />
                    ) : (
                      <DocFileIcon />
                    )}
                    <FileName data-selected={selectedIndex === idx}>
                      {item.name}
                    </FileName>
                  </ColName>
                  <ColDate data-col="meta">{item.dateModified}</ColDate>
                  <ColSize data-col="meta">{item.size}</ColSize>
                  <ColKind data-col="meta">{item.kind}</ColKind>
                </FileRow>
              ))
            )}
          </FileList>
        </FileArea>
      </Body>

      {/* 잠금 폴더 경고 팝업 — 화면 전체 중앙 */}
      {lockedAlert && createPortal(
        <AlertOverlay onClick={() => setLockedAlert(null)}>
          <AlertBox onClick={(e) => e.stopPropagation()}>
            <AlertTitle>"{lockedAlert}" 폴더는 잠겨 있습니다</AlertTitle>
            <AlertMessage>
              이 폴더의 내용은 현재 준비 중입니다.<br />
              곧 공개될 예정이니 조금만 기다려 주세요.
            </AlertMessage>
            <AlertBtn onClick={() => setLockedAlert(null)}>확인</AlertBtn>
          </AlertBox>
        </AlertOverlay>,
        document.body
      )}
    </Container>
  );
}


/* ──────── Styled Components ──────── */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #2d2d2d;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
  font-size: 12px;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

/* ── 사이드바 ── */
const Sidebar = styled.div`
  width: 170px;
  flex-shrink: 0;
  background: rgba(45, 45, 48, 0.95);
  border-right: 1px solid #1a1a1a;
  padding: 8px 0;
  overflow-y: auto;
  user-select: none;
`;

const SidebarSectionWrap = styled.div`
  margin-bottom: 16px;
`;

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #888;
  padding: 4px 14px 4px;
  letter-spacing: 0.3px;
`;

const SidebarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 14px;
  cursor: default;
  font-size: 12px;
  color: #ccc;
  border-radius: 5px;
  margin: 0 6px;

  &[data-active="true"] {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
  }

  &:hover:not([data-active="true"]) {
    background: rgba(255, 255, 255, 0.06);
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const SidebarFolderIcon = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
`;

/* ── 파일 영역 ── */
const FileArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #282828;
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  height: 22px;
  background: #323232;
  border-bottom: 1px solid #1a1a1a;
  font-size: 11px;
  font-weight: 500;
  color: #999;
  flex-shrink: 0;
  padding-right: 8px;
`;

const ColName = styled.div`
  flex: 1;
  min-width: 0;
  padding-left: 24px;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
`;

const ColDate = styled.div`
  width: 180px;
  flex-shrink: 0;
  text-align: left;
`;

const ColSize = styled.div`
  width: 70px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 16px;
`;

const ColKind = styled.div`
  width: 80px;
  flex-shrink: 0;
  text-align: left;
`;

const SortArrow = styled.span`
  font-size: 8px;
  color: #666;
`;

const FileList = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }
`;

const FileRow = styled.div`
  display: flex;
  align-items: center;
  height: 26px;
  font-size: 12px;
  cursor: default;
  padding-right: 8px;

  &[data-even="true"] {
    background: rgba(255, 255, 255, 0.02);
  }

  [data-col="meta"] {
    color: #999;
  }

  &[data-selected="true"] {
    background: #0058d0;
    color: #fff;

    [data-col="meta"] {
      color: #fff;
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 13px;
`;

const ExpandArrow = styled.span`
  font-size: 8px;
  color: #666;
  width: 12px;
  flex-shrink: 0;
  text-align: center;
`;

const FolderIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
  margin-right: 4px;
`;

function PdfFileIcon() {
  return (
    <FileIconWrap>
      <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
        <path d="M8 2h14l8 8v22a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z" fill="#3a3a3a" stroke="#555" strokeWidth="1" />
        <path d="M22 2v6a2 2 0 002 2h6" fill="#444" stroke="#555" strokeWidth="1" strokeLinejoin="round" />
        <rect x="7" y="27" width="22" height="7" rx="1" fill="#e8453c" />
        <text x="18" y="32.6" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="700" fontFamily="system-ui">PDF</text>
      </svg>
    </FileIconWrap>
  );
}

function ApiFileIcon() {
  return (
    <FileIconWrap>
      <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
        <path d="M8 2h14l8 8v22a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z" fill="#3a3a3a" stroke="#555" strokeWidth="1" />
        <path d="M22 2v6a2 2 0 002 2h6" fill="#444" stroke="#555" strokeWidth="1" strokeLinejoin="round" />
        <rect x="7" y="24" width="22" height="10" rx="1" fill="#34c759" />
        <text x="18" y="31" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="system-ui">API</text>
      </svg>
    </FileIconWrap>
  );
}

function DocFileIcon() {
  return (
    <FileIconWrap>
      <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
        <path d="M8 2h14l8 8v22a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z" fill="#3a3a3a" stroke="#555" strokeWidth="1" />
        <path d="M22 2v6a2 2 0 002 2h6" fill="#444" stroke="#555" strokeWidth="1" strokeLinejoin="round" />
        <rect x="10" y="14" width="16" height="1.5" rx="0.75" fill="#666" />
        <rect x="10" y="18" width="12" height="1.5" rx="0.75" fill="#666" />
        <rect x="10" y="22" width="14" height="1.5" rx="0.75" fill="#666" />
      </svg>
    </FileIconWrap>
  );
}

const FileIconWrap = styled.div`
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThumbnailIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: cover;
  border-radius: 2px;
  border: 0.5px solid rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
  margin-right: 4px;
  vertical-align: middle;
`;

const FileName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &[data-selected="true"] {
    color: #fff;
  }
`;

/* ── 잠금 경고 팝업 (macOS 스타일) ── */
const AlertOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const AlertBox = styled.div`
  background: rgba(232, 230, 230, 0.75);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border-radius: 14px;
  padding: 28px 32px 20px;
  text-align: center;
  box-shadow:
    0 0 0 0.5px rgba(0, 0, 0, 0.1),
    0 8px 40px rgba(0, 0, 0, 0.25);
  width: 360px;
`;

const AlertTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const AlertMessage = styled.div`
  font-size: 12px;
  color: #555;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const AlertBtn = styled.button`
  width: 100%;
  background: linear-gradient(180deg, #FF453A 0%, #E0332A 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 0;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.3px;

`;
