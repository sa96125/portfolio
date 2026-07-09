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
const LS_KEY = "macos-notes-v4";

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
      body: `SK실트론, 가서 뭘 할 수 있을까.

[ 회사소개 페이지 ]

국내 유일 실리콘 웨이퍼 제조사. 글로벌 3위권.
매출 약 2조(2024), 임직원 3,600여 명. 본사 구미.

(생각)
학교(금오공대)가 구미라 동네는 이미 잘 안다.
텍슨에서 웨이퍼 이송장비 회사 ERP를 운영했었는데,
그 장비가 나르던 게 결국 여기서 만드는 웨이퍼였다.
장비 쪽에서 보던 공정을 소재 쪽에서 다시 보는 셈.

[ 맛칩투어 - 실리콘 웨이퍼 편 ]

잉곳 성장 → 슬라이싱 → 폴리싱 → 세정 → 검사.
나노미터 평탄도, 파티클 하나로 수율이 갈리는 세계.
단계마다 설비·센서 데이터가 쏟아질 수밖에 없는 구조.

(궁금한점)
검사 이미지 데이터의 라벨링 체계는 누가 어떻게 잡고 있을까?
결함 분류 모델 학습용 GPU는 어떤 기준으로 배분하지?
검사원의 암묵지를 데이터 구조로 바꾸는 문제 —
철강에서 업무 용어를 온톨로지로 구조화했던 것과 본질이 같다.

(해보고 싶은 것)
공정 용어 온톨로지 + RAG로 "공정 지식 챗봇".
현장 용어를 아는 사람이 만들면 완성도가 다르다.

[ 걸어서 SiC 속으로 - 미국 CSS 팹 ]

SiC(전력반도체용) 웨이퍼는 미시간 베이시티에서.
한국-미국 이원 운영. 공정도 장비도 실리콘과 다르다.

(궁금한점)
한국-미국 간 데이터 플랫폼은 어떻게 묶여 있을까?
폐쇄망 정책이면 리전 간 동기화가 만만치 않을 텐데.
POSCO EAI로 이기종 시스템을 묶어본 경험이 닿는 지점일지도.

[ 웨이퍼 이야기 (SK커리어스저널) ]

폴리시드/에피 웨이퍼 구분. 에피는 초미세 로직용까지.
"소재는 반도체의 시작" — AI 밸류체인의 가장 밑단.

(생각)
웨이퍼 없이는 GPU도 없는데,
그 회사가 자기 공장을 위해 GPU 인프라를 쌓는 순환이 재밌다.

[ 생산정보 DB 기사 (커리어스저널) ]

생산정보팀 Pro 인터뷰. 이건 진짜 건졌다.
MES는 IBM DB2, 생산정보계는 Oracle, 일부 MSSQL.
MSSQL·Oracle 둘 다 지금 매일 만지는 DB라 반갑네.
장비 데이터는 EIF로 실시간 수집, 측정 데이터는 DAS.
IPS라는 이미지 자동 분류 시스템으로 불량 유출을 줄였다 함.
DB 설계 3원칙이 목적성·가용성(HA)·접근성.
사용자는 DB에 직접 못 붙고 앱을 통해서만 — 계정·방화벽 관리.

(생각)
POSCO 연동 때 MSSQL↔Oracle 데이터 체계 맞추던 거랑 겹친다.
과거 데이터를 AI/DT 학습에 쓴다는데,
그 학습 돌릴 GPU가 결국 AI&Data Platform 몫이겠지.
IPS 같은 비전 모델의 학습·서빙 파이프라인이
어떻게 생겼을지 제일 궁금하다.

[ 그래서, 내가 뭘 할 수 있나 ]

공고 요지: GPU 서버 운영·모니터링·리소스 개선,
Docker/K8s 클러스터 운영 정책, 취약점 관리.

1. GPU 활용률
월 30만 원 GCP Spot으로 워크로드를 실측하고
A100 40G 한 장에 32B를 올려봤다(QLoRA·4bit).
Spot 끊기면 자동 재기동까지.
"사기 전에 잰다"는 접근, 여기서도 통할 것.

2. 컨테이너 운영
다계열사 시스템을 컨테이너로 격리 운영 중.
Docker 기본 서브넷 충돌로 서버를 통째로 세워본 적 있다.
그날 이후 서브넷·포트·볼륨은 무조건 명시적으로.
띄우는 것과 지키는 것은 다른 일이다.
K8s는 그 위에 쌓는 중 — 클러스터 운영 정책까지가 목표.

3. 운영 자동화
Jenkins CI/CD, n8n·Python 파이프라인,
사유원 GPS 수집도 "사람이 안 눌러도 돌게" 만들었다.
취약점 관리도 결국 찾고-고치고-재발막는 루프. 자동화 각.

4. 보안
LG 취약점 검증 통과, NAC·방화벽 운영.
소재사는 기술 유출이 존폐 문제니 비중이 클 수밖에.

[ 결론 ]

장비 ERP → 철강 ERP → RAG/온톨로지 → GPU 실측.
돌아보니 계속 "제조 현장 옆의 IT"였다.
없는 자원에서 만들어봤으니, 갖춰진 자원에선 더 크게.

나머지 고민은... 면접에서 계속.`,
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
