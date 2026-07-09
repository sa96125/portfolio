import styled from "@emotion/styled";
import { useState, useEffect, useCallback, useRef } from "react";

/* ─── Types ────────────────────────────────────────── */
interface Note {
  id: string;
  body: string;
  updatedAt: number;
}

/* ─── Helpers ──────────────────────────────────────── */
// 기본 노트 내용이 바뀌면 키를 버전업해야 기존 방문자의 캐시를 무효화할 수 있음
const LS_KEY = "macos-notes-v6";

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return defaultNotes();
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(notes));
}

function defaultNotes(): Note[] {
  const now = Date.now();
  return [
    {
      id: crypto.randomUUID(),
      body: `SK실트론 조사.

[ 기본 ]

국내 유일 실리콘 웨이퍼 제조사.
12인치 기준 글로벌 3위 (점유율 약 17.8%). 1·2위는 일본 신에츠·섬코.
매출: 2022년 이후 2조대 유지.
2023년 약 2.4조(최고치) → 2024년 2조 1,268억 → 2025년 반등 추정(2.7조대 전망).
임직원 약 3,600명. 본사 경북 구미(구미국가산단).
모태: 1983년 '코실'(동부그룹·미국 몬산토 합작) → LG실트론 → 2017년 SK 인수.
총차입금 약 3조.

[ 사업 / 제품 ]

Si 웨이퍼: 폴리시드(HBM용) / 에피택셜(초미세 로직용). 주력은 12인치(300mm).
SiC 웨이퍼: 전력반도체용(전기차 등). 미국 듀폰 SiC 사업부 인수로 확보.
핵심 기술: 결정도(Defect Free Crystal) · 청정도(Particle Control) · 평탄도(Flat Surface).
웨이퍼 업계 최초 탄소발자국 인증 취득.

[ 사업장 ]

구미 본사: 생산 중심. 3공단 신공장 약 2.3조 투입, 연내 가동 예정(12인치 주력).
서울 사무소(종각): 영업·재무·신규사업·ESG·경영전략, 글로벌 HR.
미국 미시간 베이시티: SiC 웨이퍼 팹(CSS). 한-미 이원 운영.

[ 고객 / 시장 ]

주요 고객: 삼성전자·SK하이닉스·마이크론(메모리), 인텔·TSMC(비메모리).
삼성·하이닉스 두 곳이 매출의 큰 축(2020년 기준 약 60%).
지역별(2021 반기): 국내 48% / 아시아 39% / 북미 8% / 유럽 5%.
실리콘 웨이퍼는 일본·독일 등 소수 기업만 제조기술 보유. 진입장벽 높음.

[ 생산정보 데이터베이스 (커리어스저널 2025.04) ]

생산정보팀: 생산 시스템의 안정적 운영·구축 + 분석 시스템 담당.
DBMS 구성: MES → IBM DB2 / 생산정보 → Oracle / 일부 MS-SQL. 목적별 분리.
데이터 수집 경로: EIF(장비 인터페이스, 실시간), DAS(측정 데이터), IoT, MTS, RMS.
설계 3원칙: 목적성 / 가용성(HA) / 사용자 접근성.
보안: 사용자 DB 직접 접근 금지, 애플리케이션 경유만 허용. 계정·권한·방화벽 통제.
최근 방향: DAP(빅데이터·AI 분석 기반), IPS(이미지 처리로 결함 자동 분류·불량 유출 방지),
Map 자동 판정 무인화. "저장 시점에 AI로 즉시 결과 생성" 지향.
YMS 구축 당시 난점: 서로 다른 시스템 데이터를 조합해 제공,
사용자마다 요구가 달라 표준화가 어려웠음.

[ 정보보호 직무 (커리어스저널 2025.05) ]

웨이퍼 생산이 국가핵심기술 → 보안이 국가경쟁력과 직결. 사내 출입 보안 삼엄.
"회사가 나라라면 정보보호 정책은 법."
"정보를 지키려면 정보를 담는 그릇(시스템)부터 이해해야."
통제가 아니라 이상적 정책과 현실 업무의 균형(조율)을 강조.

[ 최근 이슈 (2026) ]

SK그룹, SK실트론 지분 70.6%를 두산그룹에 매각 추진(5조 규모).
2025.12 두산을 우선협상대상자 선정.
2026년 들어 AI 반도체 호황 → 12인치 웨이퍼 공급 부족 우려
→ 전략가치 재평가로 매각 제동/재검토.
배경: 그룹 화두가 '리밸런싱(긴축)'에서 'AI 팩토리 확장'으로 전환.
웨이퍼가 AI 밸류체인 밑단이라 하이닉스 수직계열화 시너지 논리.
최태원 회장: 향후 5년 내 웨이퍼 생산능력 2배 확대 계획 언급(컴퓨텍스 2026).`,
      updatedAt: now,
    },
  ];
}

function titleOf(body: string): string {
  const first = body.split("\n")[0].trim();
  return first || "새로운 메모";
}

function previewOf(body: string): string {
  const lines = body.split("\n");
  return (lines[1] ?? "").trim().slice(0, 50) || "추가 텍스트 없음";
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString("ko-KR", { month: "long", day: "numeric" });
}

function formatFullDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }) + " " + formatTime(ts);
}

type DateGroup = "Today" | "Yesterday" | "Previous 7 Days" | "Older";

function dateGroup(ts: number): DateGroup {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;
  const week = today - 86400000 * 7;

  if (ts >= today) return "Today";
  if (ts >= yesterday) return "Yesterday";
  if (ts >= week) return "Previous 7 Days";
  return "Older";
}

const GROUP_ORDER: DateGroup[] = ["Today", "Yesterday", "Previous 7 Days", "Older"];

function groupNotes(notes: Note[]): Map<DateGroup, Note[]> {
  const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  const map = new Map<DateGroup, Note[]>();
  for (const n of sorted) {
    const g = dateGroup(n.updatedAt);
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(n);
  }
  return map;
}

function shortDate(ts: number): string {
  const g = dateGroup(ts);
  if (g === "Today") return formatTime(ts);
  if (g === "Yesterday") return "어제";
  return formatDate(ts);
}

/* ─── Component ────────────────────────────────────── */
export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 마운트 시 첫 번째 메모 자동 선택
  useEffect(() => {
    if (selectedId === null && notes.length > 0) {
      const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
      setSelectedId(sorted[0].id);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist notes
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  const handleAdd = useCallback(() => {
    const note: Note = {
      id: crypto.randomUUID(),
      body: "",
      updatedAt: Date.now(),
    };
    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
    // Focus textarea after render
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, []);

  const handleDelete = useCallback(() => {
    if (!selectedId) return;
    setNotes((prev) => {
      const filtered = prev.filter((n) => n.id !== selectedId);
      // Select next note
      const sorted = [...filtered].sort((a, b) => b.updatedAt - a.updatedAt);
      setSelectedId(sorted[0]?.id ?? null);
      return filtered;
    });
  }, [selectedId]);

  const handleBodyChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!selectedId) return;
      const value = e.target.value;
      setNotes((prev) =>
        prev.map((n) =>
          n.id === selectedId ? { ...n, body: value, updatedAt: Date.now() } : n
        )
      );
    },
    [selectedId]
  );

  const grouped = groupNotes(notes);

  return (
    <Container>
      {/* ─── Sidebar ────────────────────── */}
      <Sidebar>
        <SidebarToolbar>
          <ToolBtn onClick={handleAdd} title="새로운 메모">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <line x1="5" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1" />
              <line x1="5" y1="8.5" x2="9" y2="8.5" stroke="currentColor" strokeWidth="1" />
            </svg>
          </ToolBtn>
          <ToolBtn onClick={handleDelete} disabled={!selectedId} title="메모 삭제">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 5h8l-.7 7.3a1.5 1.5 0 01-1.5 1.2H6.2a1.5 1.5 0 01-1.5-1.2L4 5z" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3 4.5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M6.5 3.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </ToolBtn>
        </SidebarToolbar>

        <NoteList>
          {GROUP_ORDER.map((group) => {
            const items = grouped.get(group);
            if (!items || items.length === 0) return null;
            return (
              <div key={group}>
                <GroupLabel>{group}</GroupLabel>
                {items.map((note) => (
                  <NoteItem
                    key={note.id}
                    active={note.id === selectedId}
                    onClick={() => setSelectedId(note.id)}
                  >
                    <NoteTitle>{titleOf(note.body)}</NoteTitle>
                    <NoteMetaRow>
                      <NoteDate>{shortDate(note.updatedAt)}</NoteDate>
                      <NotePreview>{previewOf(note.body)}</NotePreview>
                    </NoteMetaRow>
                  </NoteItem>
                ))}
              </div>
            );
          })}
          {notes.length === 0 && <EmptyHint>메모 없음</EmptyHint>}
        </NoteList>
      </Sidebar>

      {/* ─── Editor ─────────────────────── */}
      <Editor>
        {selected ? (
          <>
            <EditorDate>{formatFullDate(selected.updatedAt)}</EditorDate>
            <EditorTextarea
              ref={textareaRef}
              value={selected.body}
              onChange={handleBodyChange}
              placeholder="메모를 입력하세요…"
              spellCheck={false}
            />
          </>
        ) : (
          <EmptyEditor>메모를 선택하거나 새로 만드세요</EmptyEditor>
        )}
      </Editor>
    </Container>
  );
}

/* ─── Styles ───────────────────────────────────────── */
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: #1e1e1e;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
  font-size: 13px;
`;

const Sidebar = styled.div`
  width: 240px;
  min-width: 240px;
  background: #252525;
  border-right: 1px solid #383838;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SidebarToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid #383838;
`;

const ToolBtn = styled.button<{ disabled?: boolean }>`
  background: none;
  border: none;
  color: ${(p) => (p.disabled ? "#555" : "#f5bf4f")};
  cursor: ${(p) => (p.disabled ? "default" : "pointer")};
  padding: 4px 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const NoteList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 3px;
  }
`;

const GroupLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 16px 4px;
`;

const NoteItem = styled.div<{ active: boolean }>`
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 6px;
  margin: 1px 6px;
  background: ${(p) => (p.active ? "#f5bf4f22" : "transparent")};
  border-left: 3px solid ${(p) => (p.active ? "#f5bf4f" : "transparent")};

  &:hover {
    background: ${(p) => (p.active ? "#f5bf4f22" : "rgba(255,255,255,0.04)")};
  }
`;

const NoteTitle = styled.div`
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #f0f0f0;
`;

const NoteMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
`;

const NoteDate = styled.span`
  font-size: 11px;
  color: #888;
  white-space: nowrap;
  flex-shrink: 0;
`;

const NotePreview = styled.span`
  font-size: 11px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Editor = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  overflow: hidden;
`;

const EditorDate = styled.div`
  text-align: center;
  font-size: 11px;
  color: #777;
  padding: 12px 16px 4px;
  flex-shrink: 0;
`;

const EditorTextarea = styled.textarea`
  flex: 1;
  background: transparent;
  color: #e0e0e0;
  border: none;
  outline: none;
  resize: none;
  padding: 12px 20px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.6;

  &::placeholder {
    color: #555;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 3px;
  }
`;

const EmptyEditor = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 14px;
`;

const EmptyHint = styled.div`
  text-align: center;
  color: #555;
  padding: 24px;
  font-size: 13px;
`;
