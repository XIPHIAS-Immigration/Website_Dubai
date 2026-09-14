// src/lib/reports/catalogue.ts
// -----------------------------------------------------------------------------
// The XIPHIAS Dubai report catalogue.
//
// ⚠ PRICING IS A DRAFT. Every amount below is a placeholder ladder put in so the
// pages render and the ordering makes sense. Confirm the real AED numbers with
// the Dubai office and change them HERE — nothing else hardcodes a price.
//
// Dubai is enquiry-first: there is no payment gateway on this site. Each report
// page collects the visitor's details and an advisor closes over phone/WhatsApp.
// The slugs match the India site's report types so the XIA assistant can link
// straight through without a mapping table.
// -----------------------------------------------------------------------------

export type ReportSlug =
  | "route_report"
  | "premium_report"
  | "cost_report"
  | "compare_report"
  | "docs_report"
  | "due_diligence_report"
  | "us_visa_report"
  | "deep_analysis_report";

export type ReportProduct = {
  slug: ReportSlug;
  title: string;
  tagline: string;
  /** Draft AED price — confirm before launch. */
  priceAed: number;
  turnaround: string;
  /** Ordered, concrete. Every line is something the reader can point at. */
  includes: string[];
  bestFor: string;
  /** Highlighted on the catalogue page. */
  featured?: boolean;
};

export const REPORTS: ReportProduct[] = [
  {
    slug: "route_report",
    title: "Route Intelligence Report",
    tagline: "Every route you qualify for today, ranked, with the gaps named.",
    priceAed: 99,
    turnaround: "Within 24 hours",
    includes: [
      "Your profile scored against every programme we track",
      "The routes you clear today, ranked by realistic odds",
      "The routes you nearly clear, and exactly what is short",
      "Current official processing times and government fees",
      "One recommended next step, with the reason for it",
    ],
    bestFor: "Anyone who has been told 'you qualify' and wants it in writing.",
    featured: true,
  },
  {
    slug: "premium_report",
    title: "Personal Immigration Strategy Report",
    tagline: "One route, chosen for you, planned end to end.",
    priceAed: 249,
    turnaround: "2 working days",
    includes: [
      "A single recommended route with the case for it",
      "Month-by-month plan from today to landing",
      "Full cost picture: government, professional, settlement",
      "Dependants, schooling and spousal work rights",
      "The three risks most likely to derail your file, and the fix",
    ],
    bestFor: "Families who have decided to move and need the plan.",
    featured: true,
  },
  {
    slug: "cost_report",
    title: "Cost & Budget Report",
    tagline: "What it actually costs — not the headline number.",
    priceAed: 99,
    turnaround: "Within 24 hours",
    includes: [
      "Government and biometric fees, per applicant",
      "Proof-of-funds thresholds and when they are tested",
      "Medicals, police clearances, translations, attestation",
      "Settlement costs in your destination city",
      "A cash-flow view: what is due when",
    ],
    bestFor: "Deciding whether the move is affordable this year or next.",
  },
  {
    slug: "compare_report",
    title: "Programme Comparison Report",
    tagline: "Two or three routes, side by side, on the things that matter.",
    priceAed: 99,
    turnaround: "Within 24 hours",
    includes: [
      "Up to three programmes compared on one page",
      "Eligibility, cost, timeline and PR pathway for each",
      "Where each one is strongest for your profile",
      "What you give up by choosing one over the other",
      "A recommendation, with the reasoning shown",
    ],
    bestFor: "Stuck between Canada and Australia — or between two visa classes.",
  },
  {
    slug: "docs_report",
    title: "Document Readiness Report",
    tagline: "The file you will need, checked before you start paying for it.",
    priceAed: 99,
    turnaround: "Within 24 hours",
    includes: [
      "Every document your chosen route requires",
      "Which need attestation, apostille or translation",
      "UAE-specific steps: MOFA, embassy, tenancy and Emirates ID",
      "What expires, and how early is too early",
      "Ordered checklist you can work through",
    ],
    bestFor: "Anyone about to start collecting paperwork.",
  },
  {
    slug: "due_diligence_report",
    title: "Immigration Due Diligence Report",
    tagline: "Before you commit money to a programme, have it checked.",
    priceAed: 499,
    turnaround: "3 working days",
    includes: [
      "Programme legitimacy and current legislative status",
      "Source-of-funds standards you will be held to",
      "Known rejection triggers for your nationality and profile",
      "Political and policy risk over your timeline",
      "A plain verdict: proceed, proceed with conditions, or do not",
    ],
    bestFor: "Investment residency and citizenship routes with real money at stake.",
  },
  {
    slug: "us_visa_report",
    title: "US Visa Strategy Report",
    tagline: "EB-5, E-2, L-1, O-1 — which one your profile actually supports.",
    priceAed: 249,
    turnaround: "2 working days",
    includes: [
      "Every US route your profile and capital support",
      "Current backlog and priority-date reality for your country",
      "Investment thresholds and TEA positioning where relevant",
      "Where your case is weak before USCIS sees it",
      "Recommended route and the evidence it will need",
    ],
    bestFor: "Business owners and senior professionals looking at the US.",
  },
  {
    slug: "deep_analysis_report",
    title: "High-Skill Deep Analysis Report",
    tagline: "The full workup, when the decision is worth getting right.",
    priceAed: 499,
    turnaround: "3 working days",
    includes: [
      "Everything in the Strategy report, for every viable route",
      "Points scoring worked line by line, with the improvement levers",
      "Occupation demand and licensing in each destination",
      "A 24-month plan with decision points marked",
      "A 30-minute call with an advisor to walk through it",
    ],
    bestFor: "Senior professionals weighing several countries at once.",
    featured: true,
  },
];

export const REPORT_BY_SLUG: Record<ReportSlug, ReportProduct> = REPORTS.reduce(
  (acc, item) => {
    acc[item.slug] = item;
    return acc;
  },
  {} as Record<ReportSlug, ReportProduct>,
);

export function isReportSlug(value: string): value is ReportSlug {
  return Object.prototype.hasOwnProperty.call(REPORT_BY_SLUG, value);
}

export function formatAed(amount: number) {
  return `AED ${amount.toLocaleString("en-AE")}`;
}
