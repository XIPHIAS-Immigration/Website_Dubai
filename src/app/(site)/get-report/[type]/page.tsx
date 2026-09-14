import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock, MessageCircle, Phone, ShieldCheck } from "lucide-react";

import ContactForm from "@/components/ContactForm";
import { REPORTS, REPORT_BY_SLUG, formatAed, isReportSlug } from "@/lib/reports/catalogue";

export const dynamicParams = false;

export function generateStaticParams() {
  return REPORTS.map((report) => ({ type: report.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  if (!isReportSlug(type)) return { title: "Report not found" };
  const report = REPORT_BY_SLUG[type];
  return {
    title: `${report.title} | XIPHIAS Immigration Dubai`,
    description: report.tagline,
    alternates: { canonical: `/get-report/${report.slug}` },
  };
}

export default async function GetReportPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!isReportSlug(type)) notFound();
  const report = REPORT_BY_SLUG[type];

  const others = REPORTS.filter((item) => item.slug !== report.slug).slice(0, 3);

  return (
    <main className="xia-type-system relative min-h-screen overflow-hidden bg-[#0a1733] text-white">
      <span aria-hidden className="xia-aurora xia-aurora--gold" />
      <span aria-hidden className="xia-aurora xia-aurora--sky" />
      <span aria-hidden className="xia-dots" />

      <section className="relative !bg-transparent">
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-6 sm:pt-24">
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 text-[13.5px] font-bold text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden /> All reports
          </Link>

          <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            {/* ── What you are getting ───────────────────────────────────── */}
            <div>
              <p className="type-caption uppercase tracking-[0.16em] text-[#f0cb3b]">
                {formatAed(report.priceAed)} · {report.turnaround}
              </p>
              <h1 className="mt-3 text-[34px] font-black leading-[1.08] sm:text-[44px]">
                {report.title}
              </h1>
              <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-white/75">
                {report.tagline}
              </p>

              <div className="mt-8 rounded-2xl border border-white/12 bg-white/[0.04] p-6">
                <h2 className="text-[17px] font-black">What is inside</h2>
                <ul className="mt-4 space-y-3">
                  {report.includes.map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-[14.5px] text-white/75">
                      <CheckCircle2
                        className="mt-[3px] size-4 shrink-0 text-[#3cd278]"
                        aria-hidden
                      />
                      {line}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-[13px] text-white/55">
                  <Clock className="size-4" aria-hidden /> Prepared and sent {report.turnaround.toLowerCase()}
                </p>
              </div>

              <p className="mt-5 text-[14px] leading-relaxed text-white/60">
                <span className="font-bold text-white/80">Best for:</span> {report.bestFor}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="tel:+971527275101"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/25 bg-white/[0.06] px-5 text-[14px] font-bold text-white transition hover:border-white/50 hover:bg-white/[0.12]"
                >
                  <Phone className="size-4" aria-hidden /> +971 52 727 5101
                </a>
                <a
                  href="https://wa.me/971527275101"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-[14px] font-black text-white transition hover:bg-[#1ebe5b]"
                >
                  <MessageCircle className="size-4" aria-hidden /> WhatsApp us
                </a>
              </div>
            </div>

            {/* ── The request form ───────────────────────────────────────── */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <ContactForm
                idPrefix={`report-${report.slug}`}
                variant="full"
                heading={`Request the ${report.title}`}
                subheading="An advisor confirms scope and payment with you before any work starts. No card details on this page."
                apiEndpoint="/api/enquiry"
                defaults={{
                  message: `I would like the ${report.title} (${formatAed(report.priceAed)}).`,
                }}
                className="max-w-none"
              />

              <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-relaxed text-white/50">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#3cd278]" aria-hidden />
                Your details go to a XIPHIAS advisor in Dubai and nowhere else. A report is a written
                assessment, not a visa approval or a guarantee of one.
              </p>
            </div>
          </div>

          {/* ── Other reports ─────────────────────────────────────────────── */}
          <div className="mt-16 border-t border-white/10 pt-10">
            <h2 className="text-[20px] font-black">Other reports</h2>
            <ul className="mt-5 grid gap-4 md:grid-cols-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/get-report/${item.slug}`}
                    className="flex h-full flex-col rounded-2xl border border-white/12 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-white/30"
                  >
                    <h3 className="text-[16px] font-black leading-snug">{item.title}</h3>
                    <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-white/65">
                      {item.tagline}
                    </p>
                    <p className="mt-3 text-[15px] font-black tabular-nums text-[#f0cb3b]">
                      {formatAed(item.priceAed)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
