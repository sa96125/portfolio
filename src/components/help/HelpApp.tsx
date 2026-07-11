import styled from "@emotion/styled";

/* 부팅 시 처음 뜨는 시작 가이드 — 데스크탑 탐색 도움말 */

const GUIDES = [
  { icon: "📁", title: "Finder", desc: "경력 폴더에서 프로젝트 회고와 산출물을 열어보세요." },
  { icon: "📝", title: "메모", desc: "지원 회사를 조사한 노트가 들어 있습니다." },
  { icon: "🧭", title: "Safari", desc: "리서치 중이던 탭들이 그대로 열려 있어요." },
  { icon: "💻", title: "VS Code", desc: "컴포넌트 설계 패턴과 docker-compose를 코드로 보여드립니다." },
  { icon: "🐳", title: "Docker", desc: "실제 운영 중인 멀티 컨테이너 스택 — ⓘ를 눌러 설계 노트를 확인하세요." },
  { icon: "🔒", title: "잠긴 항목", desc: "비공개 자료입니다. 궁금하시면 연락 주세요 :)" },
];

export default function HelpApp() {
  return (
    <Wrap>
      <Hello>👋</Hello>
      <Title>박종승의 데스크탑에 오신 것을 환영합니다</Title>
      <Sub>실제 macOS처럼 동작합니다 — 더블클릭, 드래그, 우클릭 모두 돼요.</Sub>

      <GuideList>
        {GUIDES.map((g) => (
          <GuideRow key={g.title}>
            <GuideIcon>{g.icon}</GuideIcon>
            <div>
              <GuideTitle>{g.title}</GuideTitle>
              <GuideDesc>{g.desc}</GuideDesc>
            </div>
          </GuideRow>
        ))}
      </GuideList>

      <Footer>천천히 둘러보세요. 이 창은 닫으셔도 됩니다.</Footer>
    </Wrap>
  );
}

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(28, 28, 30, 0.92);
  color: #f0f0f0;
  padding: 26px 30px 20px;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
`;

const Hello = styled.div`
  font-size: 34px;
`;

const Title = styled.h2`
  margin: 8px 0 4px;
  font-size: 18px;
  font-weight: 700;
`;

const Sub = styled.p`
  margin: 0 0 18px;
  font-size: 13px;
  color: #a8a8ad;
`;

const GuideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const GuideRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.06);
  border: 0.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 14px;
`;

const GuideIcon = styled.div`
  font-size: 20px;
  line-height: 1.3;
`;

const GuideTitle = styled.div`
  font-size: 13.5px;
  font-weight: 600;
`;

const GuideDesc = styled.div`
  font-size: 12.5px;
  color: #b6b6bb;
  margin-top: 1px;
  line-height: 1.5;
`;

const Footer = styled.div`
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: #8e8e93;
`;
