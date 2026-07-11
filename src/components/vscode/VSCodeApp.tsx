import styled from "@emotion/styled";
import { useEffect, useMemo, useRef, useState } from "react";
import appTsx from "../../App.tsx?raw";
import useWindowsTs from "../../hooks/useWindows.ts?raw";
import dockTsx from "../dock/Dock.tsx?raw";
import safariTsx from "../safari/SafariApp.tsx?raw";
import designMd from "../../../DESIGN.md?raw";
import packageJson from "../../../package.json?raw";

/* ─── 실제 소스를 그대로 여는 에디터 — 이 파일 자체가 이 앱으로 열립니다 ─── */

interface FileEntry {
  name: string;
  path: string;
  content: string;
  lang: "ts" | "md" | "json";
}

const FILES: FileEntry[] = [
  { name: "App.tsx", path: "src/App.tsx", content: appTsx, lang: "ts" },
  { name: "useWindows.ts", path: "src/hooks/useWindows.ts", content: useWindowsTs, lang: "ts" },
  { name: "Dock.tsx", path: "src/components/dock/Dock.tsx", content: dockTsx, lang: "ts" },
  { name: "SafariApp.tsx", path: "src/components/safari/SafariApp.tsx", content: safariTsx, lang: "ts" },
  { name: "DESIGN.md", path: "DESIGN.md", content: designMd, lang: "md" },
  { name: "package.json", path: "package.json", content: packageJson, lang: "json" },
];

interface TreeFolder {
  label: string;
  children: string[]; // FILES name 참조
}

const TREE: TreeFolder[] = [
  { label: "src", children: ["App.tsx"] },
  { label: "src/hooks", children: ["useWindows.ts"] },
  { label: "src/components/dock", children: ["Dock.tsx"] },
  { label: "src/components/safari", children: ["SafariApp.tsx"] },
  { label: "루트", children: ["DESIGN.md", "package.json"] },
];

/* 터미널 시나리오 */
const TERM_CMD = "npm run dev";
const TERM_LINES = [
  "",
  "> chatbot@0.0.0 dev",
  "> vite",
  "",
  "  VITE v7.2.4  ready in 423 ms",
  "",
  "  ➜  Local:   http://localhost:5173/",
  "  ➜  Network: use --host to expose",
  "",
  "  # 지금 보고 계신 이 화면이 위 프로세스입니다 :)",
];

const KEYWORDS =
  /\b(import|from|export|default|const|let|var|function|return|if|else|for|while|new|type|interface|extends|class|async|await|case|switch|break|typeof|null|undefined|true|false|this|of|in)\b/;

const TOKEN_RE = new RegExp(
  [
    String.raw`(\/\/.*$)`, // 1 comment
    String.raw`("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|` + "`" + String.raw`(?:[^` + "`" + String.raw`\\]|\\.)*` + "`" + `)`, // 2 string
    KEYWORDS.source, // 3 keyword
    String.raw`(\b\d+(?:\.\d+)?\b)`, // 4 number
  ].join("|"),
  "g"
);

function highlightLine(line: string, lang: FileEntry["lang"]) {
  if (lang !== "ts") return <span>{line}</span>;
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  let key = 0;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m.index > last) out.push(<span key={key++}>{line.slice(last, m.index)}</span>);
    const [text] = m;
    const cls = m[1] ? "cm" : m[2] ? "str" : m[4] ? "num" : "kw";
    out.push(<Tok key={key++} className={cls}>{text}</Tok>);
    last = m.index + text.length;
  }
  if (last < line.length) out.push(<span key={key++}>{line.slice(last)}</span>);
  return out;
}

export default function VSCodeApp() {
  const [activeFile, setActiveFile] = useState(FILES[0].name);
  const [openTabs, setOpenTabs] = useState<string[]>([FILES[0].name]);
  const file = FILES.find((f) => f.name === activeFile) ?? FILES[0];
  const lines = useMemo(() => file.content.split("\n"), [file]);

  /* 터미널 애니메이션 */
  const [typed, setTyped] = useState(0);
  const [shownLines, setShownLines] = useState(0);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= TERM_CMD.length; i++) {
      timers.push(setTimeout(() => setTyped(i), 400 + i * 55));
    }
    const base = 400 + TERM_CMD.length * 55 + 350;
    for (let i = 1; i <= TERM_LINES.length; i++) {
      timers.push(setTimeout(() => setShownLines(i), base + i * 130));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    termRef.current?.scrollTo({ top: termRef.current.scrollHeight });
  }, [shownLines]);

  const openFile = (name: string) => {
    setActiveFile(name);
    setOpenTabs((prev) => (prev.includes(name) ? prev : [...prev, name]));
  };

  const closeTab = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setOpenTabs((prev) => {
      const next = prev.filter((t) => t !== name);
      if (next.length === 0) return prev;
      if (activeFile === name) setActiveFile(next[next.length - 1]);
      return next;
    });
  };

  return (
    <Wrap>
      {/* 액티비티 바 */}
      <ActivityBar>
        <ActivityIcon data-active="true" title="탐색기">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M17 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </ActivityIcon>
        <ActivityIcon title="검색">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" />
            <path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </ActivityIcon>
        <ActivityIcon title="소스 제어">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="7" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="7" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="17" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 8.2v7.6M17 11.2c0 3-3 4-7 4.3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </ActivityIcon>
      </ActivityBar>

      {/* 탐색기 */}
      <Sidebar>
        <SidebarTitle>탐색기</SidebarTitle>
        <ProjectName>PORTFOLIO</ProjectName>
        {TREE.map((folder) => (
          <div key={folder.label}>
            <FolderRow>▾ {folder.label}</FolderRow>
            {folder.children.map((name) => (
              <FileRow key={name} data-active={name === activeFile} onClick={() => openFile(name)}>
                <FileDot data-lang={FILES.find((f) => f.name === name)?.lang} />
                {name}
              </FileRow>
            ))}
          </div>
        ))}
      </Sidebar>

      {/* 에디터 + 터미널 */}
      <Main>
        <TabBar>
          {openTabs.map((name) => (
            <Tab key={name} data-active={name === activeFile} onClick={() => setActiveFile(name)}>
              {name}
              <TabClose onClick={(e) => closeTab(e, name)}>×</TabClose>
            </Tab>
          ))}
        </TabBar>
        <Breadcrumb>{file.path}</Breadcrumb>

        <Editor>
          <pre>
            {lines.map((line, i) => (
              <Line key={i}>
                <LineNum>{i + 1}</LineNum>
                <LineText>{highlightLine(line, file.lang)}</LineText>
              </Line>
            ))}
          </pre>
        </Editor>

        <Terminal ref={termRef}>
          <TermHeader>터미널 &nbsp;·&nbsp; zsh — portfolio</TermHeader>
          <TermBody>
            <div>
              <Prompt>portfolio git:(main)</Prompt> {TERM_CMD.slice(0, typed)}
              {typed < TERM_CMD.length && <Cursor />}
            </div>
            {TERM_LINES.slice(0, shownLines).map((l, i) => (
              <TermLine key={i} data-meta={l.startsWith("  #")}>{l || " "}</TermLine>
            ))}
            {typed >= TERM_CMD.length && shownLines >= TERM_LINES.length && <Cursor />}
          </TermBody>
        </Terminal>

        <StatusBar>
          <span>⎇ main</span>
          <span>⊘ 0 &nbsp;⚠ 0</span>
          <StatusRight>
            <span>Ln 1, Col 1</span>
            <span>UTF-8</span>
            <span>{file.lang === "ts" ? "TypeScript React" : file.lang === "md" ? "Markdown" : "JSON"}</span>
          </StatusRight>
        </StatusBar>
      </Main>
    </Wrap>
  );
}

/* ─── styles ─── */

const Wrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background: #1e1e1e;
  color: #ccc;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  overflow: hidden;
`;

const ActivityBar = styled.div`
  width: 48px;
  background: #333333;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
  gap: 4px;
  flex-shrink: 0;
`;

const ActivityIcon = styled.div`
  width: 48px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #858585;
  cursor: pointer;
  border-left: 2px solid transparent;

  &[data-active="true"] {
    color: #fff;
    border-left-color: #fff;
  }
  &:hover { color: #ddd; }
`;

const Sidebar = styled.div`
  width: 210px;
  background: #252526;
  flex-shrink: 0;
  overflow-y: auto;
  padding-bottom: 12px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #444; }
`;

const SidebarTitle = styled.div`
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 14px 6px;
`;

const ProjectName = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #ccc;
  padding: 2px 14px 6px;
`;

const FolderRow = styled.div`
  padding: 3px 14px;
  font-size: 12px;
  color: #aaa;
`;

const FileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 14px 3px 28px;
  font-size: 12.5px;
  cursor: pointer;
  color: #ccc;

  &[data-active="true"] { background: #37373d; color: #fff; }
  &:hover:not([data-active="true"]) { background: #2a2d2e; }
`;

const FileDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 2px;
  flex-shrink: 0;
  background: #519aba;

  &[data-lang="md"] { background: #6997d5; border-radius: 50%; }
  &[data-lang="json"] { background: #cbcb41; }
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const TabBar = styled.div`
  display: flex;
  background: #252526;
  overflow-x: auto;
  flex-shrink: 0;
  &::-webkit-scrollbar { display: none; }
`;

const Tab = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  font-size: 12.5px;
  color: #969696;
  background: #2d2d2d;
  border-right: 1px solid #1e1e1e;
  cursor: pointer;
  white-space: nowrap;

  &[data-active="true"] {
    background: #1e1e1e;
    color: #fff;
    border-top: 1px solid #0078d4;
  }
`;

const TabClose = styled.span`
  color: #777;
  border-radius: 3px;
  padding: 0 3px;
  &:hover { background: #444; color: #fff; }
`;

const Breadcrumb = styled.div`
  font-size: 11.5px;
  color: #888;
  padding: 4px 14px;
  border-bottom: 1px solid #2a2a2a;
  flex-shrink: 0;
`;

const Editor = styled.div`
  flex: 1;
  overflow: auto;
  min-height: 0;

  pre {
    margin: 0;
    padding: 8px 0 24px;
    font-family: "SF Mono", Menlo, Consolas, monospace;
    font-size: 12.5px;
    line-height: 1.55;
  }

  &::-webkit-scrollbar { width: 10px; height: 10px; }
  &::-webkit-scrollbar-thumb { background: #424242; }
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
  color: #6e7681;
  user-select: none;
`;

const LineText = styled.span`
  white-space: pre;
  color: #d4d4d4;
`;

const Tok = styled.span`
  &.kw { color: #c586c0; }
  &.str { color: #ce9178; }
  &.cm { color: #6a9955; }
  &.num { color: #b5cea8; }
`;

const Terminal = styled.div`
  height: 180px;
  border-top: 1px solid #2a2a2a;
  background: #181818;
  flex-shrink: 0;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb { background: #424242; }
`;

const TermHeader = styled.div`
  font-size: 11px;
  color: #999;
  padding: 6px 14px;
  border-bottom: 1px solid #2a2a2a;
  position: sticky;
  top: 0;
  background: #181818;
`;

const TermBody = styled.div`
  padding: 8px 14px;
  font-family: "SF Mono", Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.6;
  color: #ddd;
`;

const Prompt = styled.span`
  color: #4ec9b0;
  font-weight: 600;
`;

const TermLine = styled.div`
  white-space: pre;
  &[data-meta="true"] { color: #6a9955; }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 7px;
  height: 13px;
  background: #ddd;
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 1s steps(1) infinite;

  @keyframes blink { 50% { opacity: 0; } }
`;

const StatusBar = styled.div`
  height: 24px;
  background: #0078d4;
  color: #fff;
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
