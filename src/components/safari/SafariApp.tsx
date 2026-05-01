import styled from "@emotion/styled";
import { useState, useCallback, useRef, useEffect } from "react";
import { useGlobalStore } from "../../store/useGlobalStore";

interface Tab {
  id: string;
  title: string;
  url: string;
}

let nextTabId = 4;

const INITIAL_TABS: Tab[] = [
  {
    id: "1",
    title: "tc.co.kr",
    url: "https://tc.co.kr/main/",
  },
  {
    id: "2",
    title: "현대자동차그룹",
    url: "https://www.hyundaimotorgroup.com/ko/story/CONT0000000000178954",
  },
  {
    id: "3",
    title: "Hyundai Robotics Lab",
    url: "https://robotics.hyundai.com/lab/about.do",
  },
];

export default function SafariApp() {
  const [tabs, setTabs] = useState<Tab[]>(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState("1");
  const [addressValue, setAddressValue] = useState(INITIAL_TABS[0].url);
  const addressRef = useRef<HTMLInputElement>(null);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  const handleSelectTab = useCallback(
    (id: string) => {
      setActiveTabId(id);
      const tab = tabs.find((t) => t.id === id);
      if (tab) setAddressValue(tab.url);
    },
    [tabs]
  );

  const handleCloseTab = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setTabs((prev) => {
        const next = prev.filter((t) => t.id !== id);
        if (next.length === 0) return prev;
        if (activeTabId === id) {
          const idx = prev.findIndex((t) => t.id === id);
          const newActive = next[Math.min(idx, next.length - 1)];
          setActiveTabId(newActive.id);
          setAddressValue(newActive.url);
        }
        return next;
      });
    },
    [activeTabId]
  );

  const handleAddTab = useCallback(() => {
    const id = String(nextTabId++);
    const newTab: Tab = { id, title: "새 탭", url: "" };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(id);
    setAddressValue("");
    setTimeout(() => addressRef.current?.focus(), 0);
  }, []);

  const handleAddressKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        let url = addressValue.trim();
        if (!url) return;
        if (!/^https?:\/\//i.test(url)) {
          url = "https://" + url;
        }
        setTabs((prev) =>
          prev.map((t) =>
            t.id === activeTabId
              ? { ...t, url, title: new URL(url).hostname }
              : t
          )
        );
        setAddressValue(url);
        addressRef.current?.blur();
      }
    },
    [addressValue, activeTabId]
  );

  useEffect(() => {
    if (activeTab) setAddressValue(activeTab.url);
  }, [activeTabId]);

  // 외부에서 Safari로 URL 열기
  const pendingUrl = useGlobalStore((s) => s.pendingSafariUrl);
  const clearPendingUrl = useGlobalStore((s) => s.clearPendingSafariUrl);
  useEffect(() => {
    if (!pendingUrl) return;
    const id = String(nextTabId++);
    let hostname = pendingUrl;
    try { hostname = new URL(pendingUrl).hostname; } catch {}
    const newTab: Tab = { id, title: hostname, url: pendingUrl };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(id);
    setAddressValue(pendingUrl);
    clearPendingUrl();
  }, [pendingUrl, clearPendingUrl]);

  return (
    <Wrapper>
      <TabBar>
        <TabList>
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              data-active={tab.id === activeTabId}
              onClick={() => handleSelectTab(tab.id)}
            >
              <TabTitle>{tab.title}</TabTitle>
              <CloseBtn onClick={(e) => handleCloseTab(e, tab.id)}>
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <path
                    d="M1,1 L7,7 M7,1 L1,7"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </CloseBtn>
            </TabItem>
          ))}
        </TabList>
        <AddTabBtn onClick={handleAddTab} title="새 탭">
          +
        </AddTabBtn>
      </TabBar>

      <AddressBar>
        <AddressIcon>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#999" strokeWidth="2" />
            <path d="M16.5 16.5L21 21" stroke="#999" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </AddressIcon>
        <AddressInput
          ref={addressRef}
          value={addressValue}
          onChange={(e) => setAddressValue(e.target.value)}
          onKeyDown={handleAddressKeyDown}
          placeholder="검색하거나 웹 사이트 이름을 입력하십시오"
          spellCheck={false}
        />
      </AddressBar>

      <IframeArea>
        {activeTab?.url ? (
          <StyledIframe
            key={activeTab.id}
            src={activeTab.url}
            title={activeTab.title}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        ) : (
          <EmptyPage>
            <EmptyText>새 탭</EmptyText>
            <EmptySub>주소창에 URL을 입력하세요</EmptySub>
          </EmptyPage>
        )}
      </IframeArea>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
`;

const TabBar = styled.div`
  display: flex;
  align-items: center;
  background: #2d2d2d;
  padding: 6px 8px 0;
  gap: 4px;
  border-bottom: 1px solid #1a1a1a;
`;

const TabList = styled.div`
  display: flex;
  gap: 2px;
  flex: 1;
  min-width: 0;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px 6px 0 0;
  background: #3a3a3a;
  cursor: pointer;
  min-width: 80px;
  max-width: 200px;
  flex-shrink: 0;
  transition: background 0.15s;

  &[data-active="true"] {
    background: #1e1e1e;
  }

  &:hover:not([data-active="true"]) {
    background: #444;
  }
`;

const TabTitle = styled.span`
  font-size: 11px;
  color: #ccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;

  [data-active="true"] & {
    color: #fff;
  }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }
`;

const AddTabBtn = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  padding: 2px 8px 6px;
  line-height: 1;
  border-radius: 4px;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }
`;

const AddressBar = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #2d2d2d;
  border-bottom: 1px solid #1a1a1a;
`;

const AddressIcon = styled.div`
  position: absolute;
  margin-left: 10px;
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 1;
`;

const AddressInput = styled.input`
  flex: 1;
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 6px 12px 6px 30px;
  color: #e0e0e0;
  font-size: 13px;
  outline: none;
  position: relative;

  &:focus {
    border-color: #5b9bd5;
    box-shadow: 0 0 0 2px rgba(91, 155, 213, 0.3);
  }

  &::placeholder {
    color: #666;
  }
`;

const IframeArea = styled.div`
  flex: 1;
  overflow: hidden;
  background: #fff;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const EmptyPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #1e1e1e;
`;

const EmptyText = styled.div`
  font-size: 28px;
  color: #666;
  font-weight: 300;
  margin-bottom: 8px;
`;

const EmptySub = styled.div`
  font-size: 13px;
  color: #555;
`;
