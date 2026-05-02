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
      body: `현대자동차 로보틱스랩.

[ 안면인식 시스템 - Facey ]

Q. 기존 기술과 차별점이 뭔가?
(진문섭 파트장 - 제일 오른쪽)
휴대폰의 3D 인식은 거리 짧은 게 단점.
Facey는 2D 일반 카메라로 99.9% 정확도까지 끌어올렸다고 함.

(궁금한점)
차량으로 치면 라이다랑 카메라 차이인가?
3D 센서 대신 카메라+AI로 추정하는 구조인듯.

데이터셋과 도메인 최적화로 99.9% 굿.
근데 기준이 뭐지? 온세상쌍둥이들, 도플갱어들도 되나?
데이터 수집 어떻게 한거지? 테슬라식 데이터 플라이휠이 있나?

Q. 얼굴은 민감한 개인 정보다. 보호 기술은 뭔가?
(진문섭 파트장)
통신·데이터 암호화, 모의 해킹, 안티스푸핑, IR 카메라.

(궁금한점)
2D데이터셋 저장 방식이 뭘까?
안면정보는 벡터DB에 저장이 가능한가? 이것도 유사도 검증일까나?
쌍둥이는 어떻게하지, 이차인증이 있어야되나?

[ 시각언어모델 - VLM (온디바이스) ]

Q. VLM이 뭐고, 로보틱스랩의 VLM은 뭐가 다른가?
(진문섭 파트장)
시각 정보를 언어로 묘사·이해하는 기술.
로봇마다 튜닝해서 온디바이스로 작동.
프루닝·양자화로 경량화.

(궁금한점)
로봇마다 시나리오가 달라서 튜닝 방향도 다를 거고,
결국 도메인 적응 문제로 연결되는 흐름인 듯.

현대에서는 할루시네이션은 어떻게 막는지 궁금
로봇은 행동까지 이어지니까 더 엄격한 결정성이 필요할 텐데.
closed-set 추론?
어떻게 풀고 있을지 진짜 궁금하다.

[ 지능형 CCTV ]

Q. 이상 상황 감지 정확도는 얼마나 되나?
(윤용상 책임연구원)
자체 평가 기준으로 98.4%.
침입·배회·응급환자·싸움·기물 파손·오버크라우드·무단횡단 등 7가지 감지.

(궁금한점)
자체 구축한 평가셋 기준 -> 실전에서는 약점/위험이 될 수있음

복잡한 케이스를 구체적으로 나열한 것도 인상적이다.
추상적인 "AI 분석"이 아니라
어떤 시나리오에서 무엇을 잡아내는가를 풀어주는 게
신뢰의 핵심이라는 걸 다시 확인.

[ 로봇 관제 시스템 - NARCHON ]

Q. NARCHON이 뭔가?
(유정민 파트장)
"스마트시티·빌딩·공장에 통합 관제의 새로운 기준."
다양한 로봇과 인프라를 유기적으로 연결하는 중추 신경망.
엘리베이터 호출, 게이트 연동, 최적 경로 선정.

(궁금한점)
결국 핵심은 이기종 시스템 통합인 듯.
로봇·엘리베이터·게이트·주문 시스템을 하나의 흐름으로 묶는 일.
추상화 레벨이 인프라 단위라는 점에서
단순 로봇 컨트롤러가 아니라 공간 OS에 가까운 그림으로 읽힌다.

Q. 네트워크 불안정 상황은 어떻게 대처하나?
(유정민 파트장)
BPMN 2.0 하이브리드 워크플로우 엔진.
네트워크 단절 시에도 로봇이 독립적으로 시나리오 실행.
복구되면 동기화.

(궁금한점)
엣지에 시나리오 엔진이 분산되어 있고,
중앙은 동기화 허브 역할이라는 구조로 보인다. 최근에 작업한 QFC와 같은 원리인가?
찾아보니 거의 유사함. 네트워크 없는 환경에서 수집한후 연결되면 동기화
(분산 시스템에서 흔히 쓰는 eventual consistency 패턴이라함)
로봇 관제에 가져온 셈. 합리적인 선택인 듯.

근데 시나리오 겹침은 어떻게 처리하는 걸까?
인포그래픽 보면 그래프DB가 아니라 워크플로우 기반 같은데.
BPMN은 본질적으로 결정론적 플로우 정의 도구라,
사전에 정의되지 않은 충돌 상황에서 우선순위 매기는 게 까다로울 거다.

RAG 작업하면서 워크플로우 중복과 퓨샷 간섭 때문에
잘못된 답이 나오는 걸 경험한 적이 있는데,
결국 그래프DB로 관계를 명시한 뒤에야 안정됐다.

NARCHON도 결정론적 워크플로우 위에
온톨로지 기반 상황 판단이 한 층 더 얹히는 게
자연스러운 진화 방향 아닐까 싶다.
혹시 이미 그쪽으로 가고 있는데 기사에 안 풀어놓은 건지도 궁금하다.

[ SPOT 자율주행 페이로드 ]

Q. 페이로드가 뭐고 뭐가 개선됐나?
(김태호 파트장)
보스턴다이내믹스 SPOT 위에 탑재되는 자체 개발 모듈.
3세대까지 진화. 14kg → 8kg 경량화.
비전 AI·자율주행·음성 발화 온디바이스 통합.

(궁금한점)
한 줄이 머리에 박힌다.
"각 기능을 구현하는 것은 어렵지 않다. 통합하고 제어해서 가치로 만드는 게 어렵다."
이게 이 기사 전체의 진짜 메시지 같다.
모델 하나하나의 성능보다
그것들을 묶어 운영 가능한 시스템으로 만드는 일이
진짜 난이도라는 것 — 일하면서 매번 같은 결론에 도달한다.

[ DAL-e / DAL-e 딜리버리 ]

Q. DAL-e의 정체성은?
(이의혁 파트장)
로보틱스랩 기술의 통합 정수.
휴먼 감정·추론 인식, 자율주행, 멀티모달 대화.
TTS·STT가 목소리 억양·감정까지 분석.

(궁금한점)
음성 억양과 감정까지 합성·분석에 들어간다는 건
멀티모달의 깊이가 한 층 더 들어간 단계라는 뜻.
텍스트 응답이 아니라 어떤 감정으로 말할 것인가까지 결정은 데이터셋 사람마다 달라서
통계학적 기준점으로 처리가 가능한 영역일지도?

엘리베이터 단차 극복이 포인트로 들어간 건 사용자입장에서 좀 아쉽.
배송 로봇의 기본 요건에 가까운 부분이라.
더 인상적인 통합 사례가 있을 텐데 그쪽이 강조됐으면 좋았을 듯.
근데 사유원에서 멧돼지 없앨려고 로봇구입한다는데, 현대차도 가능할까?

[ 총평 ]
"휴머니티를 향한 진보 (Progress for Humanity)."
로봇이 인간의 삶을 더욱 풍요롭고 안전하게.
실제 사회에 가치를 제공하는 로봇 솔루션을 만드는 회사

(생각)
회사의 이념과 내가 살아온 삶과 결이 같다.
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
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const n = loadNotes();
    return n.length > 0 ? n.sort((a, b) => b.updatedAt - a.updatedAt)[0].id : null;
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
