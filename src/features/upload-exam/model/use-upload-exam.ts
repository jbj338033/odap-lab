"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAnalysisStore } from "@/shared/stores/analysis-store";
import { compressImage } from "../lib/compress-image";
import type { AnalysisResult } from "@/entities/analysis";

export type UploadStatus =
  | "idle"
  | "uploading"
  | "extracting"
  | "classifying"
  | "done";

export const STATUS_LABELS: Record<UploadStatus, string> = {
  idle: "",
  uploading: "이미지 업로드 중...",
  extracting: "문제 추출 중...",
  classifying: "오류 유형 분류 중...",
  done: "분석 완료!",
};

export function useUploadExam() {
  const router = useRouter();
  const addAnalysis = useAnalysisStore((s) => s.addAnalysis);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  const addFiles = useCallback((newFiles: File[]) => {
    const imageFiles = newFiles.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...imageFiles]);
    for (const file of imageFiles) {
      setPreviews((prev) => [...prev, URL.createObjectURL(file)]);
    }
  }, []);

  const removeFile = useCallback(
    (index: number) => {
      URL.revokeObjectURL(previews[index]);
      setFiles((prev) => prev.filter((_, i) => i !== index));
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    },
    [previews],
  );

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setError(null);
    setStatus("uploading");

    try {
      const formData = new FormData();
      setStatus("extracting");

      for (const file of files) {
        const compressed = await compressImage(file);
        formData.append("images", compressed, file.name);
      }

      if (title.trim()) formData.append("title", title.trim());
      if (subject.trim()) formData.append("subject", subject.trim());

      setStatus("classifying");
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "분석에 실패했습니다");
      }

      const result: AnalysisResult = await res.json();
      addAnalysis(result);
      setStatus("done");
      router.push(`/analysis/${result.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
      setStatus("idle");
    }
  };

  const isProcessing = status !== "idle" && status !== "done";

  return {
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
  };
}
