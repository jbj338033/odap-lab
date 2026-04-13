"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, FlaskConical } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  UploadDropzone,
  useUploadExam,
  STATUS_LABELS,
} from "@/features/upload-exam";

export function UploadExamPage() {
  const searchParams = useSearchParams();
  const sampleTriggered = useRef(false);
  const {
    files,
    previews,
    status,
    error,
    isProcessing,
    title,
    setTitle,
    subject,
    setSubject,
    addFiles,
    removeFile,
    handleAnalyze,
  } = useUploadExam();

  const [loadingSample, setLoadingSample] = useState(false);

  async function handleSample() {
    setLoadingSample(true);
    try {
      const res = await fetch("/sample-exam.png");
      const blob = await res.blob();
      const file = new File([blob], "2026-3월-고3-수학-모의고사.png", {
        type: "image/png",
      });
      addFiles([file]);
      setTitle("2026 3월 모의고사");
      setSubject("수학");
    } finally {
      setLoadingSample(false);
    }
  }

  useEffect(() => {
    if (searchParams.get("sample") === "true" && !sampleTriggered.current) {
      sampleTriggered.current = true;
      handleSample();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount when sample query present
  }, [searchParams]);

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-semibold">시험지 분석</h1>

      <UploadDropzone
        previews={previews}
        isProcessing={isProcessing}
        onAddFiles={addFiles}
        onRemoveFile={removeFile}
      />

      {files.length === 0 && !isProcessing && (
        <button
          type="button"
          onClick={handleSample}
          disabled={loadingSample}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-primary/20 bg-primary/5 py-3 text-[13px] text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
        >
          {loadingSample ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <FlaskConical className="h-3.5 w-3.5" />
          )}
          샘플 시험지로 체험하기
        </button>
      )}

      <div className="grid grid-cols-2 gap-3">
        <fieldset className="space-y-1.5">
          <label className="text-[11px] font-medium text-muted-foreground">
            시험 제목
          </label>
          <input
            type="text"
            placeholder="예: 수학 중간고사"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm transition-colors placeholder:text-muted-foreground/40 focus:border-ring focus:outline-none"
            disabled={isProcessing}
          />
        </fieldset>
        <fieldset className="space-y-1.5">
          <label className="text-[11px] font-medium text-muted-foreground">
            과목
          </label>
          <input
            type="text"
            placeholder="예: 수학"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm transition-colors placeholder:text-muted-foreground/40 focus:border-ring focus:outline-none"
            disabled={isProcessing}
          />
        </fieldset>
      </div>

      {error && (
        <p className="text-[13px] text-destructive">{error}</p>
      )}

      {isProcessing && (
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {STATUS_LABELS[status]}
        </div>
      )}

      <Button
        className="w-full"
        onClick={handleAnalyze}
        disabled={files.length === 0 || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            분석 중...
          </>
        ) : (
          `분석 시작 (${files.length}장)`
        )}
      </Button>
    </div>
  );
}
