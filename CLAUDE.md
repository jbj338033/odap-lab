# odap-lab

AI 학습 진단 플랫폼 (오답연구소). 시험지 사진 → AI 오답 원인 진단 → 맞춤 연습문제.

## stack

- next.js 16 app router, typescript, tailwind v4, shadcn/ui (base-nova)
- ai sdk v6 (`generateText` + `Output.object`, `streamText`), openai gpt-5.4
- zustand (localstorage persist), @xyflow/react
- pnpm

## architecture (FSD)

```
src/
├── app/          # routes only. pages are 3-5 lines importing widgets
├── entities/     # domain models (analysis, practice) — types, zod schemas, constants
├── features/     # business logic — hooks (model/), ui components (ui/)
├── widgets/      # page-level compositions — orchestrate features + entities
└── shared/       # cross-cutting — ui (shadcn), api (ai model, prompts), stores, lib
```

### layer rules

- app → widgets only
- widgets → features + entities + shared
- features → entities + shared
- entities → shared only
- shared → external deps only
- cross-slice imports go through index.ts barrel
- intra-slice uses relative imports

## conventions

- page titles: `text-lg font-semibold`
- section labels: `section-label` class (11px uppercase)
- body text: 13px, meta: 11px
- `font-mono` only for numeric data (percentages, counts), never for Korean text
- all zustand-dependent components need hydration guard:
  ```tsx
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  if (!hydrated) return <Skeleton />;
  ```
- ai model defined in `shared/api/ai.ts`, prompts in `shared/api/prompts.ts`
- api routes delegate business logic to shared/api
- dark mode only (class="dark" on html)
- theme: linear-inspired dark — bg #121214, accent #848cd0 (muted indigo)
- fonts: Pretendard Variable (body/headings) + JetBrains Mono (numbers only)
- cards: `rounded-lg border border-border bg-card` (no glassmorphism)
- layout: top navigation bar (not sidebar), max-w-5xl centered

## env

- `OPENAI_API_KEY` — required for all ai features
