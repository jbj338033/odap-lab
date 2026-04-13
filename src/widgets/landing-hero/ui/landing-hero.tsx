import Link from "next/link";
import {
  FlaskConical,
  ArrowRight,
  Upload,
  Brain,
  Target,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/shared/ui/button";

const STEPS = [
  {
    step: "01",
    icon: Upload,
    title: "시험지 촬영",
    desc: "사진만 올리면 AI가 문제·답·채점을 자동 추출",
  },
  {
    step: "02",
    icon: Brain,
    title: "오답 원인 진단",
    desc: "개념 미이해, 계산 오류 등 5가지 유형으로 원인 분석",
  },
  {
    step: "03",
    icon: Target,
    title: "맞춤 연습문제",
    desc: "틀린 유형에 맞는 AI 연습문제로 약점 집중 훈련",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "성장 추적",
    desc: "정답률 추이, 약점 변화, 지식 맵으로 성장 시각화",
  },
];

export function LandingHero() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            <span className="text-[13px] font-semibold tracking-tight">
              오답연구소
            </span>
          </div>
          <Link href="/upload">
            <Button size="sm" className="h-8 gap-1.5 text-xs">
              시작하기
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
          <FlaskConical className="h-3 w-3 text-primary" />
          <span className="text-[11px] font-medium text-muted-foreground">
            AI 기반 학습 진단 플랫폼
          </span>
        </div>

        <h1 className="max-w-lg text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          틀린 문제를 연구하면
          <br />
          <span className="text-primary">맞는 공부</span>가 보입니다
        </h1>

        <p className="mt-5 max-w-md text-center text-[15px] leading-relaxed text-muted-foreground">
          시험지 사진만 올리면 AI가 오답 원인을 진단하고,
          <br className="hidden sm:block" />
          약점에 맞는 연습문제를 만들어줍니다
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/upload">
            <Button className="h-11 gap-2 px-7 text-sm">
              시험지 분석하기
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/upload?sample=true">
            <Button variant="outline" className="h-11 gap-2 px-7 text-sm">
              <FlaskConical className="h-3.5 w-3.5" />
              샘플로 체험하기
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works — Learning Loop */}
      <section className="border-t border-border px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-2 text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            How it works
          </p>
          <h2 className="mb-10 text-center text-xl font-semibold tracking-tight">
            AI가 만드는 학습 루프
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ step, icon: Icon, title, desc }, i) => (
              <div key={step} className="relative">
                <div className="rounded-lg border border-border bg-card p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-primary">
                      {step}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h3 className="text-[14px] font-semibold">{title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                    {desc}
                  </p>
                </div>
                {/* Arrow connector */}
                {i < STEPS.length - 1 && (
                  <ChevronRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground/30 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain point section */}
      <section className="border-t border-border px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-semibold tracking-tight">
            오답 노트, <span className="text-muted-foreground">이제 AI가 대신합니다</span>
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            손으로 오답 노트를 정리하는 건 시간도 오래 걸리고, 왜 틀렸는지 스스로 분석하기 어렵습니다.
            오답연구소는 시험지 사진 한 장으로 원인 진단부터 맞춤 연습까지 자동화합니다.
          </p>
          <div className="mt-8">
            <Link href="/upload?sample=true">
              <Button variant="outline" className="h-10 gap-2 px-6 text-[13px]">
                <FlaskConical className="h-3.5 w-3.5" />
                지금 바로 체험하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-5 text-center">
        <span className="text-[11px] text-muted-foreground/50">
          2026 KIT 바이브코딩 공모전
        </span>
      </footer>
    </div>
  );
}
