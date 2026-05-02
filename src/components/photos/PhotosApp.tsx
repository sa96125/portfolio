import styled from "@emotion/styled";
import { useState } from "react";

/* ─── Photo Data ───────────────────────────────────── */
interface Photo {
  id: string;
  src: string;
  label: string;
  date: string;
  favorite: boolean;
}

const ALL_PHOTOS: Photo[] = [
  { id: "1", src: "/docs/desktop_내사랑.jpeg", label: "내사랑", date: "2024-05", favorite: true },
  { id: "2", src: "/docs/데이트.jpeg", label: "데이트", date: "2024-05", favorite: true },
  { id: "3", src: "/docs/박종승_썸네일.jpeg", label: "썸네일", date: "2024-05", favorite: false },
  { id: "5", src: "/docs/박종승_여권사진.jpg", label: "여권사진", date: "2024-03", favorite: false },
  { id: "6", src: "/book1.jpg", label: "book1", date: "2024-01", favorite: false },
];

/* ─── Sidebar Data ─────────────────────────────────── */
interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  indent?: number;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const SIDEBAR: SidebarSection[] = [
  {
    title: "Photos",
    items: [
      { id: "library", label: "Library", icon: "library" },
      { id: "memories", label: "Memories", icon: "memories" },
      { id: "people", label: "People & Pets", icon: "people" },
      { id: "places", label: "Places", icon: "places" },
      { id: "favorites", label: "Favorites", icon: "favorites" },
      { id: "recents", label: "Recents", icon: "recents" },
      { id: "imports", label: "Imports", icon: "imports" },
    ],
  },
];

/* ─── Sidebar Icons ────────────────────────────────── */
function SIcon({ type }: { type: string }) {
  switch (type) {
    case "library":
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <rect x="1.5" y="3" width="5" height="4" rx="0.8" stroke="#aaa" strokeWidth="1" />
          <rect x="8.5" y="3" width="5" height="4" rx="0.8" stroke="#aaa" strokeWidth="1" />
          <rect x="1.5" y="8.5" width="5" height="4" rx="0.8" stroke="#aaa" strokeWidth="1" />
          <rect x="8.5" y="8.5" width="5" height="4" rx="0.8" stroke="#aaa" strokeWidth="1" />
        </svg>
      );
    case "memories":
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="5" stroke="#aaa" strokeWidth="1" />
          <path d="M7.5 4.5v3.5l2 1.5" stroke="#aaa" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
    case "people":
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="5.5" cy="5" r="2" stroke="#4fc3f7" strokeWidth="1" />
          <path d="M1.5 12c0-2 1.5-3 4-3s4 1 4 3" stroke="#4fc3f7" strokeWidth="1" strokeLinecap="round" />
          <circle cx="10.5" cy="5.5" r="1.5" stroke="#4fc3f7" strokeWidth="0.8" />
          <path d="M9 12c0-1.5 1-2 2-2s1.5.5 2 1" stroke="#4fc3f7" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
      );
    case "places":
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 2C5 2 3.5 4 3.5 6.5c0 3 4 6 4 6s4-3 4-6C11.5 4 10 2 7.5 2z" stroke="#aaa" strokeWidth="1" />
          <circle cx="7.5" cy="6.5" r="1.5" stroke="#aaa" strokeWidth="0.8" />
        </svg>
      );
    case "favorites":
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 3C6 1.5 3 1.5 2 3.5c-1 2 0 3.5 5.5 7.5C13 7 14 5.5 13 3.5 12 1.5 9 1.5 7.5 3z" fill="#fc3c44" />
        </svg>
      );
    case "recents":
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="5" stroke="#fc3c44" strokeWidth="1" />
          <path d="M7.5 4.5v3.5l2 1.5" stroke="#fc3c44" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
    case "imports":
      return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 2v8M4.5 7.5l3 3 3-3" stroke="#aaa" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.5 11v1.5h10V11" stroke="#aaa" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Component ────────────────────────────────────── */
export default function PhotosApp() {
  const [activeItem, setActiveItem] = useState("recents");
  const [viewPhoto, setViewPhoto] = useState<Photo | null>(null);

  const activeLabel = SIDEBAR.flatMap((s) => s.items).find((i) => i.id === activeItem)?.label ?? "";

  // Filter photos based on sidebar selection
  const photos = (() => {
    if (activeItem === "favorites") return ALL_PHOTOS.filter((p) => p.favorite);
    return ALL_PHOTOS;
  })();

  const dateLabel = (() => {
    if (photos.length === 0) return "";
    const dates = [...new Set(photos.map((p) => p.date))].sort();
    if (dates.length === 1) {
      const [y, m] = dates[0].split("-");
      const month = new Date(+y, +m - 1).toLocaleString("en-US", { month: "long" });
      return `${month} ${y}`;
    }
    return `${dates.length} Dates`;
  })();

  return (
    <Container>
      {/* ─── Sidebar ────────────────────── */}
      <Sidebar>
        {SIDEBAR.map((section) => (
          <SidebarGroup key={section.title}>
            <SectionTitle>{section.title}</SectionTitle>
            {section.items.map((item) => (
              <SidebarRow
                key={item.id}
                data-active={activeItem === item.id}
                style={{ paddingLeft: 16 + (item.indent ?? 0) * 16 }}
                onClick={() => setActiveItem(item.id)}
              >
                {item.indent ? (
                  <Chevron>
                    {item.indent === 1 && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M2 1l4 3-4 3" stroke="#666" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </Chevron>
                ) : null}
                <SIcon type={item.icon} />
                <span>{item.label}</span>
              </SidebarRow>
            ))}
          </SidebarGroup>
        ))}
      </Sidebar>

      {/* ─── Main ───────────────────────── */}
      <Main>
        {/* Toolbar */}
        <ToolbarArea>
          <ToolbarLeft>
            <ToolBtn title="Aspect Ratio">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="#aaa" strokeWidth="1.2" />
                <path d="M5 6.5l2.5-2 2.5 2" stroke="#aaa" strokeWidth="0.8" strokeLinejoin="round" />
              </svg>
            </ToolBtn>
            <ZoomArea>
              <ZoomLabel>-</ZoomLabel>
              <ZoomTrack><ZoomFill style={{ width: "40%" }} /><ZoomKnob style={{ left: "40%" }} /></ZoomTrack>
              <ZoomLabel>+</ZoomLabel>
            </ZoomArea>
          </ToolbarLeft>
          <ToolbarCenter>{photos.length} Photo{photos.length !== 1 ? "s" : ""}</ToolbarCenter>
          <ToolbarRight>
            <ToolBtn title="Info">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="#aaa" strokeWidth="1" />
                <path d="M8 7v4M8 5.5V5" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </ToolBtn>
            <ToolBtn title="Share">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v7" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M5.5 4.5L8 2l2.5 2.5" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.5 8v5a1 1 0 001 1h7a1 1 0 001-1V8" stroke="#aaa" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </ToolBtn>
            <ToolBtn title="Favorite">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 4C6.8 2.5 4.5 2.5 3.5 4c-1 1.5 0 3 4.5 6.5C12.5 7 13.5 5.5 12.5 4 11.5 2.5 9.2 2.5 8 4z" fill="#f5c542" />
              </svg>
            </ToolBtn>
            <SearchBox>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="5" cy="5" r="3.5" stroke="#888" strokeWidth="1.2" />
                <path d="M7.5 7.5L10 10" stroke="#888" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <SearchInput placeholder="Search" readOnly />
            </SearchBox>
          </ToolbarRight>
        </ToolbarArea>

        {/* Content */}
        <ContentArea>
          {viewPhoto ? (
            /* ── Full-size viewer ── */
            <ViewerOverlay>
              <BackBtn onClick={() => setViewPhoto(null)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 3L5 8l5 5" stroke="#4fc3f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </BackBtn>
              <ViewerImg src={viewPhoto.src} alt={viewPhoto.label} />
            </ViewerOverlay>
          ) : (
            <>
              <ContentHeader>
                <div>
                  <PageTitle>{activeLabel}</PageTitle>
                  {dateLabel && <DateSubtitle>{dateLabel}</DateSubtitle>}
                </div>
                <FilterLabel>Filter By: All Items</FilterLabel>
              </ContentHeader>
              <PhotoGrid>
                {photos.map((photo) => (
                  <PhotoCard key={photo.id} onDoubleClick={() => setViewPhoto(photo)}>
                    <PhotoThumb src={photo.src} alt={photo.label} draggable={false} />
                    {photo.favorite && (
                      <FavBadge>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 2.5C5 1.3 3.2 1.3 2.5 2.8c-.7 1.5 0 2.5 3.5 5 3.5-2.5 4.2-3.5 3.5-5C8.8 1.3 7 1.3 6 2.5z" fill="#fc3c44" />
                        </svg>
                      </FavBadge>
                    )}
                  </PhotoCard>
                ))}
              </PhotoGrid>
              {photos.length === 0 && <EmptyMsg>No Photos</EmptyMsg>}
            </>
          )}
        </ContentArea>
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
  padding-top: 4px;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
`;

const SidebarGroup = styled.div`
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
  gap: 6px;
  padding: 4px 12px 4px 16px;
  cursor: pointer;
  border-radius: 6px;
  margin: 1px 8px;
  font-size: 13px;
  color: #ddd;

  &[data-active="true"] {
    background: #0a60ff;
    color: #fff;
  }

  &:hover:not([data-active="true"]) {
    background: rgba(255,255,255,0.04);
  }
`;

const Chevron = styled.span`
  display: flex;
  align-items: center;
  width: 10px;
  flex-shrink: 0;
`;

/* ── Main ── */
const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/* ── Toolbar ── */
const ToolbarArea = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  border-bottom: 1px solid #3a3a3c;
  background: #2c2c2e;
  flex-shrink: 0;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToolbarCenter = styled.div`
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #bbb;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToolBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  opacity: 0.7;
  &:hover { opacity: 1; }
`;

const ZoomArea = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ZoomLabel = styled.span`
  font-size: 14px;
  color: #888;
  user-select: none;
  width: 12px;
  text-align: center;
`;

const ZoomTrack = styled.div`
  width: 60px;
  height: 3px;
  background: #555;
  border-radius: 2px;
  position: relative;
`;

const ZoomFill = styled.div`
  height: 100%;
  background: #aaa;
  border-radius: 2px;
`;

const ZoomKnob = styled.div`
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ddd;
  transform: translate(-50%, -50%);
  box-shadow: 0 1px 3px rgba(0,0,0,0.4);
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(255,255,255,0.06);
  border-radius: 6px;
  width: 140px;
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

/* ── Content ── */
const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
`;

const ContentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const PageTitle = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: #f0f0f0;
`;

const DateSubtitle = styled.div`
  font-size: 13px;
  color: #888;
  margin-top: 2px;
`;

const FilterLabel = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 8px;
  cursor: default;
`;

const PhotoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const PhotoCard = styled.div`
  position: relative;
  width: 160px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    border-color: #4fc3f7;
  }
`;

const PhotoThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const FavBadge = styled.div`
  position: absolute;
  bottom: 6px;
  left: 6px;
  display: flex;
`;

const EmptyMsg = styled.div`
  text-align: center;
  color: #555;
  font-size: 14px;
  padding: 60px 0;
`;

/* ── Viewer ── */
const ViewerOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const BackBtn = styled.button`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #4fc3f7;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;

  &:hover { opacity: 0.8; }
`;

const ViewerImg = styled.img`
  max-width: 100%;
  max-height: calc(100% - 40px);
  object-fit: contain;
  border-radius: 6px;
`;
