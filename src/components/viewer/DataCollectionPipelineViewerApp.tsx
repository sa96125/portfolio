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

/** macOS Preview 스타일 PDF 뷰어 — 설계-데이터수집파이프라인.md 기반 */
export default function DataCollectionPipelineViewerApp() {
  return (
    <Container>
      <Page>
        <PageTitle>설계 : 데이터 수집 파이프라인</PageTitle>
        <TagLine>
          QField 측정부터 통합 라우팅 그래프까지 — 경로 처리 프로세스 설계
        </TagLine>
        <Divider />

        {/* 파이프라인 흐름도 */}
        <Section>
          <SectionTitle>경로 처리 프로세스</SectionTitle>

          <FlowChart>
            <FlowStep>
              <FlowStepLabel>QField 측정</FlowStepLabel>
              <FlowStepDesc>클라우드 전송</FlowStepDesc>
            </FlowStep>
            <FlowArrow>↓</FlowArrow>

            <FlowStep>
              <FlowStepLabel>gps_point 저장</FlowStepLabel>
              <FlowStepDesc>측정자가 수집한 원본 좌표</FlowStepDesc>
            </FlowStep>
            <FlowArrow>↓</FlowArrow>

            <FlowStep data-highlight="true">
              <FlowStepLabel>최적화 trigger 자동 실행</FlowStepLabel>
            </FlowStep>

            <BranchBlock>
              <BranchItem>
                <BranchNum>1</BranchNum>
                <BranchContent>
                  <BranchTitle>노이즈 감지</BranchTitle>
                  <List>
                    <li>정확도 &gt; 10m: 점 제외</li>
                    <li>불가능한 점프 (단시간 내 30m 초과): 노이즈</li>
                  </List>
                </BranchContent>
              </BranchItem>
              <BranchItem>
                <BranchNum>2</BranchNum>
                <BranchContent>
                  <BranchTitle>트랙 자동 분리</BranchTitle>
                  <List>
                    <li>점프 발생 시 라인 분리 (직선 연결 방지)</li>
                    <li>점은 모두 보존</li>
                  </List>
                </BranchContent>
              </BranchItem>
              <BranchItem>
                <BranchNum>3</BranchNum>
                <BranchContent>
                  <BranchTitle>단순화 (Douglas-Peucker)</BranchTitle>
                  <List>
                    <li>tolerance = 5m</li>
                    <li>직진 점 제거, 커브 보존</li>
                  </List>
                </BranchContent>
              </BranchItem>
              <BranchItem>
                <BranchNum>4</BranchNum>
                <BranchContent>
                  <BranchTitle>평탄화 (Chaikin)</BranchTitle>
                  <List>
                    <li>iterations = 3</li>
                    <li>부드러운 곡선화</li>
                  </List>
                </BranchContent>
              </BranchItem>
            </BranchBlock>

            <FlowArrow>↓</FlowArrow>
            <FlowStep>
              <FlowStepLabel>gps_track_optimized</FlowStepLabel>
              <FlowStepDesc>자동 가공된 수집 경로</FlowStepDesc>
            </FlowStep>
            <FlowArrow>↓</FlowArrow>

            <FlowStep>
              <FlowStepLabel>관리자에서 최적화된 수집경로 불러오기</FlowStepLabel>
              <FlowStepSub>
                <FlowStepSubRow>
                  <SubDot data-color="gray" />
                  배경: <strong>gps_map</strong> (회색, 반투명) — 기존 확정된 길
                </FlowStepSubRow>
                <FlowStepSubRow>
                  <SubDot data-color="blue" />
                  편집 대상: <strong>새 트랙</strong> (파랑) — 지금 검토 중
                </FlowStepSubRow>
              </FlowStepSub>
            </FlowStep>
            <FlowArrow>↓</FlowArrow>

            <FlowStep>
              <FlowStepLabel>노드, 세부사항 편집 및 저장</FlowStepLabel>
            </FlowStep>
            <FlowArrow>↓</FlowArrow>

            <FlowStep>
              <FlowStepLabel>gps_path</FlowStepLabel>
              <FlowStepDesc>편집이 완료된 수집경로</FlowStepDesc>
            </FlowStep>
            <FlowArrow>↓</FlowArrow>

            <FlowStep data-final="true">
              <FlowStepLabel>gps_map (통합)</FlowStepLabel>
            </FlowStep>
          </FlowChart>
        </Section>

        <SectionDivider>설계 결정사항</SectionDivider>

        {/* 1. 자동화 범위 */}
        <Section>
          <DecisionHeader>
            <DecisionNum>1</DecisionNum>
            <SectionTitle style={{ margin: 0 }}>자동화 범위</SectionTitle>
          </DecisionHeader>
          <List>
            <li>
              <strong>자동:</strong> 측정 데이터 가공 (gps_point →
              gps_track_optimized)
            </li>
            <li>
              <strong>수동:</strong> 모든 판단/통합 (gps_track_optimized →
              gps_path → gps_map)
            </li>
          </List>
        </Section>

        {/* 2. 자동화 제한 이유 */}
        <Section>
          <DecisionHeader>
            <DecisionNum>2</DecisionNum>
            <SectionTitle style={{ margin: 0 }}>자동화 제한 이유</SectionTitle>
          </DecisionHeader>
          <List>
            <li>사유원의 세분화된 길 구조</li>
            <li>GPS 정확도(5m)와 길 간격이 비슷</li>
            <li>자동 통합 시 데이터 손실 위험</li>
            <li>보수적 접근으로 안전성 우선</li>
          </List>
        </Section>

        {/* 3. 데이터 보존 */}
        <Section>
          <DecisionHeader>
            <DecisionNum>3</DecisionNum>
            <SectionTitle style={{ margin: 0 }}>데이터 보존</SectionTitle>
          </DecisionHeader>
          <List>
            <li>모든 측정 점 gps_point에 보존</li>
            <li>노이즈로 분류된 점도 별도 처리 (자동 삭제 X)</li>
            <li>검토 후 결정</li>
          </List>
        </Section>

        {/* 4. 처리 단위 */}
        <Section>
          <DecisionHeader>
            <DecisionNum>4</DecisionNum>
            <SectionTitle style={{ margin: 0 }}>처리 단위</SectionTitle>
          </DecisionHeader>
          <List>
            <li>트랙 단위로 작업</li>
            <li>1번 측정 = 1개 작업 단위</li>
            <li>트랙별 개별 검토/확정</li>
          </List>
        </Section>

        {/* 5. 핵심 개념 */}
        <Section>
          <DecisionHeader>
            <DecisionNum>5</DecisionNum>
            <SectionTitle style={{ margin: 0 }}>핵심 개념</SectionTitle>
          </DecisionHeader>
          <ConceptRow>
            <ConceptCard>
              <ConceptLabel>gps_path</ConceptLabel>
              <ConceptValue>가지</ConceptValue>
              <Text style={{ margin: 0, fontSize: 13 }}>
                관리자가 확정한 개별 경로
              </Text>
            </ConceptCard>
            <ConceptArrow>=</ConceptArrow>
            <ConceptCard>
              <ConceptLabel>gps_map</ConceptLabel>
              <ConceptValue>나무</ConceptValue>
              <Text style={{ margin: 0, fontSize: 13 }}>
                가지가 통합된 전체 라우팅 그래프
              </Text>
            </ConceptCard>
          </ConceptRow>
        </Section>
      </Page>
    </Container>
  );
}

/* ── DataCollectionPipelineViewerApp 고유 컴포넌트 ── */

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

const FlowStepSub = styled.div`
  margin-top: 8px;
  text-align: left;
  font-size: 13px;
  color: #555;
  line-height: 1.7;
`;

const FlowStepSubRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SubDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;

  &[data-color="gray"] {
    background: #bbb;
    opacity: 0.6;
  }
  &[data-color="blue"] {
    background: #007aff;
  }
`;

const FlowArrow = styled.div`
  font-size: 18px;
  color: #999;
  line-height: 1;
`;

const BranchBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 420px;
  margin: 4px 0;
  padding: 12px;
  background: #fafafa;
  border: 1px dashed #ddd;
  border-radius: 8px;
`;

const BranchItem = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

const BranchNum = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #0058d0;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
`;

const BranchContent = styled.div`
  flex: 1;

  ul {
    margin: 2px 0 0;
    font-size: 13px;
    line-height: 1.6;
  }
`;

const BranchTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
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

const ConceptRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
`;

const ConceptCard = styled.div`
  flex: 1;
  background: #f7f7f8;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
`;

const ConceptLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #0058d0;
  font-family: monospace;
`;

const ConceptValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #1d1d1f;
  margin: 4px 0;
`;

const ConceptArrow = styled.span`
  font-size: 24px;
  color: #999;
  flex-shrink: 0;
`;
