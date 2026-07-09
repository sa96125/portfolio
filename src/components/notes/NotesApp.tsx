import styled from "@emotion/styled";
import { useState, useEffect, useCallback, useRef } from "react";

/* ─── Types ────────────────────────────────────────── */
interface Note {
  id: string;
  body: string;
  updatedAt: number;
}

/* ─── Helpers ──────────────────────────────────────── */
const LS_KEY = "macos-notes";

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
      body: `SK실트론 AI&Data Platform.

[ 회사 리서치 ]

국내 유일 실리콘 웨이퍼 제조사. 글로벌 3위권.
반도체 칩의 기판이 되는 기초 소재 — 웨이퍼 없이는 칩도 없다.
매출 약 2조(2024), 임직원 3,600여 명. 본사 구미.

(생각)
학교(금오공대)가 구미라 이 동네 지리는 이미 빠삭함.
텍슨에서 웨이퍼 이송장비 만드는 회사 ERP를 운영했었는데,
그 장비가 옮기던 게 결국 이 회사가 만드는 웨이퍼였다.
장비 쪽에서 보던 공정을 이번엔 소재 쪽에서 보게 되는 셈.

[ 웨이퍼 공정과 데이터 ]

잉곳 성장 → 슬라이싱 → 폴리싱 → 세정 → 검사.
나노미터 단위 평탄도, 파티클 검사 —
사람 눈으로 못 잡는 영역이라 비전 AI가 제일 먼저 들어갈 자리.
단계마다 설비·센서 데이터가 쏟아지는 구조.

(궁금한점)
SK하이닉스는 웨이퍼 TEM 이미지 분석 AI를 논문으로도 냈던데,
실트론은 검사 데이터 파이프라인을 어디까지 자동화했을까?
결함 유형 분류 모델을 학습시키려면 라벨링 체계부터가 일일 텐데.
현장 검사원의 암묵지를 데이터 구조로 바꾸는 문제 —
사내 챗봇 만들 때 업무 용어를 온톨로지로 구조화했던 것과
본질이 같은 문제로 보인다.

[ AI&Data Platform — GPU 인프라 ]

채용공고 요지:
CPU/GPU 서버·스토리지·네트워크 구축과 운영,
GPU 자원 활용 현황 모니터링과 리소스 개선.
A100 / H100 / L40S.

(궁금한점)
GPU는 놀면 그대로 돈이 녹는다.
사내 LLM 검토 때 GCP에서 L4로 시작해 A100까지 올려가며
임베딩 모델과 Qwen 32B 양자화 모델을 직접 서빙해봤는데,
비용 때문에 스팟 인스턴스 + 자동 부팅 체계까지 만들었었다.
그때 배운 건 "GPU 도입"보다 "GPU 활용률"이 진짜 문제라는 것.
(결국 우리 규모에선 API 전환이 답이라 결론냈지만.)

학습·추론·검사 워크로드는 어떻게 분리할까?
MIG로 쪼개 쓰나, time-slicing인가, 스케줄러는 뭘 쓸까.
Prometheus/Grafana에 DCGM exporter 조합이 정석일 텐데
팹 데이터 파이프라인과는 어떻게 물려 있을지 궁금하다.

[ 컨테이너 기반 운영 ]

Docker, Kubernetes 기반 환경 운영·관리.
Cluster 가용성·성능·안정성 확보를 위한 운영 정책 수립.

(궁금한점)
제조업은 서비스 기업과 달리 "멈추면 안 되는 라인"이 기준점.
철강 ERP 운영하며 장애 대응해 본 입장에서
가용성 정책은 기술이 아니라 체질의 문제라는 걸 안다.

CI/CD가 ArgoCD면 GitOps 구조일 텐데,
팹이 폐쇄망이라면 이미지 레지스트리 미러링부터 풀어야 할 듯.
쿠버네티스는 Docker 운영 경험 위에 지금 공부 중 —
클러스터 운영 정책까지 세우는 레벨이 목표.

[ 운영 자동화 ]

우대사항: Shell Script / Python 기반 운영 자동화, IaC.

(생각)
반복 운영 업무를 파이프라인으로 바꾸는 건 이미 체질.
n8n으로 임원 시황 리포트 생성을 미팅 단위 자동화했고,
사유원 공간 데이터 측정·수집 파이프라인도 자동화로 구축했다.
GCP 스팟 GPU 자동 부팅 체계도 결국 같은 결 —
"사람이 안 눌러도 도는 구조"를 만드는 일.
IaC는 Terraform 쪽으로 정리해 볼 생각.

[ 보안 ]

IT 정보보안 업무(취약점 관리 등)가 업무에 명시되어 있음.

(궁금한점)
반도체 소재사는 기술 유출이 곧 존폐 문제라 당연한 배치인 듯.
LG 보안 취약점 검증 11개 항목을 통과시켰던 경험,
NAC·방화벽 운영 경험이 여기에 바로 이어진다.
서버 취약점 조치는 결국 "찾고-고치고-재발 막고"의 루프 —
자동화 붙이기 제일 좋은 업무이기도 하다.

[ 총평 ]

AI 밸류체인의 가장 밑단 — 웨이퍼 없이는 GPU도 없다.
그 회사가 이제 자기 공장을 위해 GPU 인프라를 쌓는다는 게
재미있는 순환 구조.

(생각)
장비 ERP → 철강 ERP → RAG/온톨로지 → GPU 도입 의사결정까지,
돌아보니 계속 "제조 현장 옆의 IT"를 해왔다.
넓게 쌓은 풀스택 경험이 인프라 운영에선 오히려 무기가 된다.
구미 본사, 기숙사도 가능하다니.
레쓰고`,
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
