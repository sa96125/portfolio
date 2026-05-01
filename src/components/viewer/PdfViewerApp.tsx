import styled from "@emotion/styled";
import {
  Container,
  Page,
  PageTitle,
  TagLine,
  Divider,
  SectionDivider,
  MetricRow,
  Metric,
  MetricValue,
  MetricLabel,
  Section,
  SectionTitle,
  StepTitle,
  SubTitle,
  Text,
  List,
  CdrBlock,
  CdrLabel,
  PlusMinusList,
  NextArrow,
} from "./pdf-styles";

/** macOS Preview 스타일 PDF 뷰어 — card1.md 기반 */
export default function PdfViewerApp() {
  return (
    <Container>
      <Page>
        <PageTitle>STAR : RAG 기반 챗봇 구축</PageTitle>
        <TagLine>10만건의 문서 지식을 주입한 AI 챗봇 개발 경험</TagLine>
        <Divider />

        {/* 메트릭 */}
        <MetricRow>
          <Metric>
            <MetricValue>95%</MetricValue>
            <MetricLabel>검색정확도</MetricLabel>
          </Metric>
          <Metric>
            <MetricValue>64%</MetricValue>
            <MetricLabel>AI 개발 운영비 절감</MetricLabel>
          </Metric>
        </MetricRow>

        {/* 역할 */}
        <Section>
          <SectionTitle>역할</SectionTitle>
          <List>
            <li>챗봇 디자인 / 프론트 개발</li>
            <li>LLM 파인튜닝, 임베딩</li>
            <li>인프라 관리 (GCP, Elice)</li>
          </List>
        </Section>

        {/* 배경 */}
        <Section>
          <SectionTitle>배경</SectionTitle>
          <Text>
            사내에서는 "이 자료 있나요?", "이런 절차 있나요?" 같은 문의가 부서 간에
            반복되고 있었습니다. 그룹웨어에 자료가 쌓여 있어도 키워드 검색만으로는
            찾기 어려웠고, 결국 특정 담당자를 거쳐야만 정보가 흐르는
            <strong> 지식 병목</strong>이 곳곳에서 나타나고 있었습니다.
          </Text>
          <Text>
            저희 팀은 AI 도입 시점을 고민하던 중이었고, 저는 이 병목이야말로 AI가
            풀어야 할 문제라고 봤습니다. <strong>자료를 읽고 맥락을 짚어 답하는 일은
            AI가 가장 잘하는 영역</strong>이라는 확신이 있었습니다.
          </Text>
          <Text>
            무엇보다, 새로운 기술에 부담을 느끼던 분들도 평소 쓰던 그룹웨어 안에서
            자연스럽게 AI를 만날 수 있게 하고 싶었습니다. 단순 검색을 넘어 자료의
            맥락까지 짚어 의사결정을 거들 수 있다면, 신입사원부터 대표까지
            <strong> 모든 구성원의 생산성을 동시에 끌어올릴 수 있는 일</strong>이었습니다.
          </Text>
          <Text>
            정보가 가장 많이 모이고 가장 잘 활용될 수 있는 그룹웨어에 챗봇을
            연동하자고 제안했고, 그렇게 프로젝트가 시작되었습니다.
          </Text>
        </Section>

        <SectionDivider>과정</SectionDivider>

        {/* Step 1 */}
        <Section>
          <StepTitle>Step 1. 허깅페이스 오픈소스 테스트 — Qwen3</StepTitle>
          <CdrBlock>
            <CdrLabel>Context</CdrLabel>
            <List>
              <li>사내 보안 요건상 외부 API(GPT/Claude) 의존 불가</li>
              <li>한정된 자원: 단일 GPU 환경, 보수적 분위기 → 운영 가능한 모델 후보 좁음</li>
              <li>HuggingFace 생태계 기반 오픈소스 모델 비교 테스트(한국어)</li>
            </List>
          </CdrBlock>
          <CdrBlock>
            <CdrLabel>Decision</CdrLabel>
            <Text>
              HuggingFace 오픈소스 모델 후보군 비교 테스트 후, <strong>Qwen3-Instruct</strong> 채택
            </Text>
            <List>
              <li>파라메터 크기(7~32B) / 변형모델(Base/Instruct) / 양자화 호환성 고려</li>
              <li>후보 간 비교는 공개 벤치마크에 의존하지 않고 휴먼 검증</li>
              <li>사내 도메인 샘플 질의/응답으로 직접 입출력 비교</li>
              <li>"벤치마크 점수가 높은 모델"이 아니라 "우리 데이터에서 입출력이 좋은 모델"을 선택</li>
              <li>사내 문서는 행정 문체 + 약어 + 표/리스트 혼재 → 벤치마크와 분포가 다름</li>
            </List>
          </CdrBlock>
          <CdrBlock>
            <CdrLabel>Consequences</CdrLabel>
            <PlusMinusList>
              <li data-type="plus">외부 API 비용 0, 데이터 외부 유출 0</li>
              <li data-type="plus">단일 GPU 양자화 서빙 가능성 확인</li>
              <li data-type="plus">공개 벤치마크 의존 X → 도메인 적합성 직접 검증</li>
              <li data-type="plus">RAG에 적합한 모델 변형 선택 (Instruct)</li>
              <li data-type="minus">베이스 모델은 사내 도메인 모름 — 약어/프로세스 질의에 그럴듯한 거짓말</li>
              <li data-type="minus">휴먼 검증은 정성 평가라 재현성 약함 (Step 6에서 평가셋으로 정량화)</li>
            </PlusMinusList>
          </CdrBlock>
          <NextArrow>→ 도메인 지식을 어떻게 주입할 것인가?</NextArrow>
          <NextArrow>→ 개발 비용을 최소화하면서 최대 효율을 낼 방법은?</NextArrow>
        </Section>

        {/* Step 2 */}
        <Section>
          <StepTitle>Step 2. 파인튜닝 및 인프라 구축</StepTitle>
          <CdrBlock>
            <CdrLabel>Context</CdrLabel>
            <List>
              <li>모델의 지식과 사고능력을 활용하고, 도메인 지식만 학습</li>
              <li>월 30만원 이하로 GPU 대여 → 풀 파인튜닝 불가</li>
              <li>LoRA/QLoRA 계열은 어댑터만 학습하니 보존된다는 당시 통념</li>
            </List>
          </CdrBlock>
          <CdrBlock>
            <CdrLabel>Decision</CdrLabel>
            <Text><strong>QLoRA + 4bit 양자화 + Unsloth</strong> 조합 시도</Text>
            <List>
              <li>QLoRA 하이퍼파라미터 튜닝: rank(r), alpha, dropout 테스트</li>
              <li>학습 데이터 품질: 사내 문서 정제, instruction 형식 가공</li>
              <li>A100-40G에서 32B − 4bit 양자화 파인튜닝 가능</li>
              <li>Unsloth: 학습 속도/메모리 최적화</li>
              <li>GCP Spot 요금제 → 최대 90% 비용 절감</li>
              <li>인스턴스 중단 감지 → 자동 재실행 배치파일로 대응</li>
            </List>
          </CdrBlock>
          <CdrBlock>
            <CdrLabel>Consequences</CdrLabel>
            <PlusMinusList>
              <li data-type="plus">단일 GPU 32B 파인튜닝 가능</li>
              <li data-type="plus">사내 챗봇으로 사용하기에 32B도 사고력이 충분</li>
              <li data-type="minus">재앙적 망각: 일반 지식/추론 능력 붕괴</li>
              <li data-type="minus">할루시네이션 폭발: Step 1 Instruct의 "모르겠다" 능력 상실</li>
              <li data-type="minus">사내 문서 자주 갱신 → 재학습 비용 trade-off</li>
              <li data-type="minus">Spot은 가용자원이 없을 경우 재실행 자체 불가능 (개발용으로만 사용)</li>
              <li data-type="minus">"LoRA 망각 회피"는 학습량 조건부, 통념의 한계 확인</li>
            </PlusMinusList>
          </CdrBlock>
          <Ref>Biderman et al.(2024) "LoRA Learns Less and Forgets Less" — 변수 통제 후에도 본질적 한계</Ref>
          <NextArrow>→ "모델을 가르치기"보다 "모델에게 자료를 주기"</NextArrow>
        </Section>

        {/* Step 3 */}
        <Section>
          <StepTitle>Step 3. RAG 전환 (Qwen3 + BGE-M3 + VectorDB)</StepTitle>
          <CdrBlock>
            <CdrLabel>Context</CdrLabel>
            <List>
              <li>사용자 쿼리로 자료를 검색한 후 답변 생성</li>
              <li>파인튜닝에 비해 검색 시간은 느리겠지만, 정확도를 높이는 것이 목표</li>
            </List>
          </CdrBlock>
          <CdrBlock>
            <CdrLabel>Decision</CdrLabel>
            <Text>한국어 RAG 스택 후보군 비교 테스트 후 채택</Text>
            <List>
              <li>임베딩: <strong>BGE-M3</strong> (한국어 SOTA, dense + sparse 동시 지원)</li>
              <li>VectorDB: <strong>Qdrant</strong> (hybrid 검색 지원, 자체 호스팅 가능)</li>
              <li>Langchain 배제 — RAG 전용 자료는 LlamaIndex 쪽이 더 깊이 있음을 확인</li>
              <li>사내 문서(PDF, Excel, docx, html) → 마크다운 변환 후 청킹(400/40)</li>
            </List>
          </CdrBlock>
          <CdrBlock>
            <CdrLabel>Consequences</CdrLabel>
            <PlusMinusList>
              <li data-type="plus">모델 손상 없음 → "모르겠다" 능력 + 일반 지식 그대로</li>
              <li data-type="minus">문서 개수가 많아질수록 검색 정확도 감소 (10만개 기준 10% 미만)</li>
            </PlusMinusList>
          </CdrBlock>
          <NextArrow>→ 검색정확도를 어떻게 끌어올릴까? 임베딩 문제? 모델 문제?</NextArrow>
        </Section>

        {/* Step 4-7 */}
        <Section>
          <StepTitle>Step 4~7. 검색 정확도 개선</StepTitle>
          <List>
            <li><strong>Step 4.</strong> OpenAI API + 하이브리드 임베딩 + HyDE</li>
            <li><strong>Step 5.</strong> 4채널(+CR) + HyPE + 형태소(kiwi)</li>
            <li><strong>Step 6.</strong> Hit Score 체계</li>
            <li><strong>Step 7.</strong> 온톨로지 구축 (GraphDB)</li>
          </List>
        </Section>

        <SectionDivider>문제해결</SectionDivider>

        {/* 문제해결 */}
        <Section>
          <SubTitle>1. 평가 체계 구축</SubTitle>
          <Text>
            프롬프트를 살짝 바꿔도 결과가 달라져서, 기존에 잘 나왔던 항목 테스트가 어려웠습니다.
            다양한 케이스 · 실패 케이스 각각 500개씩 모아 <strong>LLM as Judge</strong> 평가셋을
            검증했습니다. <strong>Recall</strong>과 <strong>Ranking</strong>을 평가기준으로
            삼았습니다. (잘 찾아오는지, 상위에 랭크되어 있는지)
          </Text>
        </Section>

        <Section>
          <SubTitle>2. 인프라 비용 절감</SubTitle>
          <Text>
            보수적인 분위기, 한정된 자원으로 인프라를 사용해서 성과를 내야 했습니다.
            GCP Spot 정책으로 A100-40G를 월 24만원에 약 60% 비용 절감하여 개발 용도로 사용했습니다.
            Qwen3 32B 양자화 모델을 <strong>vLLM</strong>으로 서빙, <strong>Unsloth</strong>로
            파인튜닝 가능했습니다.
          </Text>
        </Section>

        <Section>
          <SubTitle>3. 검색 정확도</SubTitle>
          <Text>
            좋은 모델을 사용하더라도 검색 결과가 좋지는 않았습니다.
            카오스 이론, 앙상블 예측에 영감을 받아
            <strong> 4채널 가중치 + Hit Score 체계</strong>로 개선했습니다.
          </Text>
        </Section>

        {/* 참고 논문 */}
        <Section>
          <SectionTitle>참고 논문</SectionTitle>
          <RefList>
            <li>Biderman et al. (2024) "LoRA Learns Less and Forgets Less"</li>
            <li>Ozsoy et al. (2025) "Text2Cypher: Bridging Natural Language and Graph Databases"</li>
            <li>Zhong et al. (2024) "SyntheT2C"</li>
            <li>Anthropic Contextual Retrieval (공식 블로그)</li>
          </RefList>
        </Section>
      </Page>
    </Container>
  );
}

/* ── PdfViewerApp 고유 컴포넌트 ── */

const Ref = styled.div`
  font-size: 12px;
  color: #999;
  font-style: italic;
  margin-top: 4px;
`;

const RefList = styled.ul`
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  line-height: 2;
  color: #666;
`;
