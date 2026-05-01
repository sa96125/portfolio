# Chatbot Portfolio — Design Document

> macOS 데스크탑 시뮬레이션 위에 AI 챗봇이 올라간 인터랙티브 포트폴리오.
> 방문자 = 채용 담당자 시나리오에 최적화.

---

## 1. 컨셉

**한 줄 요약**: macOS 바탕화면을 탐색하면 챗봇이 옆에서 실시간으로 나레이션하며 본인을 소개한다.

### 핵심 차별점
- 일반 ChatGPT 클론과 달리, **빈 챗봇 문제** 없음 — 방문자가 뭘 물을지 몰라도 챗봇이 먼저 말 검.
- **메타 자기참조 구조**: 챗봇이 자기 자신(이 프로젝트)을 설명함 → 학습/구현 능력 동시 어필.
- **잠긴 파일 = 자연스러운 CTA**: "공개하지 않은 파일입니다 → 연락 주세요" 식 호기심 유발.

### 사용자 시나리오
1. 방문자가 페이지 진입 → 챗봇이 "안녕하세요, [이름]의 데스크탑에 오신 걸 환영합니다"
2. 폴더 더블클릭 → 창 열림 + 챗봇이 "이 폴더는 ~~ 입니다"
3. 파일 클릭 → 뷰어 창 + 챗봇이 "이건 ~~ 한 산물입니다"
4. 잠긴 파일 클릭 → "이 파일은 비공개입니다. 관심 있으시면 연락 주세요"
5. 방문자가 직접 질문 입력 → 나레이션 중단, LLM 답변 모드

---

## 2. 데스크탑 구성

### 루트 아이템

| 이름 | 타입 | 내용 | 어필 포인트 |
|---|---|---|---|
| 📁 **경력** | 폴더 | (내부 구조 미확정) | 커리어 트랙 |
| 📄 **설계.md** | 파일 | *이 프로젝트 자체*의 스택/아키텍처 정리 | 학습 + 메타 사고 |
| 📄 **기획_삐삐.pdf** | 파일 | 런칭한 서비스 기획서 | 기획 + 디자인 |
| 🔒 **이력서.pdf** *(예정)* | 파일 | 잠긴 파일 → 연락 CTA | 채용 전환 |
| 🗑 **휴지통** *(예정)* | 장식 | (미정) | 유머 |

### 경력 폴더 내부 — **TODO**
회사별 폴더? 프로젝트별 파일? 시간순? → 정해야 함.

---

## 3. 인터랙션 설계

### 챗봇 위치
- **Dock 아이콘 클릭 → 팝업 위젯** (macOS Control Center 스타일)
- 항상 떠있지 않고 필요 시 호출
- Liquid Glass 배경

### 나레이션 규칙
- **이벤트 가치 차등** — 가치 있는 행동만 발화
  - ✅ 폴더 더블클릭 / 파일 클릭 / 잠긴 파일 클릭
  - ❌ hover / 같은 폴더 재진입 (이미 설명함)
- **사용자가 직접 입력 시 즉시 중단**
- **1~2문장 짧게** — 길면 읽기 싫어짐
- **시나리오 기반** (LLM 호출 없음 → 비용 0, 톤 안정)

---

## 4. 디자인 시스템

**컨셉**: Liquid Glass (macOS Tahoe / iOS 26)

- 모든 UI 표면은 backdrop-filter blur + saturate
- 둥근 모서리 (radius-xl 이상)
- 부드러운 spring 애니메이션
- 색상/타이포/간격 토큰: `src/styles/tokens.css`
- 글래스 유틸리티: `src/styles/glass.css`

기반: faceai-front `STYLE_GUIDE.md` (확장)

---

## 5. 기술 스택

| 영역 | 선택 | 이유 |
|---|---|---|
| 빌드 | Vite 7 | 빠른 HMR |
| 패키지 매니저 | npm | 기존 프로젝트와 동일 스펙 |
| UI | React 19 + TypeScript | 표준 |
| 스타일 | Emotion (`@emotion/styled`) | faceai 스타일 일관성 |
| 챗봇 UI | `@assistant-ui/react` | 스트리밍 UX 검증됨 |
| 상태관리 | Zustand | 가볍고 충분 |
| 서버 상태 | TanStack Query | 캐싱/스트리밍 |
| 마크다운 | react-markdown + remark-gfm + rehype-raw | 표준 |
| 아이콘 | lucide-react | 깔끔 |
| 창 드래그/리사이즈 | `react-rnd` *(예정)* | 시간 절약 |

### 제외한 것
- ❌ `react-router-dom` — SPA 단일 페이지면 불필요
- ❌ `@vitejs/plugin-legacy` — 신규 챗봇은 모던 브라우저만
- ❌ `axios` *(고려 중)* — fetch + SSE면 충분, 보안 이슈 회피

---

## 6. LLM / 임베딩 전략

### LLM 호출
- 모델: Claude Haiku 4.5 (저비용) or GPT-4o-mini
- 호출 위치: Vercel/Cloudflare 서버리스 함수 1개 (API 키 숨김)
- 스트리밍: SSE + TextDecoder (faceai-front 패턴 그대로)
- **나레이션은 LLM 호출 안 함** (시나리오 기반)
- LLM 호출은 사용자 자유 질문 시에만

### 임베딩 / RAG — **결정 필요**

본인 자료 (정적):
- ✅ **빌드타임 사전 임베딩** → `public/embeddings.json`로 정적 호스팅
- 브라우저 메모리에서 코사인 유사도 검색 (자료 적음)
- 임베딩 API 호출 비용: 1회성 (빌드 시), 거의 0원

사용자 업로드 (동적):
- 옵션 A: 임베딩 안 함 → 1MB 제한 + 텍스트 추출 후 프롬프트에 직접 첨부
- 옵션 B: 클라이언트 임베딩 (transformers.js) → 첫 로딩 무거움
- 옵션 C: 서버리스 + OpenAI embeddings → 가볍지만 남용 시 비용
- **현재 가정: 옵션 A** (가장 단순, 서버 부담 0)

### 업로드 제한 (DDoS/남용 방지)
- 세션 메모리만 저장 (새로고침 시 휘발)
- 파일당 1MB
- 세션당 3개

---

## 7. 폴더 구조

표준 React 구조 (faceai-front 기반) + components/ 안에서만 도메인별 분리.

```
src/
├── main.tsx
├── App.tsx
│
├── api/
│   ├── llm.ts                # LLM API 호출 (Anthropic/OpenAI/Vercel AI SDK)
│   └── chatRuntime.ts        # assistant-ui 런타임
│
├── components/               # 도메인별로 분리
│   ├── base/                 # 공통 primitives (Tooltip, IconButton 등)
│   ├── desktop/              # Desktop, DesktopIcon, Wallpaper
│   ├── menubar/              # MenuBar (상단), StatusItems
│   ├── dock/                 # Dock (하단), DockItem
│   ├── window/               # WindowFrame (창 프레임)
│   ├── chatbot/              # ChatbotWidget (팝업)
│   ├── finder/               # FinderApp (폴더 창 내용)
│   └── viewer/               # ViewerApp (파일 창 내용)
│
├── hooks/                    # 모든 React 훅
│   ├── useWindows.ts         # 창 매니저 (z-index/드래그/focus)
│   ├── useNarrator.ts        # 행동 → 나레이션 브릿지
│   └── useUploads.ts         # 사용자 업로드 (제한)
│
├── store/                    # Zustand 글로벌 스토어 (TODO)
│
├── types/
│   ├── window.ts             # WindowState, WindowKind
│   ├── filesystem.ts         # FsNode, FolderNode, FileNode
│   └── narrator.ts           # NarrationEvent
│
├── utils/
│   ├── filesystemData.ts     # 정적 파일시스템 정의 (경력/설계/기획)
│   └── scenarios.ts          # 나레이션 멘트 (LLM 호출 0)
│
└── styles/
    ├── reset.css
    ├── tokens.css            # Liquid Glass 토큰
    └── glass.css             # 글래스 유틸 (.glass / .glass--strong)
```

---

## 8. 결정 로그

| # | 결정사항 | 답 | 메모 |
|---|---|---|---|
| 1 | 챗봇 위치 | 팝업 위젯 (Dock 트리거) | macOS Control Center 스타일 |
| 2 | 상단 메뉴바 | 만듦 (장식이라도) | Liquid Glass |
| 3 | 파일시스템 | 정적 + 동적 (제한) | 업로드 제한 세부 미확정 |
| 4 | 창 매니저 | 자체 구현 + react-rnd | 포트폴리오 어필 |
| 5 | 디자인 | Liquid Glass | macOS Tahoe / iOS 26 |
| 6 | 패키지 매니저 | npm | 기존 프로젝트와 동일 스펙 유지 |
| 7 | axios 사용 | 미정 (제거 검토 중) | SSE는 fetch가 나음 |

---

## 9. 열린 이슈 / TODO

- [ ] **경력 폴더 내부 구조 결정** — 회사별? 프로젝트별? 시간순?
- [ ] **잠긴 파일 컨셉 확정** — 어떤 파일을 잠가둘지, CTA 문구
- [ ] **챗봇 톤 결정** — 1인칭 ("저는 ~") vs 3인칭 ("[이름]님은 ~")
- [ ] **임베딩 전략 최종 확정** — 옵션 A/B/C 중 택1
- [ ] **사용자 업로드 제한 수치 확정** — 파일 크기 / 개수 / 세션 정의
- [ ] **휴지통 / 메모 위젯 등 추가 아이템** — 구현 여부
- [ ] **모바일 대응** — 데스크탑 전용? 반응형?
- [ ] **다크모드** — 시스템 설정 따라가기?
- [ ] **인트로 시퀀스 스크립트 작성**
- [ ] **배포 환경** — Vercel? Cloudflare Pages?

---

## 10. 작업 순서 (제안)

1. **Phase 0 — 셋업** *(완료)*
   - Vite + Bun + 의존성 + 폴더 구조 + 토큰

2. **Phase 1 — 정적 OS 셸**
   - MenuBar (장식) + Wallpaper + Dock (장식)
   - Liquid Glass 검증

3. **Phase 2 — 데스크탑 + 창 매니저**
   - DesktopIcon 그리드 + 더블클릭 → Window 열기
   - WindowFrame (드래그/리사이즈/traffic-light)
   - useWindows (z-index 관리)

4. **Phase 3 — 파일시스템 + Finder/Viewer**
   - 정적 데이터 (경력/설계/기획)
   - FinderApp, ViewerApp

5. **Phase 4 — 챗봇 위젯 + 나레이터**
   - Dock 트리거 → 팝업
   - 시나리오 기반 나레이션
   - assistant-ui 통합

6. **Phase 5 — LLM 연동**
   - 서버리스 함수 + 스트리밍
   - 자유 질문 모드

7. **Phase 6 — 업로드 + RAG**
   - 동적 파일 + 검색
   - 잠긴 파일 CTA

8. **Phase 7 — 다듬기**
   - 애니메이션, 사운드, 모바일, 다크모드
