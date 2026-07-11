import styled from "@emotion/styled";
import { useCallback, useState } from "react";
import { useGlobalStore } from "../../store/useGlobalStore";
import { useWindows } from "../../hooks/useWindows";

/* ─── 실제 운영 스택을 그대로 올려둔 Docker Desktop ───
 * 호스팅이 연결된 서비스는 hostedUrl에 실제 URL을 넣으면
 * "브라우저에서 열기"가 포트폴리오 Safari로 접속합니다. */

type ContainerStatus = "running" | "exited" | "starting";

interface ContainerDef {
  id: string;
  name: string;
  image: string;
  ports?: string;
  initial: ContainerStatus;
  hostedUrl?: string; // 실제 호스팅 연결 시 채움
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
    logs: ["API: http://0.0.0.0:9000", "bucket 'qfieldcloud-files' 1.2 GiB objects=3,481"],
  },
  {
    id: "redis",
    name: "redis",
    image: "redis:7-alpine",
    ports: "6379:6379",
    initial: "running",
    logs: ["* Ready to accept connections tcp", "keyspace hits=48211 misses=1042"],
  },
  {
    id: "neo4j",
    name: "neo4j",
    image: "neo4j:5.26",
    ports: "7474:7474, 7687:7687",
    initial: "exited",
    hostedUrl: "", // TODO: 호스팅 연결 시 실제 URL
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
    logs: ["Qdrant gRPC listening on 6334", "collection 'docs' points=102,391 segments=8"],
  },
  {
    id: "n8n",
    name: "n8n",
    image: "n8nio/n8n",
    ports: "5678:5678",
    initial: "running",
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
  const [toast, setToast] = useState<string | null>(null);
  const { openWindow } = useWindows();

  const sel = CONTAINERS.find((c) => c.id === selected)!;
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

  const openInBrowser = useCallback(
    (c: ContainerDef) => {
      if (c.hostedUrl) {
        useGlobalStore.getState().openInSafari(c.hostedUrl, c.name);
        openWindow({ id: "safari-main", kind: "safari", title: "Safari", payload: {}, width: 1024, height: 680 });
        return;
      }
      setToast("데모 환경 보호를 위해 외부 접속은 잠시 닫아두었습니다 — 시연은 면접에서 :)");
      setTimeout(() => setToast(null), 3200);
    },
    [openWindow]
  );

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
                    {c.ports && (
                      <ActBtn
                        title="브라우저에서 열기"
                        disabled={status[c.id] !== "running"}
                        onClick={() => openInBrowser(c)}
                      >
                        ↗
                      </ActBtn>
                    )}
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

      {toast && <Toast>{toast}</Toast>}
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

const Toast = styled.div`
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(20, 28, 38, 0.95);
  border: 1px solid #263241;
  color: #e0e6ed;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 12.5px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  white-space: nowrap;
`;
