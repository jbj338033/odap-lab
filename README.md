<p align="center">
  <img src="public/banner.svg" alt="오답연구소" width="100%" />
</p>

<p align="center">
  <strong>시험지 사진 한 장으로 AI가 오답 원인을 진단합니다</strong>
</p>

<p align="center">
  <a href="#기능">기능</a> · <a href="#시작하기">시작하기</a> · <a href="#기술-스택">기술 스택</a> · <a href="#아키텍처">아키텍처</a>
</p>

---

## 왜 만들었나

기존 교육 앱(콴다, QuizScanner)은 **정답**을 알려주거나 오답을 **저장**하는 데 그칩니다.
하지만 성적 향상의 핵심은 **왜 틀렸는지** 아는 것입니다.

오답연구소는 이 공백을 메웁니다:

```
시험지 촬영 → AI 원인 진단 → 맞춤 연습문제 → 성장 추적
```

## 기능

### 시험지 분석
사진을 올리면 GPT-5.4 Vision이 문제·학생 답·정답·채점 결과를 자동 인식합니다.

### 오답 원인 진단
틀린 문제마다 5가지 유형으로 분류합니다:
- **개념 미이해** — 개념을 잘못 이해하여 체계적으로 틀림
- **계산/풀이 오류** — 풀이 방향은 맞지만 중간 계산 실수
- **부주의 실수** — 부호, 단위 등 사소한 실수
- **지식 부족** — 해당 단원을 학습하지 않음
- **문제 오독** — 조건을 잘못 읽거나 보기 번호 혼동

### AI 학습 리포트
핵심 약점, 최우선 공부법, 잘한 점을 요약한 진단서를 스트리밍으로 생성합니다.

### 맞춤 연습문제
진단된 약점과 오류 유형에 맞는 4지선다 문제를 AI가 생성합니다. LaTeX 수식을 지원합니다.

### 대시보드 & 지식 맵
정답률 추이, 오류 유형 분포, 개념별 숙련도를 시각화하여 성장을 추적합니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router), TypeScript |
| AI | Vercel AI SDK v6, OpenAI GPT-5.4 (Vision, Structured Output, Streaming) |
| 스타일 | Tailwind CSS v4, shadcn/ui (base-nova), Pretendard |
| 상태 관리 | Zustand (localStorage persist) |
| 시각화 | @xyflow/react (지식 맵), KaTeX (수식) |
| 검증 | Zod (API 입출력 스키마) |

## 아키텍처

[Feature-Sliced Design](https://feature-sliced.design/) 기반:

```
src/
├── app/          # 라우팅 (thin pages)
├── entities/     # 도메인 모델 — types, Zod schemas, constants
├── features/     # 비즈니스 로직 — hooks, UI components
├── widgets/      # 페이지 조합
└── shared/       # 공통 — UI, API, stores, utils
```

**AI 파이프라인:**

```
시험지 이미지
  ↓ (클라이언트 압축)
/api/analyze
  ├─ 추출: Vision → Zod Structured Output
  └─ 분류: 오류 유형 진단 → Zod Array Output
  ↓
/api/diagnose
  └─ 스트리밍 학습 리포트 생성
  ↓
/api/practice
  └─ 약점 기반 연습문제 생성 → Zod Array Output
```

## 시작하기

```bash
pnpm install
cp .env.example .env.local
# OPENAI_API_KEY 설정
pnpm dev
```

| 환경 변수 | 설명 |
|-----------|------|
| `OPENAI_API_KEY` | OpenAI API 키 (필수) |

## 라이선스

MIT
