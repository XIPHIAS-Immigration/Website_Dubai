import Link from "next/link";
import { ArrowRight, CalendarCheck, Clock, FileText, MessageCircle } from "lucide-react";

import { DUBAI_CONTACT, firmFacts } from "@/data/credentials";
import { REPORT_BY_SLUG, formatAed } from "@/lib/reports/catalogue";
import type { Guide } from "@/data/guides";
import { getGuide } from "@/data/guides";

export default function GuideArticle({ guide }: { guide: Guide }) {
  const report = REPORT_BY_SLUG[guide.report];
  const related = guide.related
    .map((slug) => getGuide(slug))
    .filter((item): item is Guide => Boolean(item));

  return (
    <main className="xia-type-system">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden !bg-[#0a1733] text-white">
        <span aria-hidden className="xia-aurora xia-aurora--gold" />
        <span aria-hidden className="xia-dots" />
        <div className="relative mx-auto max-w-3xl px-5 pb-14 pt-20 sm:px-6 sm:pt-24">
          <p className="type-caption uppercase tracking-[0.16em] text-[#f0cb3b]">{guide.eyebrow}</p>
          <h1 className="mt-4 text-[32px] font-black leading-[1.08] sm:text-[42px]">{guide.h1}</h1>
          <p className="mt-5 text-[17px] leading-relaxed text-white/75 sm:text-[19px]">
            {guide.standfirst}
          </p>
          <p className="type-caption mt-7 flex flex-wrap items-center gap-x-4 gap-y-1 uppercase tracking-[0.1em] text-white/45">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" aria-hidden /> {guide.readingMinutes} min read
            </span>
            <span>Updated {guide.updated}</span>
          </p>
        </div>
      </section>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <section className="!bg-white dark:!bg-darkmode">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6">
          {/* On this page */}
          <nav aria-label="On this page" className="mb-12 rounded-xl border border-black/10 bg-black/[0.02] p-5 dark:border-white/15 dark:bg-white/[0.04]">
            <p className="type-caption uppercase tracking-[0.12em] text-ink/50 dark:text-white/50">
              On this page
            </p>
            <ol className="mt-3 space-y-1.5">
              {guide.sections.map((section, index) => (
                <li key={section.heading}>
                  <a
                    href={`#s${index + 1}`}
                    className="text-[14.5px] font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" className="text-[14.5px] font-semibold text-primary underline-offset-4 hover:underline">
                  Common questions
                </a>
              </li>
            </ol>
          </nav>

          {guide.sections.map((section, index) => (
            <div key={section.heading} id={`s${index + 1}`} className={index ? "mt-12 scroll-mt-24" : "scroll-mt-24"}>
              <h2 className="text-[23px] font-black leading-snug tracking-tight sm:text-[27px]">
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="type-body mt-4 text-ink/80 dark:text-white/75">
                  {paragraph}
                </p>
              ))}

              {section.table ? (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[440px] border-collapse text-left text-[14px]">
                    <caption className="pb-2 text-left text-[13.5px] font-bold text-ink/70 dark:text-white/70">
                      {section.table.caption}
                    </caption>
                    <tbody>
                      {section.table.rows.map(([label, value]) => (
                        <tr key={label} className="border-b border-black/10 dark:border-white/12">
                          <th scope="row" className="py-2.5 pr-5 align-top font-semibold">
                            {label}
                          </th>
                          <td className="py-2.5 align-top text-ink/70 dark:text-white/70">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {section.callout ? (
                <p className="mt-6 border-l-[3px] border-[#e1b923] bg-[#e1b923]/[0.07] py-3 pl-5 pr-4 text-[15.5px] font-semibold leading-relaxed">
                  {section.callout}
                </p>
              ) : null}
            </div>
          ))}

          {/* ── The report this question ends at ─────────────────────────── */}
          <div className="mt-14 overflow-hidden rounded-2xl border border-white/12 bg-[#0a1733] p-6 text-white sm:p-8">
            <p className="type-caption uppercase tracking-[0.14em] text-[#f0cb3b]">
              {report ? `${formatAed(report.priceAed)} · ${report.turnaround}` : "Written assessment"}
            </p>
            <h2 className="mt-3 text-[21px] font-black leading-snug sm:text-[25px]">
              {report ? report.title : "Get this answered for your own case"}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75">{guide.reportPitch}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/get-report/${guide.report}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#e1b923] px-6 text-[14.5px] font-black text-[#0a1733] transition hover:-translate-y-0.5 hover:bg-[#f0cb3b]"
              >
                <FileText className="size-4" aria-hidden /> Request the report
              </Link>
              <Link
                href="/personal-booking#schedule"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/30 px-5 text-[14.5px] font-bold text-white transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
              >
                <CalendarCheck className="size-4" aria-hidden /> Talk to an advisor
              </Link>
              <a
                href={DUBAI_CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#25D366] px-5 text-[14.5px] font-black text-white transition hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
              >
                <MessageCircle className="size-4" aria-hidden /> WhatsApp
              </a>
            </div>
          </div>

          {/* ── FAQ ──────────────────────────────────────────────────────── */}
          <div id="faq" className="mt-14 scroll-mt-24 border-t border-black/10 pt-10 dark:border-white/15">
            <h2 className="text-[23px] font-black tracking-tight sm:text-[27px]">Common questions</h2>
            <dl className="mt-6 space-y-6">
              {guide.faq.map((item) => (
                <div key={item.q}>
                  <dt className="text-[16px] font-bold">{item.q}</dt>
                  <dd className="type-small mt-2 text-ink/70 dark:text-white/70">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* ── Tools ────────────────────────────────────────────────────── */}
          {guide.tools.length ? (
            <div className="mt-12 border-t border-black/10 pt-8 dark:border-white/15">
              <h2 className="type-card-title">Work it out yourself</h2>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {guide.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-black/15 px-4 text-[14px] font-semibold transition hover:border-primary hover:text-primary dark:border-white/20"
                    >
                      {tool.label}
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* ── Related ──────────────────────────────────────────────────── */}
          {related.length ? (
            <div className="mt-12 border-t border-black/10 pt-8 dark:border-white/15">
              <h2 className="type-card-title">Read next</h2>
              <ul className="mt-4 space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/${item.slug}`}
                      className="text-[15px] font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {item.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="type-small mt-12 rounded-xl border border-black/10 bg-black/[0.02] p-4 text-ink/60 dark:border-white/15 dark:bg-white/[0.04] dark:text-white/60">
            {firmFacts.serviceBoundary}
          </p>
        </div>
      </section>
    </main>
  );
}
