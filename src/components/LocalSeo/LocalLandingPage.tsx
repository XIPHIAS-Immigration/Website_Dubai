import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, Phone, ShieldCheck } from "lucide-react";

import { DUBAI_CONTACT, credentials, firmFacts } from "@/data/credentials";
import { getLocalLanding, type LocalLanding } from "@/data/local-seo";

const PROOF = [
  { value: "17+", label: "Years advising" },
  { value: "35", label: "Jurisdictions" },
  { value: "39", label: "Awards" },
  { value: "4.8★", label: "Google rating" },
];

export default function LocalLandingPage({ landing }: { landing: LocalLanding }) {
  const related = landing.related
    .map((slug) => getLocalLanding(slug))
    .filter((item): item is LocalLanding => Boolean(item));

  return (
    <main className="xia-type-system">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden !bg-[#0a1733] text-white">
        <span aria-hidden className="xia-aurora xia-aurora--gold" />
        <span aria-hidden className="xia-dots" />

        <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-20 sm:px-6 sm:pt-28">
          <p className="type-caption uppercase tracking-[0.16em] text-[#f0cb3b]">
            {landing.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-[34px] font-black leading-[1.07] sm:text-[46px]">
            {landing.h1}
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/75 sm:text-[19px]">
            {landing.standfirst}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/xia-intelligence"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#e1b923] px-7 text-[15px] font-black text-[#0a1733] shadow-[0_12px_30px_rgba(225,185,35,0.3)] transition hover:-translate-y-0.5 hover:bg-[#f0cb3b]"
            >
              Check what you qualify for
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a
              href={DUBAI_CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-[15px] font-black text-white transition hover:-translate-y-0.5 hover:bg-[#1ebe5b]"
            >
              <MessageCircle className="size-4" aria-hidden /> WhatsApp us
            </a>
            <a
              href={`tel:${DUBAI_CONTACT.phone}`}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/[0.07] px-6 text-[15px] font-bold text-white transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/[0.14]"
            >
              <Phone className="size-4" aria-hidden /> {DUBAI_CONTACT.phoneDisplay}
            </a>
          </div>

          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PROOF.map((item) => (
              <li
                key={item.label}
                className="rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-4 text-center"
              >
                <p className="text-[24px] font-black tabular-nums text-[#f0cb3b]">{item.value}</p>
                <p className="type-caption mt-1 uppercase tracking-[0.1em] text-white/55">
                  {item.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── The licences, linked to the regulators' own registers ───────── */}
      <section className="!bg-[#0d1f3f] text-white">
        <div className="mx-auto max-w-5xl px-5 py-9 sm:px-6">
          <p className="type-caption uppercase tracking-[0.14em] text-white/45">
            Checkable on the regulator&apos;s own register
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {credentials.map((credential) => (
              <li
                key={credential.id}
                className="rounded-xl border border-[#e1b923]/25 bg-[#e1b923]/[0.06] p-4"
              >
                <p className="text-[15px] font-black text-[#f0cb3b]">{credential.label}</p>
                <p className="mt-1 text-[13px] leading-snug text-white/65">
                  {credential.authorityShort} · {credential.country}
                </p>
                <a
                  href={credential.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-bold text-white/80 underline-offset-4 hover:text-white hover:underline"
                >
                  Check it yourself <ArrowRight className="size-3" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <section className="!bg-white dark:!bg-darkmode">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-6">
          {landing.sections.map((section, index) => (
            <div key={section.heading} className={index ? "mt-12" : ""}>
              <h2 className="text-[23px] font-black leading-snug tracking-tight sm:text-[27px]">
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="type-body mt-4 text-ink/80 dark:text-white/75">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}

          {/* FAQ — also emitted as FAQPage schema by the route */}
          <div className="mt-14 border-t border-black/10 pt-10 dark:border-white/15" id="faq">
            <h2 className="text-[23px] font-black tracking-tight sm:text-[27px]">
              Common questions
            </h2>
            <dl className="mt-6 space-y-6">
              {landing.faq.map((item) => (
                <div key={item.q}>
                  <dt className="text-[16px] font-bold">{item.q}</dt>
                  <dd className="type-small mt-2 text-ink/70 dark:text-white/70">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="type-small mt-10 flex items-start gap-2 rounded-xl border border-black/10 bg-black/[0.02] p-4 text-ink/60 dark:border-white/15 dark:bg-white/[0.04] dark:text-white/60">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#1a7f5a]" aria-hidden />
            {firmFacts.serviceBoundary}
          </p>

          {related.length ? (
            <div className="mt-12 border-t border-black/10 pt-8 dark:border-white/15">
              <h2 className="type-card-title">Related</h2>
              <ul className="mt-4 space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/${item.slug}`}
                      className="inline-flex items-start gap-2 text-[15px] font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      <CheckCircle2 className="mt-1 size-4 shrink-0" aria-hidden />
                      {item.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
