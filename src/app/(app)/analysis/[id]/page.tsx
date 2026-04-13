import { AnalysisDetail } from "@/widgets/analysis-detail";

export default function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <AnalysisDetail params={params} />;
}
