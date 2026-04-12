# 오답연구소 — 아키텍처 설계

> 개발 착수 전 작성. 기술 스택 선정 배경과 아키텍처 결정 근거를 기록함.

## 1. 기술 스택

| 영역 | 선택 | 대안 | 선택 이유 |
|------|------|------|-----------|
| 프레임워크 | Next.js 16 (App Router) | Remix, SvelteKit | AI SDK와의 통합이 가장 성숙, API Routes로 백엔드 별도 구축 불필요 |
| 언어 | TypeScript | JavaScript | Zod 스키마와 AI 응답 타입을 일관되게 관리하려면 타입 시스템 필수 |
| 스타일 | Tailwind CSS v4 + shadcn/ui | CSS Modules, Chakra UI | 빠른 프로토타이핑, 다크 테마 커스텀 용이, 컴포넌트 소유권 유지 |
| AI SDK | Vercel AI SDK v6 | LangChain, 직접 fetch | generateText + Output.object로 Zod 스키마 기반 구조화 출력을 타입 안전하게 처리 |
| AI 모델 | OpenAI GPT-5.4 | Claude, Gemini | Vision + Structured Output + 한국어 성능 균형이 가장 좋음 |
| 상태관리 | Zustand + localStorage persist | Redux, Jotai | 서버 DB 없이 클라이언트만으로 데이터 영속성 확보. 보일러플레이트 최소 |
| 시각화 | @xyflow/react, 커스텀 SVG | Recharts, D3 | 지식 맵은 인터랙티브 그래프가 필요 → xyflow. 차트는 의존성 줄이려고 SVG 직접 구현 |
| 수식 렌더링 | KaTeX + remark-math | MathJax | 렌더링 속도가 빠르고 번들 크기가 작음 |

## 2. 아키텍처: Feature-Sliced Design (FSD)

### 왜 FSD인가

일반적인 `components/hooks/utils` 구조는 프로젝트가 커지면 "이 컴포넌트가 어떤 기능에 속하는지" 파악이 어려워진다. 이 프로젝트는 분석·진단·연습·대시보드·지식맵 등 독립적인 기능이 여러 개 있어서, 기능 단위로 코드를 격리하는 FSD가 적합하다.

### 레이어 설계

```
src/
├── app/           라우팅만. 페이지 컴포넌트는 3-5줄 (위젯 import)
├── entities/      도메인 모델. 타입, Zod 스키마, 상수
├── features/      비즈니스 로직. hooks (model/), UI 컴포넌트 (ui/)
├── widgets/       페이지 단위 조합. features + entities 조합
└── shared/        횡단 관심사. UI 컴포넌트, API 설정, 스토어, 유틸
```

### 의존성 규칙

```
app → widgets (only)
widgets → features + entities + shared
features → entities + shared
entities → shared
shared → 외부 패키지만
```

슬라이스 간: barrel export (index.ts) 통해서만 접근.
슬라이스 내: 상대 경로로 자유롭게 import.

### 슬라이스 구성

| 레이어 | 슬라이스 | 역할 |
|--------|----------|------|
| entities | analysis | 시험 분석 결과 타입, Zod 스키마, 오류 유형 상수 |
| entities | practice | 연습문제 타입, Zod 스키마 |
| features | upload-exam | 이미지 업로드, 압축, 분석 요청 |
| features | analysis-viewer | 분석 결과 표시, 문제 카드, 파이차트 |
| features | analysis-history | 분석 이력 목록 |
| features | dashboard | 정답률 추이 차트, 오류 유형 바 차트 |
| features | knowledge-map | 개념 그래프 데이터 생성 + 시각화 |
| features | practice | 연습문제 생성 요청, 풀기, 채점 |
| widgets | landing-hero | 랜딩 페이지 전체 |
| widgets | app-shell | 상단 네비게이션 + 레이아웃 |
| widgets | upload-exam | 업로드 페이지 조합 |
| widgets | analysis-detail | 분석 결과 페이지 조합 |
| widgets | analysis-history | 이력 페이지 조합 |
| widgets | dashboard | 대시보드 페이지 조합 |
| widgets | knowledge-map | 지식 맵 페이지 조합 |
| widgets | practice | 연습문제 페이지 조합 |

## 3. AI 파이프라인 설계

### 데이터 흐름

```
[클라이언트]                              [서버 API Routes]
시험지 사진 (다중)                         
   ↓ OffscreenCanvas 압축 (1600px, JPEG 85%)
   ↓ FormData 전송
                                          /api/analyze
                                          ├─ Step 1: Vision → 문제 추출
                                          │  generateText + Output.object
                                          │  → TestPaperExtractionSchema
                                          │
                                          ├─ Step 2: 오류 분류
                                          │  generateText + Output.array
                                          │  → ErrorClassificationSchema[]
                                          │
                                          └─ 요약 계산 (서버 로직, AI 아님)
                                             → AnalysisResult 반환
   ↓ Zustand 저장
   ↓ 페이지 이동 (/analysis/[id])
                                          /api/diagnose
                                          └─ streamText → 학습 리포트 스트리밍

[연습문제 요청 시]                         /api/practice
                                          └─ generateText + Output.array
                                             → PracticeProblem[] 반환
```

### 스키마 설계 원칙

- 모든 AI 응답은 Zod 스키마로 타입 강제 → 파싱 실패 = 0
- 스키마는 entities 레이어에 정의, API 라우트에서 import
- `.describe()`로 각 필드에 한국어 설명 추가 → AI가 의도를 정확히 이해

### 프롬프트 설계 원칙

- 각 단계별 전담 시스템 프롬프트 (shared/api/prompts.ts에 모아둠)
- 추출: "모든 문제를 빠짐없이" 강조 (누락 방지)
- 분류: "각 문제를 개별적으로 분석" 강조 (일괄 분류 방지)
- 진단: 200자 이내 형식 제한 (장황한 출력 방지)
- 연습문제: LaTeX 수식 작성 규칙 명시 (렌더링 깨짐 방지)

## 4. 상태 관리 설계

### 왜 서버 DB 없이 localStorage인가

- MVP 범위에서 계정 시스템 없음 → 서버 DB 불필요
- Zustand persist로 브라우저 닫아도 데이터 유지
- 분석 결과 자체가 크지 않음 (JSON 몇 KB)
- 배포 환경(Vercel)에서 DB 프로비저닝 없이 즉시 사용 가능

### Hydration 처리

Zustand + localStorage = SSR과 충돌. 모든 스토어 의존 컴포넌트에 hydration guard 패턴 적용:

```
mount 시 hydrated = true → 그 전까지 Skeleton 표시
```

## 5. UI/UX 설계 결정

| 결정 | 근거 |
|------|------|
| 다크 모드 전용 | 학생 타겟 → 야간 학습 비율 높음. 모드 전환 복잡도 제거 |
| Linear 스타일 테마 | 깔끔하고 전문적인 느낌. 교육앱의 "유치한" 이미지 탈피 |
| 상단 네비게이션 (사이드바 X) | 페이지 수가 5개로 적음. 사이드바는 과도 |
| max-w-5xl 중앙 정렬 | 콘텐츠 가독성 최적화. 와이드 스크린에서 시선 분산 방지 |
| font-mono는 숫자만 | 퍼센트, 카운트 등 데이터에만 모노스페이스. 한국어에 적용하면 가독성 저하 |
| section-label (11px uppercase) | Linear의 섹션 라벨 패턴. 시각적 계층 명확화 |

## 6. 주요 결정 기록

### ADR 1: Vision API로 시험지 파싱

- **결정**: OCR 라이브러리 대신 GPT-5.4 Vision 사용
- **대안**: Tesseract OCR, Google Cloud Vision
- **이유**: 손글씨 + 채점 표시(O, X, 동그라미) + 수식이 혼재 → 범용 OCR로는 정확도 부족. Vision API는 이미지 "이해"가 가능하여 문맥 기반 파싱 가능

### ADR 2: 3단계 파이프라인 분리

- **결정**: 추출 → 분류 → 진단을 별도 API 호출로 분리
- **대안**: 하나의 프롬프트에 모든 작업 요청
- **이유**: 단일 프롬프트는 지시가 길어지면 중간 단계를 건너뛰는 경향 있음. 분리하면 각 단계 실패 시 재시도 범위 최소화, 프롬프트 전문성 향상

### ADR 3: 커스텀 SVG 차트

- **결정**: Recharts/D3 대신 SVG 직접 구현
- **대안**: Recharts, Chart.js, Nivo
- **이유**: 필요한 차트가 라인 차트 1개 + 파이 차트 1개 + 바 차트 1개. 라이브러리 추가하면 번들 크기만 늘어남. SVG로 충분히 구현 가능

### ADR 4: Zustand over Redux

- **결정**: Zustand + persist 미들웨어
- **대안**: Redux Toolkit, Jotai, Context API
- **이유**: 글로벌 상태가 analyses 배열 하나뿐. Redux는 보일러플레이트 과다. Zustand는 persist 미들웨어로 localStorage 연동이 한 줄
