import styled from "@emotion/styled";
import { useCallback, useEffect } from "react";
import Wallpaper from "./Wallpaper";
import DesktopIcon from "./DesktopIcon";
import WindowFrame from "../window/WindowFrame";
import ViewerApp from "../viewer/ViewerApp";
import PdfViewerApp from "../viewer/PdfViewerApp";
import DataPipelineViewerApp from "../viewer/DataPipelineViewerApp";
import DataCollectionPipelineViewerApp from "../viewer/DataCollectionPipelineViewerApp";
import FinderApp from "../finder/FinderApp";
import FinderToolbar from "../finder/FinderToolbar";
import SafariApp from "../safari/SafariApp";
import { useWindows } from "../../hooks/useWindows";
import { useGlobalStore } from "../../store/useGlobalStore";

const TITLEBAR_H = 52;
const MAX_WIN_H = 660;

export default function Desktop() {
  const { windows, openWindow } = useWindows();
  const clearSelection = useGlobalStore((s) => s.clearSelection);

  const handleOpenImage = useCallback(() => {
    const img = new Image();
    img.src = "/docs/desktop_내사랑.jpeg";
    img.onload = () => {
      const ratio = img.width / img.height;
      const contentH = Math.min(img.height, MAX_WIN_H - TITLEBAR_H);
      const contentW = Math.round(contentH * ratio);
      openWindow({
        id: "viewer-wife",
        kind: "viewer",
        title: "내사랑",
        payload: { src: "/docs/desktop_내사랑.jpeg" },
        width: contentW,
        height: contentH + TITLEBAR_H,
      });
    };
  }, [openWindow]);

  const handleOpenVideo = useCallback(() => {
    const vid = document.createElement("video");
    vid.src = "/docs/desktop_딸내미.mp4";
    vid.onloadedmetadata = () => {
      const ratio = vid.videoWidth / vid.videoHeight;
      const contentH = Math.min(vid.videoHeight, MAX_WIN_H - TITLEBAR_H);
      const contentW = Math.round(contentH * ratio);
      openWindow({
        id: "video-daughter",
        kind: "video",
        title: "딸내미",
        payload: { src: "/docs/desktop_딸내미.mp4" },
        width: contentW,
        height: contentH + TITLEBAR_H,
      });
    };
  }, [openWindow]);

  const handleOpenFolder = useCallback(() => {
    openWindow({
      id: "finder-projects",
      kind: "finder",
      title: "프로젝트",
      payload: { folderId: "projects" },
      width: 860,
      height: 540,
    });
  }, [openWindow]);

  // Safari 미리 열기 (iframe 프리로드)
  useEffect(() => {
    openWindow({
      id: "safari-main",
      kind: "safari",
      title: "Safari",
      payload: {},
      width: 1024,
      height: 680,
    });
  }, []);

  const handleDesktopClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  return (
    <>
      <Wallpaper />

      <DesktopArea onMouseDown={handleDesktopClick}>
        <IconArea>
          <DesktopIcon
            id="icon-wife"
            label="내사랑"
            type="image"
            thumbnail="/docs/desktop_내사랑.jpeg"
            onDoubleClick={handleOpenImage}
          />
          <DesktopIcon
            id="icon-daughter"
            label="딸내미"
            type="video"
            thumbnail="/docs/desktop_딸내미.mp4"
            onDoubleClick={handleOpenVideo}
          />
          <DesktopIcon
            id="icon-projects"
            label="프로젝트"
            type="folder"
            onDoubleClick={handleOpenFolder}
          />
        </IconArea>
      </DesktopArea>

      {/* 열린 창들 렌더링 */}
      {windows.map((win) => (
        <WindowFrame
          key={win.id}
          win={win}
          dark={win.kind === "finder" || win.kind === "viewer" || win.kind === "pdf" || win.kind === "video" || win.kind === "safari"}
          toolbarContent={win.kind === "finder" ? <FinderToolbar /> : undefined}
        >
          {win.kind === "viewer" && (
            <ViewerApp
              src={(win.payload as { src: string }).src}
              alt={win.title}
            />
          )}
          {win.kind === "finder" && (
            <FinderApp />
          )}
          {win.kind === "video" && (
            <VideoContainer>
              <video
                src={(win.payload as { src: string }).src}
                controls
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </VideoContainer>
          )}
          {win.kind === "safari" && (
            <SafariApp />
          )}
          {win.kind === "pdf" && (
            (win.payload as { hasDocPath?: boolean })?.hasDocPath
              ? <embed
                  src={(win.payload as { src: string }).src}
                  type="application/pdf"
                  style={{ width: "100%", height: "100%", border: "none" }}
                />
              : (win.payload as { file?: string })?.file === "회고-도슨트네비게이션.pdf"
                ? <DataPipelineViewerApp />
                : (win.payload as { file?: string })?.file === "설계-데이터파이프라인-좌표수집.pdf"
                  ? <DataCollectionPipelineViewerApp />
                  : <PdfViewerApp />
          )}
        </WindowFrame>
      ))}
    </>
  );
}

const DesktopArea = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconArea = styled.div`
  position: absolute;
  top: 48px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;
