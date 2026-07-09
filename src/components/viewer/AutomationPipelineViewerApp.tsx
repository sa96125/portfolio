import styled from "@emotion/styled";
import {
  Container,
  Page,
  PageTitle,
  TagLine,
  Divider,
  SectionDivider,
  Section,
  SectionTitle,
  Text,
  List,
} from "./pdf-styles";

/** macOS Preview 스타일 PDF 뷰어 — n8n 데이터 수집 자동화 설계 */
export default function AutomationPipelineViewerApp() {
  return (
    <Container>
      <Page>
        <PageTitle>설계 : 데이터 수집 자동화</PageTitle>
        <TagLine>
          임원 시황 리포트 — 주 1회 수작업을 미팅 단위 자동 생성 파이프라인으로
        </TagLine>
        <Divider />

        {/* 파이프라인 흐름도 */}
        <Section>
          <SectionTitle>파이프라인 흐름 (n8n)</SectionTitle>

          <FlowChart>
            <FlowStep data-highlight="true">
              <FlowStepLabel>미팅 녹음 업로드 (이벤트 트리거)</FlowStepLabel>
              <FlowStepDesc>주기 배치가 아닌 업로드 즉시 실행</FlowStepDesc>
            </FlowStep>
            <FlowArrow>↓</FlowArrow>

            <FlowStep>
              <FlowStepLabel>STT 변환 — Whisper</FlowStepLabel>
              <FlowStepDesc>미팅 음성 → 텍스트</FlowStepDesc>
            </FlowStep>
            <FlowArrow>↓</FlowArrow>

            <FlowStep>
              <FlowStepLabel>LLM 요약 · 핵심 추출</FlowStepLabel>
              <FlowStepDesc>영업 활동 · 논의 사항 구조화</FlowStepDesc>
            </FlowStep>
            <FlowArrow>↓</FlowArrow>

            <FlowStep>
              <FlowStepLabel>시황 데이터 수집</FlowStepLabel>
              <FlowStepDesc>철강 시세 · 환율 등 외부 데이터 자동 수집</FlowStepDesc>
            </FlowStep>
            <FlowArrow>↓</FlowArrow>

            <FlowStep>
              <FlowStepLabel>사내 데이터 결합</FlowStepLabel>
              <FlowStepDesc>ERP 판매·재고 데이터와 교차 결합</FlowStepDesc>
            </FlowStep>
            <FlowArrow>↓</FlowArrow>

            <FlowStep data-final="true">
              <FlowStepLabel>리포트 자동 생성 · 축적</FlowStepLabel>
              <FlowStepDesc>임원 보고 + 영업 활동 데이터 실시간 축적</FlowStepDesc>
            </FlowStep>
          </FlowChart>
        </Section>

        <SectionDivider>설계 결정사항</SectionDivider>

        {/* 1. STT 선정 */}
        <Section>
          <DecisionHeader>
            <DecisionNum>1</DecisionNum>
            <SectionTitle style={{ margin: 0 }}>STT 엔진 선정</SectionTitle>
          </DecisionHeader>
          <List>
            <li>Whisper / Google Cloud STT / CLOVA Speech 3종 직접 비교 검증</li>
            <li>기준: 한국어 + 철강 도메인 용어 인식 정확도</li>
            <li>Whisper 채택 — 도메인 용어 인식이 가장 안정적</li>
          </List>
        </Section>

        {/* 2. 워크플로우 엔진 */}
        <Section>
          <DecisionHeader>
            <DecisionNum>2</DecisionNum>
            <SectionTitle style={{ margin: 0 }}>워크플로우 엔진</SectionTitle>
          </DecisionHeader>
          <List>
            <li>전체 코드 구현 대신 <strong>n8n</strong> 채택</li>
            <li>현업 요구 변경이 잦음 → 노드 기반이 수정·확장에 유리</li>
            <li>부족한 부분은 Python 커스텀 노드로 보완</li>
          </List>
        </Section>

        {/* 3. 실행 단위 */}
        <Section>
          <DecisionHeader>
            <DecisionNum>3</DecisionNum>
            <SectionTitle style={{ margin: 0 }}>실행 단위</SectionTitle>
          </DecisionHeader>
          <List>
            <li>주 1회 배치가 아닌 <strong>미팅 업로드 이벤트 트리거</strong></li>
            <li>미팅이 있을 때마다 리포트 생성 → 데이터 신선도 확보</li>
            <li>사람이 안 눌러도 도는 구조가 목표</li>
          </List>
        </Section>

        {/* 4. 축적 우선 */}
        <Section>
          <DecisionHeader>
            <DecisionNum>4</DecisionNum>
            <SectionTitle style={{ margin: 0 }}>리포트보다 축적</SectionTitle>
          </DecisionHeader>
          <List>
            <li>1회성 리포트 생성으로 끝내지 않고 영업 활동 데이터를 축적</li>
            <li>미팅 단위 데이터가 쌓이며 시계열 분석의 기반이 됨</li>
          </List>
        </Section>

        <SectionDivider>성과</SectionDivider>

        <Section>
          <Text>
            주 1회 수작업 리포트가 <strong>미팅 단위 자동 생성</strong>으로
            전환되었습니다. 데이터 축적량이 늘고 임원 의사결정 속도가
            빨라졌으며, 영업 활동 데이터가 실시간으로 쌓이는 구조를
            확보했습니다.
          </Text>
          <Teaser>노드 구성과 장애 처리의 디테일은… 면접에서 계속</Teaser>
        </Section>
      </Page>
    </Container>
  );
}

/* ── AutomationPipelineViewerApp 고유 컴포넌트 ── */

const FlowChart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin: 16px 0;
`;

const FlowStep = styled.div`
  background: #f0f4ff;
  border: 1px solid #d0daf0;
  border-radius: 8px;
  padding: 12px 24px;
  text-align: center;
  width: 100%;
  max-width: 420px;

  &[data-highlight="true"] {
    background: #fff8e1;
    border-color: #ffe082;
  }

  &[data-final="true"] {
    background: #e8f5e9;
    border-color: #a5d6a7;
  }
`;

const FlowStepLabel = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #0058d0;
`;

const FlowStepDesc = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

const FlowArrow = styled.div`
  font-size: 18px;
  color: #999;
  line-height: 1;
`;

const DecisionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const DecisionNum = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #1d1d1f;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Teaser = styled.div`
  margin-top: 10px;
  font-size: 12px;
  font-style: italic;
  color: #999;
  text-align: right;
`;
