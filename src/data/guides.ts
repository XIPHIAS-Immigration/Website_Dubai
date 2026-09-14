// src/data/guides.ts
// -----------------------------------------------------------------------------
// Long-tail guides for the UAE market, each written to answer one specific
// question honestly and end at the report that answers it for the reader.
//
// RULES, because the alternative is the same filler every competitor publishes:
//   * Every figure is either published by a government, or it is not stated.
//   * Where the honest answer is "it depends", say what it depends on rather
//     than hedging. Hedging is what makes these pages worthless.
//   * Nothing promises an outcome.
//   * Written for someone living in the Emirates — Gulf employment letters,
//     UAE attestation, AED costs, end-of-service timing. Not the India site's
//     content with the country name swapped, which would leave Google choosing
//     between two near-identical pages and showing whichever it prefers.
//
// Slugs sit at the root rather than under /blog, because these are reference
// pages people link to, not posts that age out of a feed.
// -----------------------------------------------------------------------------

import type { ReportSlug } from "@/lib/reports/catalogue";

export type GuideSection = {
  heading: string;
  body: string[];
  /** Optional pull-out: the one thing worth taking away from this section. */
  callout?: string;
  /** Optional simple table, rendered as rows of label + value. */
  table?: { caption: string; rows: Array<[string, string]> };
};

export type Guide = {
  slug: string;
  h1: string;
  title: string;
  description: string;
  eyebrow: string;
  standfirst: string;
  /** Queries this page is built to answer. Used for internal anchors, not stuffing. */
  intents: string[];
  updated: string;
  readingMinutes: number;
  sections: GuideSection[];
  faq: Array<{ q: string; a: string }>;
  /** Which report answers this question for the reader's own case. */
  report: ReportSlug;
  reportPitch: string;
  tools: Array<{ label: string; href: string }>;
  related: string[];
};

const UPDATED = "2026-09-14";

export const guides: Guide[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    slug: "canada-pr-with-uae-work-experience",
    h1: "Canada PR with UAE work experience",
    title: "Canada PR with UAE Work Experience (2026) | What Actually Counts",
    description:
      "Gulf experience counts for Canadian permanent residence — but only if your employment letters say what Canada needs them to say. Most UAE letters do not. Here is the fix.",
    eyebrow: "Canada · From the UAE",
    standfirst:
      "Your years in the Gulf are worth real points. Your UAE employment letter, as issued, probably will not prove them.",
    intents: [
      "canada pr with uae work experience",
      "does gulf experience count for canada pr",
      "uae employment letter canada immigration",
      "dubai work experience express entry",
    ],
    updated: UPDATED,
    readingMinutes: 9,
    sections: [
      {
        heading: "The good news, and then the problem",
        body: [
          "Canada does not care where you earned your skilled work experience. Foreign skilled experience is foreign skilled experience, and years accumulated in Dubai, Abu Dhabi or Sharjah count exactly as they would if earned anywhere else. Nothing in the points system discounts the Gulf.",
          "The problem is evidentiary, not legal. Canadian officers do not assess your job — they assess whether the duties described in your employment reference letters match the National Occupational Classification code you are claiming. And the standard UAE employment letter does not describe duties at all.",
          "A typical Gulf letter states your designation, your joining date, your last working day and your salary, on company letterhead, signed by HR. That is precisely the document you need for a visa renewal or a bank loan, and it is close to useless for an Express Entry application.",
        ],
        callout:
          "Canada assesses your duties, not your job title. A letter with a title and no duties proves almost nothing.",
      },
      {
        heading: "What the letter actually has to contain",
        body: [
          "Your job title, the period of employment with specific dates, and whether the role was full-time or the number of hours per week. Your annual salary and any benefits. And then the part that is always missing: your main duties and responsibilities, described in enough detail that an officer can map them to a NOC code.",
          "It must be on company letterhead, signed by someone with authority, and carry the company's contact details — address, telephone, email — because the officer may verify it.",
          "Where the role changed during your tenure, the letter should show the progression with dates, not just the final title. A promotion from Analyst to Senior Analyst two years in is material to the years you can claim at each level.",
        ],
        table: {
          caption: "The standard UAE letter versus what Canada needs",
          rows: [
            ["Designation", "Both have it"],
            ["Joining and last working date", "Both have it"],
            ["Salary", "Both have it"],
            ["Hours per week or full-time status", "Usually missing"],
            ["Detailed duties and responsibilities", "Almost always missing — the decisive omission"],
            ["Role progression with dates", "Usually missing"],
            ["Company contact details for verification", "Sometimes missing"],
            ["Signed by someone with authority", "Usually present"],
          ],
        },
      },
      {
        heading: "Ask while you still work there",
        body: [
          "This is the practical heart of it. Requesting a detailed duties letter from a UAE employer while you are employed there is an ordinary HR request. Requesting one eighteen months after you left, from a manager who has also left, through an HR team that has never met you, is a genuinely difficult exercise — and it is where Gulf-based applications stall for months.",
          "Ask now, even if you have not decided anything. A properly written reference letter costs you one conversation today and is worth an unbounded amount of time later. Keep a signed PDF and a scan of the original.",
          "If the company will not deviate from its template — which some large Gulf employers genuinely will not — the fallback is a letter from your direct manager on company letterhead, supported by your offer letter, salary certificates, labour contract, and payslips. It is a weaker evidentiary package but it is accepted where the primary letter is unobtainable, and it is far better assembled now than reconstructed later.",
        ],
      },
      {
        heading: "The documents only Gulf residents have to think about",
        body: [
          "Emirates ID and UAE residence visa history establish where you have lived, and time in the Emirates over the relevant threshold generally means a UAE police clearance certificate as well as one from your country of citizenship.",
          "Attestation and MOFA legalisation apply to UAE-issued documents in ways that catch people out on timing. Start those early; they are administratively simple and calendrically slow.",
          "Funds are their own exercise. Proof-of-settlement funds must be liquid, in your name, and shown with a documented history rather than appearing as a lump sum a week before you file. End-of-service gratuity is a legitimate source, but if it lands late it can leave you asserting funds you cannot yet evidence — which is worth planning around rather than discovering.",
        ],
        callout:
          "Your gratuity is real money and a real timing problem. Know when it pays out before you plan the filing date around it.",
      },
      {
        heading: "Where Gulf profiles are actually strong",
        body: [
          "Continuous full-time employment with documented salary is the norm here in a way it is not everywhere, and that is a genuinely strong evidentiary base once the duties are added.",
          "Many Gulf professionals also have multi-country experience — a few years at home, several in the Emirates — which increases the total claimable years, provided each employer is documented to the same standard. Do not let the older, harder-to-reach employer be the one you skip; it is often the one that pushes you into a higher band.",
          "And a spouse in employment here is a commonly missed source of points. A spousal language test and credential assessment is two bookings, and on a borderline profile it is frequently the cheapest points available.",
        ],
      },
    ],
    faq: [
      {
        q: "Does UAE work experience count for Canada PR?",
        a: "Yes. Foreign skilled work experience counts regardless of country, and the Gulf is not treated differently. What decides it is whether your employment reference letters describe duties matching the occupation code you claim — and standard UAE letters usually do not describe duties at all.",
      },
      {
        q: "What should my Dubai employment letter say?",
        a: "Job title, exact employment dates, full-time status or weekly hours, salary and benefits, and a detailed description of your main duties — on letterhead, signed by someone with authority, with company contact details for verification. The duties paragraph is the one that is always missing and always decisive.",
      },
      {
        q: "My UAE employer will not write a custom letter. What now?",
        a: "Use the standard letter plus a letter from your direct manager on company letterhead describing duties, and support both with your offer letter, labour contract, salary certificates and payslips. It is a weaker package than a single complete letter, and it is accepted — but assemble it while you are still there.",
      },
      {
        q: "Do I need a UAE police clearance certificate?",
        a: "Generally yes, where you have lived in the Emirates beyond the relevant threshold, in addition to one from your country of citizenship. Start it early alongside any attestation or MOFA legalisation, because these are simple steps on slow calendars.",
      },
    ],
    report: "docs_report",
    reportPitch:
      "Your occupation code confirmed against your actual duties, the exact wording your UAE employers need to produce, and every document sequenced before you start asking for it.",
    tools: [
      { label: "Check what you qualify for", href: "/xia-intelligence" },
      { label: "All the reports", href: "/reports" },
      { label: "Canada PR from Dubai", href: "/canada-pr-from-dubai" },
    ],
    related: ["canada-pr-from-dubai", "express-entry-from-uae", "australia-pr-from-dubai"],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    slug: "canada-pr-from-dubai",
    h1: "Canada PR from Dubai: the honest version",
    title: "Canada PR from Dubai (2026) | Routes, Timeline, Real Costs",
    description:
      "What Canadian permanent residence actually takes from the UAE — which route fits, where the time goes, what it costs in AED, and the Gulf-specific steps nobody warns you about.",
    eyebrow: "Canada · From the UAE",
    standfirst:
      "Most people in the Emirates are not choosing between Canada and staying. They are choosing between Canada and another five years of renewals.",
    intents: [
      "canada pr from dubai",
      "how to apply for canada pr from uae",
      "canada immigration from dubai process",
      "canada pr cost from dubai",
    ],
    updated: UPDATED,
    readingMinutes: 10,
    sections: [
      {
        heading: "Why this decision looks different from the Gulf",
        body: [
          "A UAE residence visa is tied to employment. It is renewed, not accumulated — fifteen years here does not become a right to stay, and it ends when the job does. That single fact is why so many long-term Gulf residents start looking at Canada in their thirties rather than their twenties.",
          "Canadian permanent residence is the opposite kind of status. It is not tied to an employer, it survives a job change, it leads to citizenship, and it extends to your spouse and children as principal beneficiaries rather than dependants of a work permit.",
          "So the comparison people actually make is not Dubai versus Toronto on salary. It is permanence versus renewal, and that is a different calculation — one where the tax-free salary you give up is weighed against a status nobody can revoke when a contract ends.",
        ],
        callout:
          "The Gulf pays better and promises nothing. That trade is the whole reason this page exists.",
      },
      {
        heading: "Which route actually fits",
        body: [
          "Express Entry is the main federal system, ranking candidates on a points score and inviting the highest. Most UAE-based professionals with a degree and several years of skilled experience enter here.",
          "Provincial Nominee Programmes run alongside it. A nomination adds a decisive number of points and effectively ends the competition, at the cost of a second application to the province and an intention to settle there. For a profile short on points, this is frequently the difference between a plan and a wait.",
          "Study and work permits are the routes people dismiss and sometimes should not. They are temporary status with conditions, but for someone whose points will not clear a draw in the next two years, arriving on a permit and transitioning is often faster in practice than waiting in the pool from Dubai.",
          "And family sponsorship, where a Canadian relative exists, runs on entirely different criteria and should be checked first because it bypasses the points question altogether.",
        ],
      },
      {
        heading: "Where the time actually goes",
        body: [
          "The processing standard after an invitation is measured in months. That clock starts late, and almost nobody quoting it mentions what comes first.",
          "Before it: an educational credential assessment, which waits on your university; a language test, and realistically a retake once you know the band you actually need; employment reference letters rewritten to describe duties rather than designations; and then an unbounded wait in the pool until a draw reaches your score.",
          "For a profile already clearing draws, roughly a year from decision to landing. For one that starts short, eighteen months to three years — and most of that is before anything is submitted. Anyone giving you a single confident total is guessing at the part that cannot be known.",
        ],
        table: {
          caption: "Sequence, and who controls each step",
          rows: [
            ["Language test, including one retake", "You — start here, it gates everything"],
            ["Educational credential assessment", "Your university — start immediately"],
            ["UAE employment letters with duties", "Your employer — ask while still employed"],
            ["UAE police clearance, attestation, MOFA", "Slow calendars, simple steps"],
            ["Proof of settlement funds", "Needs documented history, not a lump sum"],
            ["Express Entry pool wait", "Unbounded — depends on your score"],
            ["After the invitation", "IRCC service standard [VERIFY current standard]"],
          ],
        },
      },
      {
        heading: "What it costs from the UAE",
        body: [
          "Government fees for the application and right of permanent residence, per adult, plus biometrics. Medical examinations at a panel physician in the Emirates. Police clearances from the UAE and your country of citizenship. The credential assessment. The language test, more than once if you are honest with yourself.",
          "Then settlement funds, which are not a fee — you keep them — but must be liquid, documented and in your name, and are the largest number on the page.",
          "And professional fees if you engage anyone, which should be quoted separately from government charges in writing, because the two are paid to different parties. [VERIFY current IRCC fee schedule and settlement funds threshold before relying on any figure]",
        ],
      },
      {
        heading: "The Gulf-specific mistakes",
        body: [
          "Leaving the employment letters until after you resign. This is the big one, and it is covered in detail on its own page because it derails more Gulf applications than anything else.",
          "Timing the filing around an end-of-service gratuity that has not paid out, so that funds are asserted before they can be evidenced.",
          "Assuming a tax-free salary translates directly into a Canadian equivalent. It does not, and the arithmetic is worth doing properly before the decision, not after arrival.",
          "And starting the process during a notice period, which compresses the two slowest steps — employer letters and attestation — into the weeks you have least control over.",
        ],
        callout:
          "Start the language test and the credential assessment today. Everything else in this process waits on a score you do not have yet.",
      },
    ],
    faq: [
      {
        q: "Can I apply for Canada PR while living in Dubai?",
        a: "Yes. Permanent residence applications are made from outside Canada by design, and the entire process — assessment, testing, submission — can be completed from the Emirates. You do not need to visit Canada before approval.",
      },
      {
        q: "How long does Canada PR take from the UAE?",
        a: "For a profile already clearing draws, roughly a year from decision to landing. For one starting short on points, eighteen months to three years. Most of the elapsed time is before submission — credential assessment, language testing, employment letters — not IRCC processing.",
      },
      {
        q: "How much does Canada PR cost from Dubai?",
        a: "Government fees per adult plus biometrics, medicals, police clearances, credential assessment and language testing — and separately, settlement funds you must show but keep. Verify the current IRCC fee schedule and funds threshold directly, because both are revised.",
      },
      {
        q: "Is it worth leaving a tax-free salary for Canada?",
        a: "That depends on what you are buying. Canada pays less after tax for most Gulf professionals, and grants a status that is not tied to an employer, survives a job loss, extends fully to your family and leads to citizenship. Do the after-tax arithmetic honestly, then decide which of those matters more to you.",
      },
    ],
    report: "route_report",
    reportPitch:
      "Every route you clear today ranked, the gaps named specifically, and a realistic timeline with the pool wait estimated at your actual score.",
    tools: [
      { label: "Check what you qualify for", href: "/xia-intelligence" },
      { label: "All the reports", href: "/reports" },
      { label: "Get your UAE letters right", href: "/canada-pr-with-uae-work-experience" },
    ],
    related: ["canada-pr-with-uae-work-experience", "express-entry-from-uae", "australia-pr-from-dubai"],
  },
  /* ------------------------------------------------------------------ 3 */
  {
    slug: "express-entry-from-uae",
    h1: "Express Entry from the UAE, step by step",
    title: "Express Entry from UAE (2026) | The Process, in Order",
    description:
      "How Express Entry actually works for someone applying from the Emirates — the order of operations, what to start today, and the two steps that decide your timeline.",
    eyebrow: "Canada · Express Entry",
    standfirst:
      "Express Entry is not an application. It is a queue you join, and your score decides how long you stand in it.",
    intents: [
      "express entry from uae",
      "express entry profile dubai",
      "crs score uae applicant",
      "canada express entry process from abu dhabi",
    ],
    updated: UPDATED,
    readingMinutes: 9,
    sections: [
      {
        heading: "What Express Entry actually is",
        body: [
          "It is a ranking system, not an application. You create a profile, you are scored against everyone else in the pool, and periodically the highest-ranked candidates are invited to apply. The application itself comes after the invitation.",
          "That distinction matters enormously from the Gulf, because it means the honest question is never “am I eligible” — plenty of people are eligible and never invited. The question is what your score is, and what the draws have been clearing.",
          "Three programmes feed the pool, and the one most UAE professionals enter through is the federal skilled worker programme. Eligibility for it requires skilled work experience, a language result at or above the minimum, and settlement funds unless you have a valid Canadian job offer.",
        ],
        callout:
          "Eligible and invited are different words. Almost every disappointment in this system comes from confusing them.",
      },
      {
        heading: "The order to do things in",
        body: [
          "First, the language test. It is the largest recoverable variable in almost every profile, it gates your eligibility as well as your score, and it depends on nobody but you. Prepare for the top band before booking, not after.",
          "Second, the educational credential assessment, in parallel. It waits on a university registrar and is therefore the step with the least predictable duration.",
          "Third, employment reference letters describing duties rather than designations — which for Gulf employers is a specific exercise, and one to complete while you still work there.",
          "Only then create the profile. A profile built on a provisional score is not a plan; it is a placeholder that tells you nothing about your chances.",
        ],
      },
      {
        heading: "What moves a Gulf-based score",
        body: [
          "Language to the top band. It pays twice — once in core points, again through skill transferability — and it is the cheapest and fastest lever in the system.",
          "A provincial nomination, worth enough points to end the competition outright. For an over-represented occupation, this is frequently the only realistic route, and it is worth checking which provinces currently want your occupation before anything else is decided.",
          "Your spouse's language test and credential assessment. Routinely unclaimed, cheap to obtain, and often decisive on a borderline profile.",
          "And category-based draws, which rank you against a smaller group rather than the whole pool. Whether you sit inside a category depends on your occupation code and what your reference letters evidence — not your job title. [VERIFY current year categories]",
        ],
        table: {
          caption: "What to start, and when",
          rows: [
            ["Language test preparation", "Today — nothing else matters until you have a real score"],
            ["Educational credential assessment", "Today — longest unpredictable lead"],
            ["UAE employment letters with duties", "While still employed — not after resigning"],
            ["Provincial stream research", "Once your occupation code is settled"],
            ["Settlement funds with documented history", "Months ahead — not a lump sum before filing"],
            ["Create the Express Entry profile", "After the first three are in hand"],
          ],
        },
      },
      {
        heading: "After the invitation",
        body: [
          "You have a limited window to submit a complete application, and it is shorter than people expect. Everything not already gathered — police clearances, medicals, proof of funds, passport scans for every family member — becomes urgent at exactly the moment you have least room.",
          "Which is the argument for assembling the documents before you are invited rather than after. A police clearance obtained early costs nothing extra and removes the single most common source of panic in this process.",
          "Medicals are done with a panel physician, several of whom operate in the Emirates. Funds must be evidenced with statements showing history, not a balance that appeared last week.",
        ],
      },
    ],
    faq: [
      {
        q: "What CRS score do I need from the UAE?",
        a: "The same as everyone else — there is no separate cut-off by country of residence. What matters is where recent draws have cleared, which moves every round and differs sharply between general and category-based draws.",
      },
      {
        q: "Can I create an Express Entry profile before my language test?",
        a: "No — a valid language result is required to enter the pool, and it is the input that decides your score anyway. Test first.",
      },
      {
        q: "How long can I stay in the Express Entry pool?",
        a: "A profile is valid for twelve months and can be recreated. Sitting in the pool at a score that cannot clear a draw is not progress, though; the useful question is what would raise the score, not how long you may wait.",
      },
      {
        q: "Do I need a job offer in Canada?",
        a: "Not for the points — IRCC removed the arranged-employment points in 2025. A valid offer can remove the settlement-funds requirement and strengthens most provincial applications, but it no longer improves your rank in the pool.",
      },
    ],
    report: "route_report",
    reportPitch:
      "Your actual score, the draws it would have cleared, whether a category applies to your occupation code, and the fastest lever available to you.",
    tools: [
      { label: "Check what you qualify for", href: "/xia-intelligence" },
      { label: "Canada PR from Dubai", href: "/canada-pr-from-dubai" },
      { label: "All the reports", href: "/reports" },
    ],
    related: ["canada-pr-from-dubai", "canada-pr-with-uae-work-experience", "australia-pr-from-dubai"],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    slug: "australia-pr-from-dubai",
    h1: "Australia PR from Dubai",
    title: "Australia PR from Dubai (2026) | Assessment First, Points Second",
    description:
      "Australian skilled migration from the UAE — why the skills assessment decides everything, how the points actually accumulate, and whether 189 or 190 fits your profile.",
    eyebrow: "Australia · From the UAE",
    standfirst:
      "Everyone starts with the points calculator. The points calculator is the second step.",
    intents: [
      "australia pr from dubai",
      "australia immigration from uae",
      "skilled migration australia dubai",
      "australia pr points uae resident",
    ],
    updated: UPDATED,
    readingMinutes: 9,
    sections: [
      {
        heading: "The skills assessment comes first, and it decides everything",
        body: [
          "Australian skilled migration runs on occupations. Before points matter, an assessing authority for your occupation must assess your qualifications and experience and confirm you are suitable — and that determination governs which occupation code you may claim.",
          "That code then decides which visa subclasses are open to you and which states will consider nominating you. Without it, a points calculation is arithmetic about a hypothetical.",
          "Different occupations have different assessing authorities with different evidence requirements, and for some — engineering in particular — a degree outside the recognised accreditation accords means a longer competency-demonstration pathway. Start this first; it is the longest lead item and nothing downstream is real until it is settled.",
        ],
        callout:
          "Assess the occupation, then calculate the points. Doing it the other way round is how people spend money assessing an occupation no state wants.",
      },
      {
        heading: "Where the points come from for a Gulf professional",
        body: [
          "Age, and it is the one you cannot influence — the top band ends earlier than most applicants assume, which is an argument for starting sooner rather than waiting for a promotion.",
          "English at the superior band rather than the competent band. This is the largest recoverable gap in most profiles, and it is a retest, not a life change.",
          "Overseas skilled employment, accruing in bands by years — which for Gulf residents means the same employment-letter problem as Canada. Experience you cannot evidence in the terms your occupation expects does not count.",
          "Your partner's skills and English, which is worth points and is unclaimed constantly. And a state nomination, worth five points and, more importantly, a far smaller queue.",
        ],
        table: {
          caption: "The rows that usually decide it",
          rows: [
            ["Age band", "Highest in the late twenties, declining after [VERIFY current bands]"],
            ["English — superior vs competent", "The largest recoverable gap for most applicants"],
            ["Recognised qualification", "Set by the assessing authority's determination"],
            ["Overseas skilled employment", "Banded by years, evidence-dependent"],
            ["Partner skills and English", "Commonly unclaimed"],
            ["State nomination (subclass 190)", "Five points, and a much smaller pool"],
            ["Minimum to lodge an EOI", "65 — and nowhere near an invitation [VERIFY round scores]"],
          ],
        },
      },
      {
        heading: "189 or 190",
        body: [
          "Subclass 189 is independent: no sponsor, live anywhere in Australia, ranked against the national pool. Subclass 190 adds a state nomination, five points, and an indicated intention to settle in that state.",
          "Both are permanent residence from the day of grant, with identical work rights and the same citizenship pathway. Neither is a lesser visa, which is the most common misconception in this comparison.",
          "In practice you usually do not choose. A single Expression of Interest can cover both, and most well-run files take whichever invitation arrives first rather than betting on one queue.",
        ],
      },
      {
        heading: "What is different about applying from the Emirates",
        body: [
          "Employment evidence, again. Gulf letters state designation and dates; assessing authorities and the points test both need duties. Obtain the detailed letters while you are still employed.",
          "Document legalisation. UAE-issued documents may need attestation and MOFA steps, and these run on their own calendar regardless of how urgent your file is.",
          "And multi-country experience, which many Gulf professionals have and which usually helps — provided every employer, including the one you left eight years ago, is documented to the same standard.",
        ],
      },
    ],
    faq: [
      {
        q: "Can I apply for Australian PR from Dubai?",
        a: "Yes. Points-tested skilled visas are designed to be applied for from outside Australia, and the whole process runs from the Emirates. The skills assessment, English test and Expression of Interest are all completed remotely.",
      },
      {
        q: "How many points do I need for Australia PR?",
        a: "Sixty-five to lodge an Expression of Interest, which is not an invitation. Actual invitation scores are set per round and vary sharply by occupation — the meaningful figure is where recent rounds cleared for your assessed occupation.",
      },
      {
        q: "Does my Gulf work experience count for Australian points?",
        a: "Yes, overseas skilled employment accrues points in bands by years, provided the experience is in your assessed occupation and your reference letters describe duties matching it. The UAE letter problem is the same one Canadian applications face.",
      },
      {
        q: "Should I apply for 189 or 190?",
        a: "Usually both, through one Expression of Interest. Which invites you first depends on whether your occupation is oversubscribed nationally and whether any state currently wants it. For a common occupation, the state route is frequently faster.",
      },
    ],
    report: "compare_report",
    reportPitch:
      "Your occupation checked against the national and every current state list, points modelled for both subclasses, and Canada compared side by side if that is also on the table.",
    tools: [
      { label: "Check what you qualify for", href: "/xia-intelligence" },
      { label: "Canada PR from Dubai", href: "/canada-pr-from-dubai" },
      { label: "All the reports", href: "/reports" },
    ],
    related: ["canada-pr-from-dubai", "express-entry-from-uae", "canada-pr-with-uae-work-experience"],
  },
  /* ------------------------------------------------------------------ 5 */
  {
    slug: "second-passport-for-uae-residents",
    h1: "A second passport for UAE residents",
    title: "Second Passport for UAE Residents (2026) | What It Solves",
    description:
      "Why Gulf residents buy second citizenships, what the routes actually cost, and the questions to ask before wiring money — written for people whose status here is renewed, not owned.",
    eyebrow: "Second citizenship",
    standfirst:
      "A UAE residence visa is renewed. A citizenship is not. That single difference is the entire market.",
    intents: [
      "second passport for uae residents",
      "second citizenship dubai",
      "citizenship by investment uae residents",
      "buy second passport dubai",
    ],
    updated: UPDATED,
    readingMinutes: 10,
    sections: [
      {
        heading: "The problem a second passport actually solves",
        body: [
          "Expatriates in the Emirates hold a status that is genuinely excellent and genuinely conditional. It is renewed against employment, a property, or a qualifying category, and it does not accumulate into anything permanent. Decades here do not become a right to remain.",
          "For most people that is fine for most of their working life, and becomes uncomfortable at three specific moments: when children approach university and need a nationality that opens fee structures and visas, when a business needs a base that does not depend on a sponsor, and when retirement raises the question of where you will actually be allowed to live.",
          "A second citizenship answers the last question definitively. It is not revocable when a contract ends, it passes to your children, and it gives you somewhere you may live as of right rather than by permission.",
        ],
        callout:
          "Nobody buys a second passport because of travel. They buy it because status here ends with the job, and they would rather decide when.",
      },
      {
        heading: "The two shapes of route",
        body: [
          "Direct citizenship by investment. A handful of countries — principally in the Caribbean — grant citizenship in exchange for a qualifying investment or contribution, typically within months and generally without a residence requirement. You get a passport quickly and you do not have to move.",
          "Residency first, citizenship later. European programmes such as Portugal grant residence for an investment, with citizenship becoming possible after a period of legal residence and subject to language and other statutory conditions. Slower, considerably more valuable at the end, and dependent on rules holding for years.",
          "Which shape fits depends almost entirely on what you are solving for. If the answer is “somewhere to go if this ends”, the Caribbean does it faster and cheaper. If the answer is “a European future for the children”, the residency route is the one that gets there.",
        ],
        table: {
          caption: "Choosing between the two shapes",
          rows: [
            ["Time to a passport", "Caribbean: months · Europe: five years or more"],
            ["Residence required", "Caribbean: little or none · Portugal: very light, about a week a year"],
            ["Capital at risk", "Contribution: none returned · Fund: invested, and can lose value"],
            ["Right to live in Europe", "Caribbean: no · Portugal residence: yes"],
            ["Passes to children", "Both, subject to each country's rules"],
            ["Rule stability risk", "Both — Portugal has changed repeatedly since 2023"],
            ["Typical total cost", "[VERIFY current thresholds for each programme]"],
          ],
        },
      },
      {
        heading: "What it does not do",
        body: [
          "It does not give you the right to live and work in the European Union. Caribbean citizenship provides visa-free or visa-on-arrival travel to many countries, which is short-term travel, not residence rights. Any presentation implying otherwise is misrepresenting the product, and it is the single most common misrepresentation in this market.",
          "It does not resolve your tax position. Citizenship and tax residency are different concepts governed by different rules, and acquiring one does not change the other by itself. Anyone selling a passport as a tax solution is selling you a conclusion you should reach with a tax adviser, not a salesperson.",
          "And it does not sever obligations to your country of origin. Several nationalities do not permit dual citizenship at all, and acquiring another may forfeit the first — which is a question to settle definitively before any money moves.",
        ],
      },
      {
        heading: "The diligence that actually matters",
        body: [
          "Source of funds is examined seriously, by the programme and by its diligence contractors. Gulf-based wealth often has a documentation profile — multiple jurisdictions, business interests, property held across borders — that takes real assembly. Start it before you start anything else.",
          "Disclose everything to your own adviser, early. A prior visa refusal you mentioned upfront is a fact to be explained. The same refusal discovered by a diligence firm is a credibility problem, and credibility problems are what actually end these applications.",
          "Ask who pays your adviser. An adviser earning a commission from the fund or developer they are recommending has an interest that is not identical to yours. Ask directly; the answer tells you what the advice is worth.",
          "And check the programme's current standing. These have been under sustained international scrutiny, terms have tightened, and prices have risen under agreements between the governments involved. What was true two years ago is frequently not true now.",
        ],
        callout:
          "Ask your adviser who pays them. It is one question, it is not rude, and the answer reframes everything they have told you.",
      },
    ],
    faq: [
      {
        q: "Can UAE residents get a second passport?",
        a: "Yes — residence in the Emirates neither helps nor hinders. What matters is whether your country of origin permits dual citizenship, and whether your source of funds can be documented to the standard the programme requires.",
      },
      {
        q: "Does a second passport let me live in Europe?",
        a: "Caribbean citizenship does not. It provides visa-free or visa-on-arrival travel to many countries, which is short-term travel rather than residence or work rights. A European residency programme does grant the right to reside, which is a different product with a different timeline and price.",
      },
      {
        q: "Will a second citizenship change my tax position?",
        a: "Not by itself. Citizenship and tax residency are governed by different rules, and where you are tax resident is generally determined by where you actually live and other statutory tests. Take tax advice separately from immigration advice, from someone not being paid on the transaction.",
      },
      {
        q: "How fast can I get one?",
        a: "Caribbean programmes have historically been measured in months, subject to diligence and current processing. European residency-first routes take years to reach citizenship eligibility. Any quoted timeline should be checked against the programme's current published position rather than a brochure.",
      },
    ],
    report: "due_diligence_report",
    reportPitch:
      "Which programmes your profile and capital clear comfortably, what each really costs once the fees below the headline are added, and the disclosure issues to raise before a diligence firm finds them.",
    tools: [
      { label: "Check what you qualify for", href: "/xia-intelligence" },
      { label: "All the reports", href: "/reports" },
      { label: "Check any consultant's licence", href: "/verify-immigration-consultant" },
    ],
    related: ["caribbean-citizenship-from-uae", "portugal-golden-visa-from-dubai", "canada-pr-from-dubai"],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    slug: "portugal-golden-visa-from-dubai",
    h1: "Portugal Golden Visa from Dubai, after the rules changed",
    title: "Portugal Golden Visa from Dubai (2026) | What Survived 2023",
    description:
      "Portugal removed the property route in 2023. What remains for a Dubai-based investor, how little time you must spend there, and the fund questions to ask before committing.",
    eyebrow: "Portugal · Residency by investment",
    standfirst:
      "The route everybody in this market still quotes no longer exists. What replaced it needs much better diligence.",
    intents: [
      "portugal golden visa from dubai",
      "portugal golden visa uae residents",
      "portugal residency by investment dubai",
      "portugal golden visa 2026 rules",
    ],
    updated: UPDATED,
    readingMinutes: 9,
    sections: [
      {
        heading: "What changed, and why old advice is dangerous here",
        body: [
          "Portugal's 2023 housing legislation removed residential real-estate acquisition as a qualifying investment, along with the pure capital-transfer option. That was the route the overwhelming majority of applicants used and the one nearly every brochure in this market still describes.",
          "The programme was not abolished. Qualifying routes continue — centred on investment funds, scientific research, cultural production, job creation and business capitalisation — each with its own threshold and conditions.",
          "So if somebody in Dubai offers you Portuguese residency through buying an apartment, they have not read the law since 2023. Treat that as a competence test and stop there.",
        ],
        callout:
          "Property no longer qualifies. Anyone still selling it is telling you what worked three years ago.",
      },
      {
        heading: "What remains, and what to verify",
        body: [
          "The investment-fund route is the main path in practice — a subscription into a qualifying Portuguese fund, held for a minimum period, with the fund subject to regulatory conditions including limits on real-estate exposure.",
          "Alongside it sit research funding, support for artistic or cultural output, direct job creation, and capitalising a Portuguese company while creating positions. These are genuinely used but suit narrower circumstances.",
          "Thresholds and conditions have been revised more than once and are the part of this page most likely to be stale by the time you read it. [VERIFY current qualifying routes, minimum amounts and holding periods against the Portuguese authority before relying on any figure]",
        ],
        table: {
          caption: "What to establish before committing",
          rows: [
            ["Qualifying routes currently open", "[VERIFY — changed repeatedly since 2023]"],
            ["Minimum investment per route", "[VERIFY]"],
            ["Minimum holding period", "[VERIFY]"],
            ["Physical presence required", "Very light — an average of about seven days a year"],
            ["Years to citizenship eligibility", "Five, subject to language and other conditions [VERIFY counting start]"],
            ["Family included", "Spouse, dependent children, dependent parents"],
            ["Right to reside in the EU", "Yes, unlike a Caribbean passport"],
          ],
        },
      },
      {
        heading: "Why it still suits a Dubai-based investor",
        body: [
          "The presence requirement remains among the lightest in Europe. For someone running a business from the Emirates who does not intend to relocate, an average of roughly a week a year is the entire proposition.",
          "It carries Schengen mobility, family members are included on the same application rather than as separate cases, and it leads to a citizenship pathway on a timescale short by European standards — subject to meeting the statutory conditions at that point.",
          "Moving capital from the UAE is also considerably simpler than from many other jurisdictions, which removes a step that complicates these applications elsewhere. The compliance question is not whether you may move the money, but whether you can evidence where it came from.",
        ],
      },
      {
        heading: "The fund diligence nobody does properly",
        body: [
          "The old property route failed safely in one respect: you owned an identifiable apartment. A fund subscription does not work that way. Your capital sits in an instrument whose value depends on management you have not met, in a market you cannot observe from Dubai.",
          "So ask: who manages this fund, and what is their record outside this programme? What does it actually hold? What are the fees, in total, over the holding period? What happens if you need to exit early? What has it returned to investors who were not immigration clients?",
          "And separately — who is advising you, and are they paid by you or by the fund? This is the question that most changes the quality of what you have been told, and almost nobody asks it.",
        ],
        callout:
          "You are making an investment decision that carries residency, not a residency decision that involves money. Diligence it as an investment.",
      },
    ],
    faq: [
      {
        q: "Can I still get a Portugal Golden Visa by buying property?",
        a: "No. Residential real-estate acquisition was removed as a qualifying investment by Portugal's 2023 housing legislation, along with the pure capital-transfer option. Anyone in this market still offering a property pathway is working from outdated material.",
      },
      {
        q: "How long do I need to stay in Portugal each year?",
        a: "The presence requirement is deliberately light — an average of roughly seven days a year across the residence period — which is why it suits people who intend to remain based in the Gulf.",
      },
      {
        q: "How much do I need to invest now?",
        a: "It depends which remaining route you use, and thresholds have been revised more than once since the reform. Verify the current figure against the Portuguese authority's own published requirements rather than any brochure, including this page.",
      },
      {
        q: "Does it lead to an EU passport?",
        a: "It leads to eligibility to apply for citizenship after five years of legal residence, subject to language and other statutory conditions being met at that time. Eligibility is not a grant, and the conditions have been politically debated — so the residency should be worth having on its own terms.",
      },
    ],
    report: "due_diligence_report",
    reportPitch:
      "The route that fits your capital, the fund questions to put in writing before you commit, and an honest read on what the rule changes since 2023 mean for your timeline.",
    tools: [
      { label: "Compare investment routes", href: "/xia-intelligence" },
      { label: "All the reports", href: "/reports" },
      { label: "Check any consultant's licence", href: "/verify-immigration-consultant" },
    ],
    related: ["second-passport-for-uae-residents", "caribbean-citizenship-from-uae", "canada-pr-from-dubai"],
  },

  /* ------------------------------------------------------------------ 7 */
  {
    slug: "caribbean-citizenship-from-uae",
    h1: "Caribbean citizenship from the UAE: the real cost",
    title: "Caribbean Citizenship from UAE (2026) | Every Fee, Itemised",
    description:
      "The headline contribution is roughly half the bill. Every line itemised for a Gulf-based family, plus what the 2024 price-floor agreement changed.",
    eyebrow: "Caribbean · Citizenship by investment",
    standfirst:
      "Nobody shows you the second half of the invoice until you have committed to the first.",
    intents: [
      "caribbean citizenship from uae",
      "st kitts citizenship dubai cost",
      "caribbean passport uae residents",
      "citizenship by investment cost dubai",
    ],
    updated: UPDATED,
    readingMinutes: 9,
    sections: [
      {
        heading: "Five programmes, one recent agreement",
        body: [
          "Five Eastern Caribbean states run citizenship-by-investment programmes: Antigua and Barbuda, Dominica, Grenada, St Kitts and Nevis, and St Lucia. Each offers a non-refundable contribution to a national fund, and most an approved real-estate route as an alternative.",
          "In 2024 the five agreed common principles including a minimum price floor, under sustained pressure from the United States and the European Union over due-diligence standards. That ended the undercutting that had driven prices down for years.",
          "So a figure quoted to you two years ago is not available today, and the gap between programmes is narrower than it was. [VERIFY current minimum contribution per programme before relying on any number]",
        ],
        callout:
          "Price is no longer the differentiator it was. Processing discipline and diligence reputation are.",
      },
      {
        heading: "The lines that are not in the brochure",
        body: [
          "The contribution is the headline. Underneath it: due-diligence fees per applicant above an age threshold — non-refundable, and charged whether or not you are approved. Government processing fees, per applicant. Passport issuance. Certificate of naturalisation.",
          "Then the professional layer: an authorised local agent, which most programmes require and which cannot be bypassed, plus your own advisers.",
          "And the document layer, which for Gulf residents means police clearances from the UAE and from your country of citizenship, attestation and MOFA legalisation of UAE-issued documents, notarisation and translation. Simple steps, slow calendars, and routinely left to the end.",
        ],
        table: {
          caption: "Every line to budget for, family of four",
          rows: [
            ["National fund contribution", "The headline figure [VERIFY current floor]"],
            ["Due diligence, per applicant over the age threshold", "Non-refundable regardless of outcome [VERIFY]"],
            ["Government processing fees", "Per applicant [VERIFY]"],
            ["Passport and naturalisation certificate", "Per applicant [VERIFY]"],
            ["Authorised local agent", "Mandatory in most programmes"],
            ["UAE police clearance, attestation, MOFA", "Slow, and always started too late"],
            ["Real-estate route instead of contribution", "Higher headline, plus holding period and resale risk"],
          ],
        },
      },
      {
        heading: "Contribution or real estate",
        body: [
          "The contribution is money you never see again, and that is its virtue: the cost is knowable on day one and the file is simpler.",
          "The real-estate route carries a higher headline, a mandatory holding period, and an exit that depends on finding a buyer in a small market where almost every buyer is another applicant doing exactly what you did. The resale discount is real and rarely discussed at the point of sale.",
          "For most Gulf-based families the contribution is the honest choice unless there is a specific reason to want the asset. Treat an adviser pushing real estate hard as someone who may be earning from the developer — and ask them directly whether they are.",
        ],
      },
      {
        heading: "What actually gets people refused",
        body: [
          "These programmes decline applicants, and a refusal costs the due-diligence fees with nothing to show for them. The causes are not exotic: an undisclosed prior visa refusal, a source of funds that cannot be traced to a lawful origin with documents, an undeclared business interest, or a discrepancy between what was declared and what the diligence firm found.",
          "Gulf-based wealth frequently spans jurisdictions, which is not a problem in itself and is a documentation exercise. Start assembling it before you choose a programme, not after you have paid a deposit.",
          "And check the programme's current standing at the moment you apply. These have been under international scrutiny and terms have shifted; that is a live variable, not history.",
        ],
      },
    ],
    faq: [
      {
        q: "What does Caribbean citizenship cost from the UAE?",
        a: "The contribution is the headline, and the real total adds due-diligence fees per applicant, government processing fees, passport and naturalisation fees, a mandatory authorised agent, and UAE document costs including attestation and MOFA legalisation. Verify current figures directly — they rose under the 2024 agreement between the five governments.",
      },
      {
        q: "Which Caribbean programme is cheapest?",
        a: "Less varied than it used to be. The five agreed a common minimum price floor in 2024 under international pressure, which ended price competition between them. Weigh processing reliability and diligence reputation at least as heavily as price.",
      },
      {
        q: "Do I need to visit the country?",
        a: "Most of these programmes have historically not required residence, and some had no visit requirement at all — but interview and presence requirements are among the things tightened under international pressure. Confirm the current requirement for your chosen programme rather than assuming.",
      },
      {
        q: "Does it let me live in Europe?",
        a: "No. It has provided visa-free or visa-on-arrival travel to many countries, which is short-term travel, not residence or work rights. Anyone presenting it as a route to living in Europe is misrepresenting it.",
      },
    ],
    report: "due_diligence_report",
    reportPitch:
      "Every line itemised for your family size, the programmes your profile clears comfortably, and the disclosure issues to raise before a diligence firm finds them.",
    tools: [
      { label: "Compare citizenship routes", href: "/xia-intelligence" },
      { label: "All the reports", href: "/reports" },
      { label: "Check any consultant's licence", href: "/verify-immigration-consultant" },
    ],
    related: ["second-passport-for-uae-residents", "portugal-golden-visa-from-dubai", "canada-pr-from-dubai"],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug) ?? null;
}
