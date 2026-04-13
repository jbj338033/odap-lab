"use client";

import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  showSampleButton?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  showSampleButton = true,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="text-muted-foreground/40">{icon}</div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-[13px] text-muted-foreground">{description}</p>
      </div>
      {showSampleButton && (
        <Link href="/upload?sample=true">
          <Button variant="outline" className="h-9 gap-2 text-[13px]">
            <FlaskConical className="h-3.5 w-3.5" />
            샘플 시험지로 체험하기
          </Button>
        </Link>
      )}
    </div>
  );
}
