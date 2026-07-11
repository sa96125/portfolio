import styled from "@emotion/styled";
import { useEffect, useMemo, useRef, useState } from "react";
import controllerRaw from "./samples/StoreAdController.txt?raw";
import serviceRaw from "./samples/StoreAdService.txt?raw";
import securityRaw from "./samples/SecurityConfig.txt?raw";
import bootLog from "./samples/boot-log.txt?raw";

/* ─── 백엔드 코드 스타일을 보여주는 IntelliJ (darcula) ───
 * LG ThinQ 우리상가 백엔드 리딩 시절의 계층 설계·보안 구성 예시 */

interface JFile {
  name: string;
  pkg: string;
  content: string;
}

const FILES: JFile[] = [
  { name: "StoreAdController.java", pkg: "controller", content: controllerRaw },
  { name: "StoreAdService.java", pkg: "service", content: serviceRaw },
  { name: "SecurityConfig.java", pkg: "config", content: securityRaw },
];

const PACKAGES = ["controller", "service", "config"];

const JAVA_KW =
  /\b(public|private|protected|class|interface|record|final|static|return|new|if|else|void|throws|throw|extends|implements|package|import|this|true|false|null|var)\b/;

const JAVA_RE = new RegExp(
  [
    String.raw`(\/\/.*$|\/\*.*$|^\s*\*.*$)`, // 1 comment
    String.raw`("(?:[^"\\]|\\.)*")`, // 2 string
    String.raw`(@\w+)`, // 3 annotation
    JAVA_KW.source, // 4 keyword
  ].join("|"),
  "g"
);

function highlightJava(line: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  JAVA_RE.lastIndex = 0;
  let key = 0;
  while ((m = JAVA_RE.exec(line)) !== null) {
    if (m.index > last) out.push(<span key={key++}>{line.slice(last, m.index)}</span>);
    const [text] = m;
    const cls = m[1] ? "cm" : m[2] ? "str" : m[3] ? "ann" : "kw";
    out.push(<JTok key={key++} className={cls}>{text}</JTok>);
    last = m.index + text.length;
  }
  if (last < line.length) out.push(<span key={key++}>{line.slice(last)}</span>);
  return out;
}

const LOG_LINES = bootLog.split("\n");

export default function IntelliJApp() {
  const [active, setActive] = useState(FILES[0].name);
  const file = FILES.find((f) => f.name === active) ?? FILES[0];
  const lines = useMemo(() => file.content.split("\n"), [file]);

  /* Run 콘솔 — Spring Boot 기동 로그 애니메이션 */
  const [shown, setShown] = useState(0);
  const runRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= LOG_LINES.length; i++) {
      timers.push(setTimeout(() => setShown(i), 500 + i * 110));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    runRef.current?.scrollTo({ top: runRef.current.scrollHeight });
  }, [shown]);

  return (
    <Wrap>
      <Side>
        <SideTitle>Project ▾</SideTitle>
        <TreeRoot>▾ 🗂 storead-api</TreeRoot>
        <TreeNode depth={1}>▾ src/main/java/com.oqube.thinq</TreeNode>
        {PACKAGES.map((pkg) => (
          <div key={pkg}>
            <TreeNode depth={2}>▾ {pkg}</TreeNode>
            {FILES.filter((f) => f.pkg === pkg).map((f) => (
              <TreeFile key={f.name} data-active={f.name === active} onClick={() => setActive(f.name)}>
                <JavaBadge>C</JavaBadge> {f.name}
              </TreeFile>
            ))}
          </div>
        ))}
        <TreeNode depth={1}>▸ src/main/resources</TreeNode>
        <TreeNode depth={1}>▸ src/test/java</TreeNode>
      </Side>

      <Main>
        <TabBar>
          {FILES.map((f) => (
            <Tab key={f.name} data-active={f.name === active} onClick={() => setActive(f.name)}>
              {f.name}
            </Tab>
          ))}
          <RunBadge>▶ StoreAdApplication</RunBadge>
        </TabBar>

        <Editor>
          <pre>
            {lines.map((line, i) => (
              <Line key={i}>
                <LineNum>{i + 1}</LineNum>
                <LineText>{highlightJava(line)}</LineText>
              </Line>
            ))}
          </pre>
        </Editor>

        <RunPanel ref={runRef}>
          <RunHeader>Run: &nbsp;StoreAdApplication</RunHeader>
          <RunBody>
            {LOG_LINES.slice(0, shown).map((l, i) => (
              <RunLine key={i} data-info={l.includes("INFO")}>{l || " "}</RunLine>
            ))}
          </RunBody>
        </RunPanel>

        <StatusBar>
          <span>storead-api</span>
          <span>git: main</span>
          <StatusRight>
            <span>UTF-8</span>
            <span>Java 17</span>
            <span>Spring Boot 3.2</span>
          </StatusRight>
        </StatusBar>
      </Main>
    </Wrap>
  );
}

/* ─── styles (darcula) ─── */

const Wrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: #2b2b2b;
  color: #a9b7c6;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  overflow: hidden;
`;

const Side = styled.div`
  width: 230px;
  background: #3c3f41;
  border-right: 1px solid #2b2b2b;
  overflow-y: auto;
  padding-bottom: 12px;
  flex-shrink: 0;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #555; }
`;

const SideTitle = styled.div`
  font-size: 12px;
  color: #bbb;
  padding: 8px 12px;
  border-bottom: 1px solid #323232;
`;

const TreeRoot = styled.div`
  padding: 6px 12px 2px;
  font-size: 12.5px;
  color: #ddd;
`;

const TreeNode = styled.div<{ depth: number }>`
  padding: 3px 12px;
  padding-left: ${({ depth }) => 12 + depth * 14}px;
  font-size: 12.5px;
  color: #a9b7c6;
`;

const TreeFile = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 12px 3px 54px;
  font-size: 12.5px;
  cursor: pointer;
  color: #a9b7c6;

  &[data-active="true"] { background: #4b6eaf; color: #fff; }
  &:hover:not([data-active="true"]) { background: #464a4d; }
`;

const JavaBadge = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 3px;
  background: #4b6eaf;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const TabBar = styled.div`
  display: flex;
  align-items: center;
  background: #3c3f41;
  border-bottom: 1px solid #2b2b2b;
  flex-shrink: 0;
  overflow-x: auto;
  &::-webkit-scrollbar { display: none; }
`;

const Tab = styled.div`
  padding: 7px 14px;
  font-size: 12.5px;
  color: #a9b7c6;
  cursor: pointer;
  border-right: 1px solid #323232;
  white-space: nowrap;

  &[data-active="true"] {
    background: #2b2b2b;
    color: #fff;
    box-shadow: inset 0 -2px 0 #4b6eaf;
  }
`;

const RunBadge = styled.div`
  margin-left: auto;
  margin-right: 10px;
  color: #499c54;
  font-size: 12px;
  white-space: nowrap;
`;

const Editor = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 0;

  pre {
    margin: 0;
    padding: 8px 0 24px;
    font-family: "JetBrains Mono", "SF Mono", Menlo, monospace;
    font-size: 12.5px;
    line-height: 1.55;
  }

  &::-webkit-scrollbar { width: 10px; height: 10px; }
  &::-webkit-scrollbar-thumb { background: #4b4b4b; }
`;

const Line = styled.div`
  display: flex;
  &:hover { background: #ffffff08; }
`;

const LineNum = styled.span`
  width: 48px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 16px;
  color: #606366;
  user-select: none;
`;

const LineText = styled.span`
  white-space: pre;
  color: #a9b7c6;
`;

const JTok = styled.span`
  &.kw { color: #cc7832; }
  &.str { color: #6a8759; }
  &.cm { color: #808080; font-style: italic; }
  &.ann { color: #bbb529; }
`;

const RunPanel = styled.div`
  height: 170px;
  border-top: 1px solid #323232;
  background: #2b2b2b;
  flex-shrink: 0;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb { background: #4b4b4b; }
`;

const RunHeader = styled.div`
  font-size: 11.5px;
  color: #bbb;
  padding: 6px 14px;
  border-bottom: 1px solid #323232;
  position: sticky;
  top: 0;
  background: #2b2b2b;
`;

const RunBody = styled.div`
  padding: 8px 14px;
  font-family: "JetBrains Mono", "SF Mono", Menlo, monospace;
  font-size: 11.5px;
  line-height: 1.6;
  color: #a9b7c6;
`;

const RunLine = styled.div`
  white-space: pre;
  &[data-info="true"] { color: #77b767; }
`;

const StatusBar = styled.div`
  height: 24px;
  background: #3c3f41;
  border-top: 1px solid #323232;
  color: #999;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 12px;
  font-size: 11.5px;
  flex-shrink: 0;
`;

const StatusRight = styled.div`
  margin-left: auto;
  display: flex;
  gap: 16px;
`;
