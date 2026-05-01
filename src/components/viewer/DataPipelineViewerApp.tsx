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

/** macOS Preview 스타일 PDF 뷰어 — card2.md 기반 */
export default function DataPipelineViewerApp() {
  return (
    <Container>
      <Page>
        <PageTitle>도슨트 및 추천 경로 네비게이션 구축</PageTitle>
        <TagLine>
          비전공 영역인 공간 데이터를 자체 구축하고, AI 도슨트 네비게이션
          시스템을 설계한 경험
        </TagLine>
        <Divider />

        {/* 메트릭 */}
        <MetricRow>
          <Metric>
            <MetricValue>15만평</MetricValue>
            <MetricLabel>사유지 GIS DB 자체 구축</MetricLabel>
          </Metric>
          <Metric>
            <MetricValue>2억+</MetricValue>
            <MetricLabel>외주 견적 절감</MetricLabel>
          </Metric>
          <Metric>
            <MetricValue>400~600</MetricValue>
            <MetricLabel>일평균 사용자 안정 운영</MetricLabel>
          </Metric>
        </MetricRow>

        {/* 역할 */}
        <Section>
          <SectionTitle>역할</SectionTitle>
          <List>
            <li>백엔드 API 개발</li>
            <li>GIS 데이터 처리 파이프라인 설계 (PostGIS + pgRouting)</li>
            <li>AI 기반 추천 경로 / 도슨트 해설 프롬프트 설계</li>
            <li>QFieldCloud 자체 호스팅 인프라 구축</li>
          </List>
        </Section>

        {/* 배경 */}
        <Section>
          <SectionTitle>배경</SectionTitle>
          <Text>
            지류 지도만으로는 방향, 거리, 소요시간을 직관적으로 파악할 수 없다는
            고객 불만이 누적되었습니다. LG 화담숲 개발사로부터 받은 외주 견적이
            <strong> 2억 이상</strong> — 그중 위치수집 견적만 8천만원이었고, GIS는
            회사 누구도 경험이 없는 비전공 영역이었기에 전문 영역으로 인식되어
            사업 중단 위기에 놓였습니다.
          </Text>
        </Section>

        <SectionDivider>과정</SectionDivider>

        {/* Step 1~4 */}
        <Section>
          <StepTitle>Step 1~4. GIS 스택 선정 및 데이터 수집 환경 구축</StepTitle>
          <CdrBlock>
            <CdrLabel>Context</CdrLabel>
            <List>
              <li>외주 견적 검토 — 위치수집 영역만 8천만원</li>
              <li>
                산속 통신 단절 환경에서 오프라인 수집이 가능해야 함
              </li>
              <li>현장 직원이 직접 수집 — 운영 부담 최소화 필수</li>
            </List>
          </CdrBlock>
          <CdrBlock>
            <CdrLabel>Decision</CdrLabel>
            <List>
              <li>
                오픈소스 GIS 스택 조사 → <strong>QGIS</strong> 채택 (커뮤니티
                규모 + 무료)
              </li>
              <li>
                오프라인 수집 가능한 <strong>QField</strong> 발견
              </li>
              <li>
                로그인만으로 동기화되는 <strong>QFieldCloud(QFC)</strong> 자체
                호스팅으로 정착
              </li>
              <li>
                QFC 공식 레포 클론 후 마이크로서비스 전체 직접 셋팅
                (인증/스토리지/PostGIS/Worker 등 다중 서비스 조합)
              </li>
            </List>
          </CdrBlock>
          <CdrBlock>
            <CdrLabel>Consequences</CdrLabel>
            <PlusMinusList>
              <li data-type="plus">외주 위치수집 비용 8천만원 절감</li>
              <li data-type="plus">
                직원이 로그인만으로 데이터 동기화 가능
              </li>
              <li data-type="plus">
                오프라인 환경에서도 정상 수집
              </li>
              <li data-type="minus">
                단순 docker-compose가 아닌 다중 마이크로서비스 → 셋업 복잡도 높음
              </li>
            </PlusMinusList>
          </CdrBlock>
        </Section>

        {/* Step 5~6 */}
        <Section>
          <StepTitle>Step 5~6. 정밀 측정 및 데이터 파이프라인</StepTitle>
          <CdrBlock>
            <CdrLabel>Context</CdrLabel>
            <List>
              <li>
                도슨트 네비게이션은 cm 단위 정밀도 요구 — 휴대폰 GPS는 5~10m
                오차
              </li>
              <li>측정 데이터를 자동 정제하여 라우팅 그래프로 변환해야 함</li>
            </List>
          </CdrBlock>
          <CdrBlock>
            <CdrLabel>Decision</CdrLabel>
            <List>
              <li>
                외장 GPS 수신기 + QField 블루투스 연결 → <strong>cm 단위 정밀도</strong> 확보
              </li>
              <li>
                측정 데이터 자동 처리 파이프라인 구축 (<strong>PostGIS + pgRouting</strong>,
                트리거 기반 자동화)
              </li>
            </List>
          </CdrBlock>
          <CdrBlock>
            <CdrLabel>파이프라인 구조</CdrLabel>
            <PipelineFlow>
              <PipelineStep>gps_point<PipelineDesc>원본</PipelineDesc></PipelineStep>
              <PipelineArrow>→</PipelineArrow>
              <PipelineStep>gps_track_optimized<PipelineDesc>자동 가공</PipelineDesc></PipelineStep>
              <PipelineArrow>→</PipelineArrow>
              <PipelineStep>gps_path<PipelineDesc>관리자 확정</PipelineDesc></PipelineStep>
              <PipelineArrow>→</PipelineArrow>
              <PipelineStep>gps_map<PipelineDesc>통합 라우팅</PipelineDesc></PipelineStep>
            </PipelineFlow>
            <Text style={{ marginTop: 12 }}><strong>자동 처리:</strong></Text>
            <List>
              <li>노이즈 감지 (GPS 정확도, 불가능한 점프)</li>
              <li>트랙 자동 분리 (위치 점프 시 라인 분리)</li>
              <li>단순화 (Douglas-Peucker) + 평탄화 (Chaikin)</li>
              <li>PostgreSQL 트리거로 동기화 시점 자동 실행</li>
            </List>
            <Text><strong>수동 처리 (의도적 제한):</strong></Text>
            <List>
              <li>
                세분화된 길 구조 + GPS 정확도 한계 → 자동 통합 시 데이터 손실
                위험
              </li>
              <li>"기계가 명백히 잘하는 것만 자동화"</li>
              <li>노드 등록, 경로 통합은 모두 관리자 판단</li>
            </List>
            <Text><strong>데이터 무결성:</strong> 원본 gps_point 절대 수정 X · 단계별 source 추적 가능 · 문제 시 원본부터 재가공</Text>
          </CdrBlock>
        </Section>

        {/* Step 7~8 */}
        <Section>
          <StepTitle>
            Step 7~8. AI 도슨트 해설 및 온톨로지 설계
          </StepTitle>
          <CdrBlock>
            <CdrLabel>Decision</CdrLabel>
            <List>
              <li>
                사유원 도메인 온톨로지 설계 — POI(정자, 전망대, 수목 등), 코스,
                계절성, 난이도, 인접 관계 구조화
              </li>
              <li>
                복잡한 질의가 없는 도메인 → GraphDB 도입 없이{" "}
                <strong>시스템 프롬프트 + 관계형 모델링</strong>으로 운영
              </li>
              <li>
                AI 추천 경로 / 도슨트 해설 초안 자동 생성
              </li>
            </List>
          </CdrBlock>
          <NextArrow>
            → "필요 이상으로 무거운 기술 도입을 피하고, 도메인 복잡도에 맞는
            수준으로 설계"
          </NextArrow>
        </Section>

        <SectionDivider>문제해결</SectionDivider>

        {/* 문제해결 1 */}
        <Section>
          <SubTitle>1. 휴대폰 GPS 정밀도 한계 + 산속 신호 약함</SubTitle>
          <Text>
            도슨트 네비게이션은 cm 단위 정밀도가 요구되는데, 휴대폰 내장 GPS는
            5~10m 오차에 산속에서는 신호 끊김이 발생했습니다.
          </Text>
          <List>
            <li>
              <strong>직원 수집 단계:</strong> 외장 GPS 수신기를 QField에
              블루투스로 연결, cm 단위 좌표 + 고도까지 수집
            </li>
            <li>
              <strong>사용자 단계:</strong> 위치 캐싱 + 마지막 알려진 위치
              활용으로 신호 일시 끊김에도 안내 연속성 확보
            </li>
          </List>
        </Section>

        {/* 문제해결 2 */}
        <Section>
          <SubTitle>2. 입장 시간대 트래픽 집중 + 대량 데이터 처리</SubTitle>
          <Text>
            일평균 400~600명, 입장 시간대(오전 10시) 동시 접속 50+, 수백 개 POI,
            다국어 음성 수천 개를 효율적으로 처리해야 했습니다.
          </Text>
          <List>
            <li>위치 추적 / POI 진입 감지: 클라이언트 처리 → 서버 부하 최소화</li>
            <li>도슨트 음성 / 경로: 정적 파일은 CDN/스토리지 직접 제공</li>
            <li>공간 검색: PostGIS GiST 인덱스로 가속</li>
            <li>자주 조회되는 경로: Redis 캐싱</li>
            <li>백엔드: 가벼운 API만 담당</li>
          </List>
          <NextArrow>
            → "실시간 처리와 정적 자원을 명확히 분리"한 설계로 단순한 인프라로
            안정 운영 확보
          </NextArrow>
        </Section>

        {/* 문제해결 3 */}
        <Section>
          <SubTitle>3. 4개국어 도슨트 운영의 복잡도</SubTitle>
          <Text>
            4개국어 × POI 수 = 수천 개 음성 파일 관리. 어르신 방문객 + 외국인
            통역 인력 부담을 동시에 해결해야 했습니다.
          </Text>
          <List>
            <li>
              AI 해설 초안 자동 생성 → 현업 검수 → <strong>ElevenLabs</strong>{" "}
              4개국어 사전 합성
            </li>
            <li>파일 명명 규칙 표준화로 관리자 도구에서 일괄 갱신</li>
          </List>
          <NextArrow>
            → "AI 즉시 응답"이 아닌 "검수 후 사전 합성" 구조로 어르신 방문객
            대상 서비스의 안정성 확보
          </NextArrow>
        </Section>
      </Page>
    </Container>
  );
}

/* ── DataPipelineViewerApp 고유 컴포넌트 ── */

const PipelineFlow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  flex-wrap: wrap;
`;

const PipelineStep = styled.div`
  background: #f0f4ff;
  border: 1px solid #d0daf0;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #0058d0;
  text-align: center;
`;

const PipelineDesc = styled.div`
  font-size: 11px;
  font-weight: 400;
  color: #888;
  margin-top: 2px;
`;

const PipelineArrow = styled.span`
  font-size: 18px;
  color: #999;
`;
