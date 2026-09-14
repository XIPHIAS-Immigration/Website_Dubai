import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, FileText, ShieldCheck, Sparkles } from "lucide-react";

import { REPORTS, formatAed } from "@/lib/reports/catalogue";

export const metadata: Metadata = {
  title: "Immigration Reports | XIPHIAS Immigration Dubai",
  description:
    "Written immigration assessments prepared by licensed advisors in Dubai. Route intelligence, cost and budget, document readiness, due diligence and full strategy reports.",
  alternates: { canonical: "/reports" },
  openGraph: {
    title: "Immigration Reports | XIPHIAS Immigration Dubai",
    description:
      "Written immigration assessments prepared by licensed advisors in Dubai — routes you qualify for, what they cost, and what your file is missing.",
    url: "/reports",
    type: "website",
  },
};

const PROOF = [
  { value: "17+", label: "Years advising" },
  { value: "39", label: "Industry awards" },
  { value: "6", label: "Global offices" },
  { value: "4.8★", label: "Google rating" },
];

const HOW = [
  {
    step: "01",
    title: "Tell us about you",
    body: "Two minutes with XIA, or the short form on the report page. Profession, country of interest, family, budget.",
  },
  {
    step: "02",
    title: "An advisor builds it",
    body: "A licensed advisor works your profile against live programme rules — not a template with your name pasted in.",
  },
  {
    step: "03",
    title: "It lands in your inbox",
    body: "A written report you can act on, keep, and show your family. Followed by a call if you want one.",
  },
];

export default function ReportsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "XIPHIAS Immigration Dubai — report catalogue",
    itemListElement: REPORTS.map((report, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: report.title,
        description: report.tagline,
        brand: { "@type": "Brand", name: "XIPHIAS Immigration" },
        offers: {
          "@type": "Offer",
          price: report.priceAed,
          priceCurrency: "AED",
          availability: "https://schema.org/InStock",
          url: `/get-report/${report.slug}`,
        },
      },
    })),
  };

  return (
    <main className="xia-type-system relative min-h-screen overflow-hidden bg-[#0a1733] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <span aria-hidden className="xia-aurora xia-aurora--gold" />
      <span aria-hidden className="xia-aurora xia-aurora--sky" />
      <span aria-hidden className="xia-dots" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative !bg-transparent">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-20 sm:px-6 sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e1b923]/35 bg-[#e1b923]/10 px-4 py-1.5 text-[12px] font-black uppercase tracking-[0.16em] text-[#f0cb3b]">
            <Sparkles className="size-3.5" aria-hidden /> Written by licensed advisors
          </span>

          <h1 className="mt-6 max-w-3xl text-[38px] font-black leading-[1.06] sm:text-[54px]">
            <span className="xia-sheen">Stop guessing</span> whether you qualify.
          </h1>

          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/75 sm:text-[19px]">
            Every consultant in this market will tell you on a call that you have a strong profile.
            A report puts it in writing — the routes you clear, the ones you don&apos;t, what each
            costs, and what your file is missing. You keep it either way.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/xia-intelligence"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#e1b923] px-7 text-[15px] font-black text-[#0a1733] shadow-[0_12px_30px_rgba(225,185,35,0.3)] transition hover:-translate-y-0.5 hover:bg-[#f0cb3b]"
            >
              Find my report in 2 minutes
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/personal-booking#schedule"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/[0.07] px-7 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/[0.14]"
            >
              Talk to an advisor first
            </Link>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PROOF.map((item) => (
              <li
                key={item.label}
                className="rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-4 text-center"
              >
                <p className="text-[26px] font-black tabular-nums text-[#f0cb3b]">{item.value}</p>
                <p className="type-caption mt-1 uppercase tracking-[0.1em] text-white/55">
                  {item.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Catalogue ────────────────────────────────────────────────────── */}
      <section className="relative !bg-transparent">
        <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
          <h2 className="text-[28px] font-black sm:text-[34px]">Choose your report</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-white/65">
            Not sure which one? Start with Route Intelligence — it tells you which of the others is
            worth buying.
          </p>

          <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {REPORTS.map((report) => (
              <li
                key={report.slug}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border p-6 transition hover:-translate-y-1 ${
                  report.featured
                    ? "border-[#e1b923]/45 bg-[#e1b923]/[0.07] shadow-[0_18px_50px_rgba(0,0,0,0.3)]"
                    : "border-white/12 bg-white/[0.04] hover:border-white/30"
                }`}
              >
                {report.featured ? (
                  <span className="absolute right-5 top-5 rounded-full bg-[#e1b923] px-2.5 py-1 text-[10.5px] font-black uppercase tracking-[0.1em] text-[#0a1733]">
                    Most taken
                  </span>
                ) : null}

                <FileText className="size-6 text-[#f0cb3b]" aria-hidden />
                <h3 className="mt-4 pr-20 text-[20px] font-black leading-snug">{report.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">{report.tagline}</p>

                <ul className="mt-5 flex-1 space-y-2">
                  {report.includes.map((line) => (
                    <li key={line} className="flex items-start gap-2 text-[13.5px] text-white/65">
                      <CheckCircle2
                        className="mt-[3px] size-3.5 shrink-0 text-[#3cd278]"
                        aria-hidden
                      />
                      {line}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 flex items-center gap-1.5 text-[12.5px] text-white/50">
                  <Clock className="size-3.5" aria-hidden /> {report.turnaround}
                </p>

                <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[23px] font-black tabular-nums text-white">
                      {formatAed(report.priceAed)}
                    </p>
                    <p className="type-caption uppercase tracking-[0.08em] text-white/45">
                      One-time
                    </p>
                  </div>
                  <Link
                    href={`/get-report/${report.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#e1b923] px-5 text-[14px] font-black text-[#0a1733] transition group-hover:bg-[#f0cb3b]"
                  >
                    Request it
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="relative !bg-transparent border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
          <h2 className="text-[28px] font-black sm:text-[34px]">How it works</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {HOW.map((item) => (
              <li key={item.step} className="rounded-2xl border border-white/12 bg-white/[0.04] p-6">
                <span className="text-[13px] font-black tracking-[0.2em] text-[#f0cb3b]">
                  {item.step}
                </span>
                <h3 className="mt-3 text-[18px] font-black">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/65">{item.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-white/12 bg-white/[0.04] p-5">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#3cd278]" aria-hidden />
            <p className="text-[14px] leading-relaxed text-white/70">
              A report is an assessment, not an approval. No consultant can guarantee a visa —
              anyone who does is telling you what you want to hear. What we can do is show you the
              rules as they stand, where your profile sits against them, and what changes the answer.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
