import styled from "@emotion/styled";
import { useCallback, useState } from "react";

/* ─── 실제 운영 스택을 그대로 올려둔 Docker Desktop ───
 * ⓘ 버튼: 각 컨테이너의 역할과 설계 노트(왜 이렇게 구성했는지)를 보여줍니다. */

type ContainerStatus = "running" | "exited" | "starting";

interface ContainerDef {
  id: string;
  name: string;
  image: string;
  ports?: string;
  initial: ContainerStatus;
  role: string;   // 스택에서 맡은 역할
  note: string;   // 설계 노트 — 운영하며 세운 기준
  logs: string[];
  startLogs?: string[];
}

const CONTAINERS: ContainerDef[] = [
  {
    id: "qfc-app",
    name: "qfieldcloud-app",
    image: "opengisch/qfieldcloud:latest",
    ports: "8011:8000",
    initial: "running",
    role: "현장 GPS 수집 앱(QField)의 서버. 공식 레포를 클론해 인증·스토리지·워커까지 마이크로서비스 전체를 직접 셋팅했다.",
    note: "단순 docker-compose 한 방이 아니라 다중 서비스 조합 — 의존 순서는 depends_on + healthcheck로 명시.",
    logs: [
      "[uwsgi] spawned 4 workers",
      "django.request  GET /api/v1/projects/  200",
      "django.request  POST /api/v1/deltas/   201",
      "sync: gps_point +214 rows (device: field-tablet-02)",
    ],
  },
  {
    id: "qfc-worker",
    name: "qfieldcloud-worker",
    image: "opengisch/qfieldcloud-worker",
    initial: "running",
    role: "수집 데이터 패키징·델타 적용을 처리하는 비동기 워커.",
    note: "무거운 작업은 앱에서 분리해 워커로. 앱이 죽어도 큐에 쌓인 작업은 유실되지 않는다.",
    logs: [
      "worker: waiting for jobs...",
      "job#5821 package  project=sayuwon  status=finished",
      "job#5822 delta_apply  applied=214 skipped=0",
    ],
  },
  {
    id: "postgis",
    name: "postgis",
    image: "postgis/postgis:15-3.4",
    ports: "5432:5432",
    initial: "running",
    role: "공간 데이터베이스. gps_point 저장 → 정제 트리거 자동 실행 → 라우팅 그래프 구성.",
    note: "수집 즉시 DB 트리거로 노이즈 제거·단순화·평탄화까지 자동 — 사람이 안 눌러도 도는 구조.",
    logs: [
      "LOG:  database system is ready to accept connections",
      "LOG:  trigger optimize_gps_track fired (rows=214)",
      "LOG:  checkpoint complete: wrote 118 buffers",
    ],
  },
  {
    id: "minio",
    name: "minio",
    image: "minio/minio",
    ports: "9000:9000",
    initial: "running",
    role: "S3 호환 오브젝트 스토리지. 수집 파일·첨부 문서 보관.",
    note: "파일은 DB가 아니라 오브젝트 스토리지에. 볼륨은 반드시 명시해 컨테이너 재생성에도 데이터 보존.",
    logs: ["API: http://0.0.0.0:9000", "bucket 'qfieldcloud-files' 1.2 GiB objects=3,481"],
  },
  {
    id: "redis",
    name: "redis",
    image: "redis:7-alpine",
    ports: "6379:6379",
    initial: "running",
    role: "캐시 + 잡 큐. 자주 조회되는 경로 캐싱, 워커 작업 큐잉.",
    note: "실시간 처리와 정적 자원을 분리하는 설계의 접점 — 서버 부하를 캐시가 흡수한다.",
    logs: ["* Ready to accept connections tcp", "keyspace hits=48211 misses=1042"],
  },
  {
    id: "neo4j",
    name: "neo4j",
    image: "neo4j:5.26",
    ports: "7474:7474, 7687:7687",
    initial: "exited",
    role: "온톨로지 그래프 DB. 업무 용어·규칙 간 관계를 구조화해 챗봇 할루시네이션을 제거한 핵심.",
    note: "벡터 검색이 못 잡는 '개념 사이의 관계'를 명시적 그래프로. 시스템 프롬프트 80% 절감.",
    logs: ["Stopped."],
    startLogs: [
      "Starting Neo4j.",
      "2026-07-09 12:00:01 INFO  Bolt enabled on 0.0.0.0:7687.",
      "2026-07-09 12:00:02 INFO  Remote interface available at http://localhost:7474/",
      "2026-07-09 12:00:02 INFO  Loaded ontology graph: 1,742 nodes / 5,318 relationships.",
      "2026-07-09 12:00:02 INFO  Started.",
    ],
  },
  {
    id: "qdrant",
    name: "qdrant",
    image: "qdrant/qdrant",
    ports: "6333:6333",
    initial: "running",
    role: "벡터 DB. 10만 건 사내 문서 RAG 검색의 저장소.",
    note: "Hybrid Search + Contextual Retrieval로 검색 정확도 70% → 95%.",
    logs: ["Qdrant gRPC listening on 6334", "collection 'docs' points=102,391 segments=8"],
  },
  {
    id: "n8n",
    name: "n8n",
    image: "n8nio/n8n",
    ports: "5678:5678",
    initial: "running",
    role: "업무 자동화 워크플로우 엔진. 임원 시황 리포트 파이프라인이 여기서 돈다.",
    note: "주기 배치 대신 이벤트 트리거(미팅 업로드) — 코드 전면 구현 대신 노드 기반 + Python 커스텀 노드.",
    logs: [
      "n8n ready on 0.0.0.0, port 5678",
      "workflow '시황리포트' triggered by event: meeting_uploaded",
      "workflow '시황리포트' finished successfully (18.2s)",
    ],
  },
];

export default function DockerApp() {
  const [status, setStatus] = useState<Record<string, ContainerStatus>>(
    Object.fromEntries(CONTAINERS.map((c) => [c.id, c.initial]))
  );
  const [selected, setSelected] = useState<string>("qfc-app");
  const [started, setStarted] = useState<Record<string, boolean>>({});
  const [helpFor, setHelpFor] = useState<string | null>(null);

  const sel = CONTAINERS.find((c) => c.id === selected)!;
  const help = CONTAINERS.find((c) => c.id === helpFor) ?? null;
  const runningCount = Object.values(status).filter((s) => s === "running").length;

  const toggle = useCallback((c: ContainerDef) => {
    setStatus((prev) => {
      const cur = prev[c.id];
      if (cur === "running") return { ...prev, [c.id]: "exited" };
      if (cur === "exited") {
        setTimeout(() => {
          setStatus((p) => ({ ...p, [c.id]: "running" }));
          setStarted((p) => ({ ...p, [c.id]: true }));
        }, 1300);
        return { ...prev, [c.id]: "starting" };
      }
      return prev;
    });
  }, []);

  const logsOf = (c: ContainerDef) =>
    status[c.id] === "running" && c.startLogs && started[c.id] ? c.startLogs : status[c.id] === "exited" ? ["Stopped."] : c.logs;

  return (
    <Wrap>
      <Side>
        <Brand>
          <Whale>🐳</Whale> Docker Desktop
        </Brand>
        <NavItem data-active="true">Containers</NavItem>
        <NavItem>Images</NavItem>
        <NavItem>Volumes</NavItem>
        <NavItem>Builds</NavItem>
        <EngineState>
          <Dot data-status="running" /> Engine running
        </EngineState>
      </Side>

      <Main>
        <Header>
          <h2>Containers</h2>
          <HeaderSub>
            portfolio-infra (compose) · {runningCount}/{CONTAINERS.length} running
          </HeaderSub>
          <NetworkBadge>
            network <strong>portfolio-net</strong> · bridge · 172.28.0.0/16
            <NetworkHint>— 서브넷·포트·볼륨은 기본값에 맡기지 않는다</NetworkHint>
          </NetworkBadge>
        </Header>

        <Table>
          <thead>
            <tr>
              <th style={{ width: 26 }} />
              <th>Name</th>
              <th>Image</th>
              <th>Port(s)</th>
              <th style={{ width: 118 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {CONTAINERS.map((c) => (
              <Row key={c.id} data-selected={c.id === selected} onClick={() => setSelected(c.id)}>
                <td>
                  <Dot data-status={status[c.id]} />
                </td>
                <td>
                  <CName>{c.name}</CName>
                  <CStatus>{status[c.id] === "starting" ? "starting…" : status[c.id]}</CStatus>
                </td>
                <td><CImage>{c.image}</CImage></td>
                <td><CPorts>{c.ports ?? "—"}</CPorts></td>
                <td>
                  <Actions onClick={(e) => e.stopPropagation()}>
                    <ActBtn
                      title={status[c.id] === "running" ? "Stop" : "Start"}
                      disabled={status[c.id] === "starting"}
                      onClick={() => toggle(c)}
                    >
                      {status[c.id] === "running" ? "⏹" : "▶"}
                    </ActBtn>
                    <ActBtn title="도움말 — 역할과 설계 노트" onClick={() => setHelpFor(c.id)}>
                      ⓘ
                    </ActBtn>
                  </Actions>
                </td>
              </Row>
            ))}
          </tbody>
        </Table>

        <LogPanel>
          <LogHeader>
            <Dot data-status={status[sel.id]} /> {sel.name} — Logs
          </LogHeader>
          <LogBody>
            {logsOf(sel).map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </LogBody>
        </LogPanel>
      </Main>

      {help && (
        <HelpOverlay onClick={() => setHelpFor(null)}>
          <HelpCard onClick={(e) => e.stopPropagation()}>
            <HelpTitle>
              <Dot data-status={status[help.id]} /> {help.name}
              <HelpImage>{help.image}</HelpImage>
            </HelpTitle>
            <HelpLabel>역할</HelpLabel>
            <HelpText>{help.role}</HelpText>
            <HelpLabel>설계 노트</HelpLabel>
            <HelpText>{help.note}</HelpText>
            <HelpClose onClick={() => setHelpFor(null)}>닫기</HelpClose>
          </HelpCard>
        </HelpOverlay>
      )}
    </Wrap>
  );
}

/* ─── styles ─── */

const Wrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: #10161d;
  color: #e0e6ed;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  position: relative;
  overflow: hidden;
`;

const Side = styled.div`
  width: 180px;
  background: #0b1016;
  border-right: 1px solid #1d2733;
  padding: 14px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 13.5px;
  padding: 0 8px 14px;
`;

const Whale = styled.span`
  font-size: 18px;
`;

const NavItem = styled.div`
  padding: 7px 10px;
  border-radius: 6px;
  color: #9fb0c0;
  cursor: pointer;
  font-size: 13px;

  &[data-active="true"] {
    background: #1c64f2;
    color: #fff;
  }
  &:hover:not([data-active="true"]) { background: #151d27; }
`;

const EngineState = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: #7c8b9a;
  padding: 8px;
`;

const Dot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
  background: #565f6b;

  &[data-status="running"] { background: #2ecc71; }
  &[data-status="starting"] {
    background: #f1c40f;
    animation: pulse 0.9s ease-in-out infinite;
  }
  @keyframes pulse { 50% { opacity: 0.35; } }
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Header = styled.div`
  padding: 16px 20px 10px;

  h2 { margin: 0; font-size: 17px; }
`;

const HeaderSub = styled.div`
  color: #7c8b9a;
  font-size: 12px;
  margin-top: 3px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;

  th {
    text-align: left;
    color: #7c8b9a;
    font-weight: 600;
    font-size: 11.5px;
    padding: 6px 10px;
    border-bottom: 1px solid #1d2733;
  }
  td {
    padding: 7px 10px;
    border-bottom: 1px solid #151d27;
    vertical-align: middle;
  }
`;

const Row = styled.tr`
  cursor: pointer;
  &[data-selected="true"] { background: #16202b; }
  &:hover:not([data-selected="true"]) { background: #131b24; }
`;

const CName = styled.div`
  font-weight: 600;
  color: #e0e6ed;
`;

const CStatus = styled.div`
  font-size: 11px;
  color: #7c8b9a;
`;

const CImage = styled.span`
  color: #9fb0c0;
  font-family: "SF Mono", Menlo, monospace;
  font-size: 11.5px;
`;

const CPorts = styled.span`
  color: #6ea8fe;
  font-family: "SF Mono", Menlo, monospace;
  font-size: 11.5px;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
`;

const ActBtn = styled.button`
  width: 30px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid #263241;
  background: #151d27;
  color: #cdd8e3;
  cursor: pointer;
  font-size: 12px;

  &:hover:not(:disabled) { background: #1f2a37; }
  &:disabled { opacity: 0.35; cursor: default; }
`;

const LogPanel = styled.div`
  margin-top: auto;
  height: 170px;
  border-top: 1px solid #1d2733;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;

const LogHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #9fb0c0;
  border-bottom: 1px solid #151d27;
`;

const LogBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 14px;
  font-family: "SF Mono", Menlo, monospace;
  font-size: 11.5px;
  line-height: 1.7;
  color: #a8c0a8;

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb { background: #263241; }
`;

const NetworkBadge = styled.div`
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: #9fb0c0;
  background: #131b24;
  border: 1px solid #1d2733;
  border-radius: 6px;
  padding: 4px 10px;
  font-family: "SF Mono", Menlo, monospace;

  strong { color: #6ea8fe; }
`;

const NetworkHint = styled.span`
  color: #6b7a89;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
`;

const HelpOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const HelpCard = styled.div`
  width: 400px;
  background: #131b24;
  border: 1px solid #263241;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
`;

const HelpTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 4px;
`;

const HelpImage = styled.span`
  margin-left: auto;
  font-weight: 400;
  font-size: 11px;
  color: #7c8b9a;
  font-family: "SF Mono", Menlo, monospace;
`;

const HelpLabel = styled.div`
  margin-top: 12px;
  font-size: 11px;
  font-weight: 700;
  color: #6ea8fe;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const HelpText = styled.div`
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.6;
  color: #cdd8e3;
`;

const HelpClose = styled.button`
  margin-top: 16px;
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #263241;
  background: #1c64f2;
  color: #fff;
  font-weight: 600;
  cursor: pointer;

  &:hover { background: #1a56d6; }
`;
