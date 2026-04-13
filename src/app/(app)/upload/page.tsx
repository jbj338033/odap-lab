import { Suspense } from "react";
import { UploadExamPage } from "@/widgets/upload-exam";

export default function UploadPage() {
  return (
    <Suspense>
      <UploadExamPage />
    </Suspense>
  );
}
