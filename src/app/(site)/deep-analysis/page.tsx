import { redirect } from "next/navigation";

// "Deep Analysis" was a third front door onto the same assistant, which is why
// clicking any of the three looked like nothing but a heading change. The deep
// analysis a visitor is actually after is the paid report, so the URL now goes
// straight there instead of to a fourth version of the same page.
export default function DeepAnalysisPage() {
  redirect("/get-report/deep_analysis_report");
}
