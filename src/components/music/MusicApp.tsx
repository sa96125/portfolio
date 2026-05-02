import styled from "@emotion/styled";
import { useState } from "react";

/* ─── Sidebar Data ─────────────────────────────────── */
interface SidebarItem {
  label: string;
  icon: string;          // SVG path or emoji-style icon
  color?: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const SIDEBAR: SidebarSection[] = [
  {
    title: "Apple Music",
    items: [
      { label: "Home", icon: "home", color: "#fc3c44" },
      { label: "Radio", icon: "radio", color: "#fc3c44" },
    ],
  },
  {
    title: "Library",
    items: [
      { label: "Recently Added", icon: "recent", color: "#fc3c44" },
      { label: "Artists", icon: "artist", color: "#fc3c44" },
      { label: "Albums", icon: "album", color: "#fc3c44" },
      { label: "Songs", icon: "song", color: "#fc3c44" },
    ],
  },
  {
    title: "Store",
    items: [
      { label: "iTunes Store", icon: "store", color: "#8e5af7" },
    ],
  },
  {
    title: "Playlists",
    items: [
      { label: "All Playlists", icon: "playlist", color: "#999" },
    ],
  },
];

/* ─── Mock Tracks ──────────────────────────────────── */
interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
}

const TRACKS: Track[] = [
  { id: "1", title: "NewJeans", artist: "뉴진스", cover: "/music/뉴진스.webp" },
  { id: "2", title: "PLAVE", artist: "플레이브", cover: "/music/플레이브.jpg" },
];

/* ─── Icon Components ──────────────────────────────── */
function SidebarIcon({ type, color }: { type: string; color?: string }) {
  const c = color ?? "#999";
  switch (type) {
    case "home":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2.5 6.5L8 2l5.5 4.5V13a1 1 0 01-1 1h-9a1 1 0 01-1-1V6.5z" stroke={c} strokeWidth="1.2" fill="none" />
          <path d="M6 14V9h4v5" stroke={c} strokeWidth="1.2" />
        </svg>
      );
    case "radio":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="10" r="2" stroke={c} strokeWidth="1.2" />
          <path d="M4.5 7.5a5 5 0 017 0" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M2.5 5.5a8 8 0 0111 0" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "recent":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="5.5" stroke={c} strokeWidth="1.2" />
          <path d="M8 5v3.5l2.5 1.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "artist":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 13.5c0-2.5-1.8-3.5-4-3.5s-4 1-4 3.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="8" cy="5.5" r="2.5" stroke={c} strokeWidth="1.2" />
        </svg>
      );
    case "album":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="12" rx="1.5" stroke={c} strokeWidth="1.2" />
          <circle cx="8" cy="8" r="2" stroke={c} strokeWidth="1" />
          <circle cx="8" cy="8" r="0.5" fill={c} />
        </svg>
      );
    case "song":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 12.5V4l7-1.5v8" stroke={c} strokeWidth="1.2" />
          <circle cx="4.5" cy="12.5" r="1.5" stroke={c} strokeWidth="1" />
          <circle cx="11.5" cy="10.5" r="1.5" stroke={c} strokeWidth="1" />
        </svg>
      );
    case "store":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <polygon points="8,1.5 9.8,5.5 14,6 10.8,9 11.8,13.5 8,11.2 4.2,13.5 5.2,9 2,6 6.2,5.5" stroke={c} strokeWidth="1" fill="none" />
        </svg>
      );
    case "playlist":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="3" height="3" rx="0.5" fill={c} opacity="0.6" />
          <rect x="6.5" y="2" width="3" height="3" rx="0.5" fill={c} opacity="0.6" />
          <rect x="11" y="2" width="3" height="3" rx="0.5" fill={c} opacity="0.6" />
          <rect x="2" y="6.5" width="3" height="3" rx="0.5" fill={c} opacity="0.6" />
          <rect x="6.5" y="6.5" width="3" height="3" rx="0.5" fill={c} opacity="0.6" />
          <rect x="11" y="6.5" width="3" height="3" rx="0.5" fill={c} opacity="0.6" />
          <rect x="2" y="11" width="3" height="3" rx="0.5" fill={c} opacity="0.6" />
          <rect x="6.5" y="11" width="3" height="3" rx="0.5" fill={c} opacity="0.6" />
          <rect x="11" y="11" width="3" height="3" rx="0.5" fill={c} opacity="0.6" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Component ────────────────────────────────────── */
export default function MusicApp() {
  const [activeItem, setActiveItem] = useState("Recently Added");

  return (
    <Container>
      {/* ─── Sidebar ────────────────────── */}
      <Sidebar>
        <SearchBox>
          <SearchIcon>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5" cy="5" r="3.5" stroke="#888" strokeWidth="1.2" />
              <path d="M7.5 7.5L10 10" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </SearchIcon>
          <SearchInput placeholder="Search" readOnly />
        </SearchBox>

        {SIDEBAR.map((section) => (
          <SidebarSection key={section.title}>
            <SectionTitle>{section.title}</SectionTitle>
            {section.items.map((item) => (
              <SidebarRow
                key={item.label}
                data-active={activeItem === item.label}
                onClick={() => setActiveItem(item.label)}
              >
                <SidebarIcon type={item.icon} color={item.color} />
                <span>{item.label}</span>
              </SidebarRow>
            ))}
          </SidebarSection>
        ))}
      </Sidebar>

      {/* ─── Main ───────────────────────── */}
      <Main>
        {/* Toolbar / Transport */}
        <Toolbar>
          <TransportControls>
            <TransportBtn title="Shuffle">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 12.5h2l4-7h3.5M3 5.5h2l4 7h3.5" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M13 3.5l2 2-2 2M13 10.5l2 2-2 2" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </TransportBtn>
            <TransportBtn title="Previous">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M12 4L6 9l6 5V4z" fill="#aaa" />
                <rect x="4" y="4" width="1.5" height="10" rx="0.5" fill="#aaa" />
              </svg>
            </TransportBtn>
            <PlayBtn title="Play">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M7 4.5v13l11-6.5L7 4.5z" fill="#aaa" />
              </svg>
            </PlayBtn>
            <TransportBtn title="Next">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6 4l6 5-6 5V4z" fill="#aaa" />
                <rect x="12.5" y="4" width="1.5" height="10" rx="0.5" fill="#aaa" />
              </svg>
            </TransportBtn>
            <TransportBtn title="Repeat">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 7h10a2 2 0 012 2v1M14 11H4a2 2 0 01-2-2V9" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M12.5 5l2 2-2 2M5.5 13l-2-2 2-2" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </TransportBtn>
          </TransportControls>

          <NowPlayingBar>
            <NowPlayingIcon>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12.5V4l7-1.5v8" stroke="#aaa" strokeWidth="1.2" />
                <circle cx="4.5" cy="12.5" r="1.5" fill="#aaa" />
                <circle cx="11.5" cy="10.5" r="1.5" fill="#aaa" />
              </svg>
            </NowPlayingIcon>
          </NowPlayingBar>

          <VolumeArea>
            <VolumeIcon>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 5.5h2l3-2.5v8L4 8.5H2a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5z" fill="#aaa" />
              </svg>
            </VolumeIcon>
            <VolumeTrack>
              <VolumeFill style={{ width: "65%" }} />
              <VolumeKnob style={{ left: "65%" }} />
            </VolumeTrack>
            <VolumeIcon>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 5.5h2l3-2.5v8L4 8.5H2a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5z" fill="#aaa" />
                <path d="M9.5 4a4.5 4.5 0 010 6M11 2.5a7 7 0 010 9" stroke="#aaa" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </VolumeIcon>
          </VolumeArea>
        </Toolbar>

        {/* Content */}
        <ContentHeader>
          <ContentTitle>Recently Added</ContentTitle>
          <HeaderActions>
            <HeaderBtn>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4h10M2 7h10M2 10h10" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </HeaderBtn>
            <HeaderBtn>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5" stroke="#aaa" strokeWidth="1.2" />
                <path d="M9.5 9.5L12 12" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </HeaderBtn>
          </HeaderActions>
        </ContentHeader>

        <ContentBody>
          <WeekLabel>This Week</WeekLabel>
          <AlbumGrid>
            {TRACKS.map((track) => (
              <AlbumCard key={track.id}>
                <AlbumCover src={track.cover} alt={track.artist} draggable={false} />
                <AlbumTitle>{track.title}</AlbumTitle>
              </AlbumCard>
            ))}
          </AlbumGrid>
        </ContentBody>
      </Main>
    </Container>
  );
}

/* ─── Styles ───────────────────────────────────────── */
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: #1c1c1e;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
  font-size: 13px;
`;

/* ── Sidebar ── */
const Sidebar = styled.div`
  width: 240px;
  min-width: 240px;
  background: #252527;
  border-right: 1px solid #3a3a3c;
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 12px 8px;
  padding: 5px 8px;
  background: rgba(255,255,255,0.06);
  border-radius: 6px;
`;

const SearchIcon = styled.div`
  flex-shrink: 0;
  display: flex;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #888;
  font-size: 12px;
  outline: none;
  cursor: default;

  &::placeholder { color: #666; }
`;

const SidebarSection = styled.div`
  margin-bottom: 4px;
`;

const SectionTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #777;
  padding: 10px 16px 4px;
  letter-spacing: 0.3px;
`;

const SidebarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 16px;
  cursor: pointer;
  border-radius: 6px;
  margin: 1px 8px;
  font-size: 13px;
  color: #ddd;

  &[data-active="true"] {
    background: rgba(255,255,255,0.1);
  }

  &:hover:not([data-active="true"]) {
    background: rgba(255,255,255,0.04);
  }
`;

/* ── Main ── */
const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/* ── Toolbar ── */
const Toolbar = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid #3a3a3c;
  background: #2c2c2e;
  flex-shrink: 0;
  gap: 12px;
`;

const TransportControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const TransportBtn = styled.button`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;

  &:hover { opacity: 1; }
`;

const PlayBtn = styled(TransportBtn)`
  opacity: 0.9;
  &:hover { opacity: 1; }
`;

const NowPlayingBar = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  height: 32px;
  background: rgba(255,255,255,0.04);
  border-radius: 6px;
  min-width: 0;
`;

const NowPlayingIcon = styled.div`
  display: flex;
  opacity: 0.5;
`;

const VolumeArea = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const VolumeIcon = styled.div`
  display: flex;
  opacity: 0.6;
`;

const VolumeTrack = styled.div`
  width: 80px;
  height: 3px;
  background: #555;
  border-radius: 2px;
  position: relative;
`;

const VolumeFill = styled.div`
  height: 100%;
  background: #aaa;
  border-radius: 2px;
`;

const VolumeKnob = styled.div`
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ddd;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 3px rgba(0,0,0,0.4);
`;

/* ── Content ── */
const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 4px;
  flex-shrink: 0;
`;

const ContentTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #f0f0f0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  opacity: 0.6;

  &:hover { opacity: 1; }
`;

const ContentBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 20px 20px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
`;

const WeekLabel = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #f0f0f0;
  margin-bottom: 12px;
`;

const AlbumGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const AlbumCard = styled.div`
  width: 170px;
  cursor: pointer;
`;

const AlbumCover = styled.img`
  width: 170px;
  height: 170px;
  border-radius: 8px;
  display: block;
  object-fit: cover;
  background: #2a2a2c;
`;

const AlbumTitle = styled.div`
  font-size: 11px;
  color: #aaa;
  margin-top: 6px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
