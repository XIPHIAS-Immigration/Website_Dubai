"use client";

// src/components/Xia/XiaBand.tsx
// -----------------------------------------------------------------------------
// The XIA introduction, directly under the hero.
//
// It has one job: make a visitor who has scrolled past the hero understand, in
// about two seconds, that there is an assistant here that will tell them which
// routes they qualify for — and give them a single place to start typing.
//
// Typing here seeds the chat, so the first message is already theirs.
// -----------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Sparkles } from "lucide-react";

import ConciergeOrb from "./ConciergeOrb";
import { openXiaChat } from "./xia-chat";

const PROMPTS = [
  "I am a software engineer in Dubai, where can I get PR?",
  "We want a second passport for the family — what are the options?",
  "Golden visa or Portugal residency? Compare them for me.",
  "I have 500,000 USD to invest. What does that open up?",
];

const PROOF = ["17+ years", "39 awards", "6 offices", "4.8★ on Google"];

export default function XiaBand() {
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const promptIndex = useRef(0);
  const charIndex = useRef(0);

  // A typed placeholder, because a static one reads as a disabled field and an
  // empty one tells a first-time visitor nothing about what to ask.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaceholder(PROMPTS[0]);
      return;
    }
    let timer: number;
    let deleting = false;

    const tick = () => {
      const full = PROMPTS[promptIndex.current];
      charIndex.current += deleting ? -1 : 1;
      setPlaceholder(full.slice(0, charIndex.current));

      let delay = deleting ? 22 : 48;
      if (!deleting && charIndex.current === full.length) {
        delay = 2100;
        deleting = true;
      } else if (deleting && charIndex.current === 0) {
        deleting = false;
        promptIndex.current = (promptIndex.current + 1) % PROMPTS.length;
        delay = 420;
      }
      timer = window.setTimeout(tick, delay);
    };

    timer = window.setTimeout(tick, 700);
    return () => window.clearTimeout(timer);
  }, []);

  const start = () => openXiaChat(value.trim() || undefined);

  return (
    <section
      data-tone="dark"
      className="xia-type-system relative isolate overflow-hidden px-6 py-20 text-[#eef3fb] sm:px-12 sm:py-24 lg:px-20"
      style={{ background: "#0a1733" }}
    >
      <span aria-hidden className="xia-aurora xia-aurora--gold" />
      <span aria-hidden className="xia-aurora xia-aurora--sky" />
      <span aria-hidden className="xia-dots" />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <ConciergeOrb state="idle" size={132} />

        <h2 className="mt-5 text-[34px] font-black uppercase leading-none tracking-[0.04em] sm:text-[56px]">
          <span className="xia-sheen">XIA Intelligence</span>
        </h2>

        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-white/75 sm:text-[20px]">
          Your one-stop assistant for immigration. Tell it what you do and where you want to go — it
          checks your profile against every programme we track and comes back with the routes you
          actually qualify for.
        </p>

        {/* One input. Typing here becomes the first message in the chat. */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            start();
          }}
          className="mt-9 flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <label className="sr-only" htmlFor="xia-band-input">
            Tell XIA about yourself
          </label>
          <input
            id="xia-band-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder || "Ask XIA anything about your move"}
            className="min-h-[58px] w-full flex-1 rounded-xl border border-white/20 bg-white/[0.06] px-5 text-[15.5px] text-white placeholder:text-white/40 focus:border-[#e1b923]/60 focus:outline-none focus:ring-2 focus:ring-[#e1b923]/30"
          />
          <button
            type="submit"
            className="inline-flex min-h-[58px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#e1b923] px-7 text-[15px] font-black text-[#0a1733] shadow-[0_12px_30px_rgba(225,185,35,0.3)] transition hover:-translate-y-0.5 hover:bg-[#f0cb3b]"
          >
            <Sparkles className="size-4" aria-hidden /> Ask XIA
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/reports"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/[0.06] px-5 text-[14px] font-bold text-white transition hover:-translate-y-0.5 hover:border-white/55 hover:bg-white/[0.13]"
          >
            <FileText className="size-4" aria-hidden /> See the reports
          </Link>
          <Link
            href="/personal-booking#schedule"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#e1b923]/40 px-5 text-[14px] font-bold text-[#f0cb3b] transition hover:-translate-y-0.5 hover:border-[#e1b923] hover:bg-[#e1b923]/10"
          >
            Talk to an advisor
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {PROOF.map((item) => (
            <li key={item} className="type-caption uppercase tracking-[0.12em] text-white/45">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
