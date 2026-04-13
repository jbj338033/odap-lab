"use client";

import { useRef, useCallback } from "react";
import { Upload, Camera, X, ImageIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface UploadDropzoneProps {
  previews: string[];
  isProcessing: boolean;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}

export function UploadDropzone({
  previews,
  isProcessing,
  onAddFiles,
  onRemoveFile,
}: UploadDropzoneProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onAddFiles(Array.from(e.dataTransfer.files));
    },
    [onAddFiles],
  );

  return (
    <div
      className="rounded-lg border border-dashed border-border transition-colors hover:border-muted-foreground/30"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-3 px-6 py-10">
        {previews.length > 0 ? (
          <div className="grid w-full grid-cols-3 gap-2">
            {previews.map((src, i) => (
              <div
                key={i}
                className="group relative aspect-[3/4] overflow-hidden rounded-md bg-muted"
              >
                <img
                  src={src}
                  alt={`${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveFile(i)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <>
            <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                시험지 사진을 드래그하거나 선택하세요
              </p>
            </div>
          </>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => fileRef.current?.click()}
            disabled={isProcessing}
          >
            <Upload className="mr-1 h-3 w-3" />
            파일
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => cameraRef.current?.click()}
            disabled={isProcessing}
          >
            <Camera className="mr-1 h-3 w-3" />
            카메라
          </Button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onAddFiles(Array.from(e.target.files));
          e.target.value = "";
        }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onAddFiles(Array.from(e.target.files));
          e.target.value = "";
        }}
      />
    </div>
  );
}
