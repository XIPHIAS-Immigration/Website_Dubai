// src/data/local-seo.ts
// -----------------------------------------------------------------------------
// UAE service and location landing pages.
//
// These target the terms a person in the Emirates actually types. The modifier
// that matters here is "from Dubai" / "in the UAE" — the head terms without it
// are held by agencies with a decade of domain age, and the modified versions
// are barely contested.
//
// Rules, so these do not read like the pages they are competing with:
//   * No superlative that cannot be evidenced. "Best in Dubai" is a claim; a
//     licence number on a public register is a fact.
//   * Nothing promises an outcome.
//   * Where the honest answer is "it depends", say what it depends on.
// -----------------------------------------------------------------------------

export type LocalSection = { heading: string; body: string[] };

export type LocalLanding = {
  slug: string;
  /** Page <h1>. Carries the target phrase without reading like a keyword string. */
  h1: string;
  title: string;
  description: string;
  eyebrow: string;
  /** The single sentence under the h1. */
  standfirst: string;
  /** Terms this page is built to answer. Used for internal anchors, not stuffing. */
  intents: string[];
  sections: LocalSection[];
  faq: Array<{ q: string; a: string }>;
  related: string[];
};

const VERIFY_NOTE =
  "Every licence claim on this page links to the regulator's own public register, so you can check it yourself rather than take our word for it.";

export const localLandings: LocalLanding[] = [
  {
    slug: "canada-immigration-consultants-in-dubai",
    h1: "Canada immigration consultants in Dubai",
    title: "Canada Immigration Consultants in Dubai | CICC Licence R516194",
    description:
      "Canadian permanent residence handled from Dubai under CICC licence R516194 — the number is on the College's public register, and you can check it before you pay anyone.",
    eyebrow: "Dubai · Canada practice",
    standfirst:
      "Canada licenses the people permitted to represent you, and publishes the list. Almost nobody in this market shows you their entry.",
    intents: [
      "canada immigration consultants in dubai",
      "canada pr consultants dubai",
      "licensed canadian immigration consultant uae",
      "rcic in dubai",
    ],
    sections: [
      {
        heading: "Why the licence matters more here than anywhere",
        body: [
          "Dubai has an unusually large number of immigration offices and an unusually large number of articles titled “Top 10 immigration consultants in Dubai”. Both exist for the same reason: this is a market where people have been taken advantage of, and everyone knows it.",
          "For Canada specifically there is an objective test. The College of Immigration and Citizenship Consultants licenses individuals who may legally give Canadian immigration advice for a fee, and publishes every one of them on a searchable register. Canadian lawyers and Quebec notaries are the only other people permitted to do it.",
          "So before engaging anyone in this city for a Canadian file, ask for the licence number of the individual who will handle it, and search that number on the College's own website while you are still in the room. A firm that cannot give you a number to search is not licensed by the Canadian regulator, whatever its office looks like.",
          VERIFY_NOTE,
        ],
      },
      {
        heading: "What we handle for UAE residents",
        body: [
          "Express Entry, including the federal skilled worker and trades programmes, and the provincial nominee streams that sit alongside it. Family sponsorship where a Canadian relative is involved. Study and work permits where those are the faster route to the ground.",
          "Assessment comes before advice. Age, education, language results, funds, family and any previous refusal are scored against the published criteria before a single programme is recommended. Where nothing currently fits, we say so and explain what would have to change to make it fit.",
          "Gulf work experience is assessed the way Canadian rules assess it, which is not always the way applicants expect. That is worth getting right before anything is filed, because it determines both your score and which occupation code your reference letters need to evidence.",
        ],
      },
      {
        heading: "Working with us from the Emirates",
        body: [
          "Consultations run online or at the Dubai office, and the written summary is identical either way. Documents are exchanged digitally; originals are only ever needed at specific, named steps.",
          "Fees are quoted in writing before work begins, with government charges listed separately from professional fees, because the two are paid to different parties and only one of them is ours.",
        ],
      },
    ],
    faq: [
      {
        q: "Can a consultant in Dubai legally handle a Canadian immigration file?",
        a: "Yes, provided the individual advising you is licensed by the College of Immigration and Citizenship Consultants, a Canadian lawyer, or a Quebec notary. The regulator licenses people rather than places, so where they sit is irrelevant — whether their number appears on the register is not.",
      },
      {
        q: "How do I check a Canada immigration consultant in Dubai is genuine?",
        a: "Ask for the College ID of the person who will handle your file and search it on the College's public register. Read two columns: Status, and Entitled to Practise. Only an active status with Entitled to Practise showing Yes means that person may legally advise you for a fee.",
      },
      {
        q: "Does my UAE work experience count for Canadian permanent residence?",
        a: "Foreign skilled work experience counts, and Gulf experience is treated the same as any other foreign experience. What decides it is whether your employment reference letters describe duties matching the occupation code you are claiming — a UAE title on a letter with no duty description is the most common reason experience is not credited.",
      },
      {
        q: "Do I need to be in Canada to apply?",
        a: "No. Permanent residence applications are made from outside Canada and are designed to be, which is why the whole process can be run from the Emirates.",
      },
    ],
    related: ["verify-immigration-consultant", "canada-pr-consultants-abu-dhabi", "corporate-immigration-services-uae"],
  },

  {
    slug: "canada-pr-consultants-abu-dhabi",
    h1: "Canada PR consultants for Abu Dhabi residents",
    title: "Canada PR Consultants, Abu Dhabi | Licence R516194, Checkable",
    description:
      "Canadian permanent residence for Abu Dhabi residents, handled under CICC licence R516194. Online throughout, with the licence on the College's public register.",
    eyebrow: "Abu Dhabi · Canada practice",
    standfirst:
      "Nothing about a Canadian application requires you to be in the same city as your consultant. It does require them to be licensed.",
    intents: [
      "canada pr consultants abu dhabi",
      "canada immigration consultants abu dhabi",
      "express entry abu dhabi",
      "canadian immigration abu dhabi uae",
    ],
    sections: [
      {
        heading: "Abu Dhabi has fewer offices, which cuts both ways",
        body: [
          "There are materially fewer immigration consultancies in Abu Dhabi than in Dubai, and residents often assume that means travelling to Dubai or accepting whoever is nearest. Neither is necessary.",
          "A Canadian permanent residence application is a documentary process. Nothing in it requires physical attendance with your representative — not the assessment, not the language test, not the submission. What it requires is that the person advising you for a fee is licensed by the Canadian regulator, and that is a question about a register, not a postcode.",
        ],
      },
      {
        heading: "What the process looks like from Abu Dhabi",
        body: [
          "An eligibility assessment against the published criteria, online, scoring your profile as it stands today. Then, if something fits, a written plan naming the route, the gaps, the sequence and the cost.",
          "Educational credential assessment and language testing are booked by you and run on their own timelines; both are available in the Emirates. Employment reference letters are the step most likely to need work, because Gulf employers routinely issue letters stating designation and dates and nothing else, and Canadian officers need duties.",
          "Everything after that is documentary, and everything is exchanged digitally. The Dubai office is available if you would rather hand over originals in person, but it is not a requirement at any stage.",
        ],
      },
      {
        heading: "The one thing worth doing before anything else",
        body: [
          "Book the language test, and prepare for the top band rather than the band you assume you will get. Language is the largest recoverable gap in almost every Gulf-based profile we assess, and the difference between a middle and a top band is frequently the difference between an unbounded wait and an invitation.",
          "It is also the only major step that depends on nobody but you. The credential assessment waits on a university, the references wait on employers, the draws wait on Canada. The test waits on a booking.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I have to travel to Dubai to apply for Canada PR?",
        a: "No. The entire process can be run online from Abu Dhabi, and the substance of the advice is identical. The Dubai office exists for people who would rather hand over documents in person.",
      },
      {
        q: "How long does Canada PR take from the UAE?",
        a: "The processing standard after an invitation is measured in months, but that clock starts late. Most of the elapsed time goes into the credential assessment, language testing, employment references and then waiting in the pool for a draw that reaches your score. Anyone quoting a single confident total is guessing at the part that cannot be known in advance.",
      },
      {
        q: "Is my Abu Dhabi employment letter enough for Canadian immigration?",
        a: "Usually not as issued. Gulf letters commonly state designation, dates and salary without describing duties, and Canadian officers assess whether your duties match the occupation code you are claiming. Getting the letter reissued with duty detail is far easier while you are still employed there.",
      },
      {
        q: "Can my spouse's qualifications help?",
        a: "Yes, and this is one of the most commonly unclaimed sources of points in the whole system. A spouse's language test and credential assessment can add materially to a borderline score, and two test bookings is a cheap way to find out.",
      },
    ],
    related: ["canada-immigration-consultants-in-dubai", "verify-immigration-consultant", "corporate-immigration-services-uae"],
  },

  {
    slug: "verify-immigration-consultant",
    h1: "How to verify an immigration consultant in the UAE",
    title: "Verify an Immigration Consultant in Dubai | The Five-Minute Check",
    description:
      "How to check any immigration consultant in the UAE against the regulator's own register in under five minutes — and where XIPHIAS's own licences can be checked.",
    eyebrow: "Verification guide",
    standfirst:
      "Anyone can print a certificate. Only a regulator can publish a register. Here is how to use one.",
    intents: [
      "verify immigration consultant dubai",
      "how to check immigration consultant is genuine uae",
      "immigration fraud dubai how to check",
      "is my immigration consultant registered",
    ],
    sections: [
      {
        heading: "The five-minute check",
        body: [
          "Ask the firm for the licence number of the individual who will handle your file, then search it on the destination regulator's own website. Not a screenshot, not a PDF certificate, not a logo on a homepage — the regulator's live register.",
          "For Canada that is the College of Immigration and Citizenship Consultants. Search by College ID and read two columns: Status, and Entitled to Practise. Only an active status together with Entitled to Practise showing Yes means the person may legally advise you for a fee.",
          "For Australia it is the Office of the Migration Agents Registration Authority. Search the MARN and check the agent appears with a current registration and the business name you were given.",
          "There is no equivalent UAE register for outbound immigration advice, which is precisely why the destination country's register is the one that matters. A UAE trade licence confirms a company exists. It says nothing about whether anyone there may lawfully advise you on a Canadian file.",
        ],
      },
      {
        heading: "What the register will not tell you",
        body: [
          "A register confirms a person is licensed. It does not confirm the advice you were given is sound, that the fee is reasonable, or that the firm will still be answering the phone in eighteen months.",
          "So ask additionally for a written service agreement, a fee schedule that separates government charges from professional fees, a refund position stated in writing, and the name of the person who will actually handle the file rather than the person selling it to you.",
          "Be wary of anyone who guarantees an outcome. No consultant anywhere can guarantee a visa — the decision belongs to the destination country's immigration authority, and promising otherwise is itself a breach of the Canadian regulator's conduct rules.",
        ],
      },
      {
        heading: "Warning signs that are specific to this market",
        body: [
          "A quoted “processing time” for permanent residence that sounds like a visa run. Permanent residence to Canada or Australia is measured in quarters and years, not weeks, and anyone compressing that is describing something else.",
          "Payment demanded in full before an eligibility assessment. An assessment against published criteria costs an hour of someone's attention; it does not require your fee.",
          "Pressure tied to a deadline that belongs to the seller rather than to you — a draw “closing”, a programme “about to change”, a price rising on Friday. Programme changes are published by governments in advance and are checkable.",
          "And an office that will not put the licence number in an email. Anything a firm is happy to say out loud but unwilling to write down is worth noticing.",
        ],
      },
      {
        heading: "Our own numbers, and where to check them",
        body: [
          "The Canadian practice is delivered under RCIC licence R516194, listed on the CICC public register against XIPHIAS Immigration DMCC and XIPHIAS Immigration Pvt Ltd. Australian matters run under MARA registration 1680615. The Managing Director, Varun Singh, is a Fellow of the Investment Migration Council.",
          "Each of those links above goes to the issuing body's own database, not to a page we control. Check them before you speak to us, not after.",
        ],
      },
    ],
    faq: [
      {
        q: "Is there a UAE regulator for immigration consultants?",
        a: "Not for outbound immigration advice in the way Canada and Australia regulate it. A UAE trade licence confirms a company is registered to do business; it does not authorise anyone to give Canadian or Australian immigration advice. The destination country's register is the one that answers that question.",
      },
      {
        q: "Is ICCRC the same as CICC?",
        a: "It is the same regulator under a new name. ICCRC was continued as the College of Immigration and Citizenship Consultants in November 2021. A firm whose website still says 'ICCRC registered' has not updated its compliance copy in several years, which tells you something in itself.",
      },
      {
        q: "Can a company hold an RCIC licence?",
        a: "No. The College licenses individuals, not companies. A firm can employ or work with a licensed consultant, and the register shows the company each licensee is associated with — which is exactly how you confirm the connection is real rather than implied.",
      },
      {
        q: "What if I have already paid someone who turns out to be unlicensed?",
        a: "Stop sending documents and money, keep every message and receipt, and get the file reviewed by someone who is licensed before anything is submitted. An application filed badly is harder to fix than one not yet filed, and a misrepresentation on a submitted form has consequences that outlast the consultant who made it.",
      },
    ],
    related: ["canada-immigration-consultants-in-dubai", "canada-pr-consultants-abu-dhabi", "corporate-immigration-services-uae"],
  },

  {
    slug: "corporate-immigration-services-uae",
    h1: "Corporate immigration services in the UAE",
    title: "Corporate Immigration Services UAE | Moving Staff, Properly",
    description:
      "Intra-company transfers, employer-sponsored routes and relocation support for UAE companies moving staff to Canada, Australia, the UK and Europe.",
    eyebrow: "For employers",
    standfirst:
      "The visa is rarely the hard part. Sequencing it against a start date, a family and a payroll is.",
    intents: [
      "corporate immigration services uae",
      "employee relocation services dubai",
      "intra company transfer visa uae",
      "business immigration consultants dubai",
    ],
    sections: [
      {
        heading: "What UAE employers actually come to us with",
        body: [
          "A named person with a start date, a family, and a deadline that was set before anyone checked whether the route existed. The work is usually to find the fastest lawful path to that date, or to say plainly that the date is not achievable and propose the one that is.",
          "Common shapes: an intra-company transfer into a Canadian or UK entity, an employer-sponsored skilled route into Australia, a Schengen posting, or a founder moving with a business. Each has a different gate — sometimes the company's standing, sometimes the role's classification, sometimes the individual's history.",
        ],
      },
      {
        heading: "Where corporate moves actually fail",
        body: [
          "Job titles that do not survive classification. A title that makes sense internally frequently does not map to the occupation code the destination country needs, and the fix is a properly written role description, agreed before anything is filed.",
          "Dependants left until last. Spousal work rights, school places and dependant visas have their own timelines, and a transfer that ignores them produces an employee who arrives and then leaves within a year.",
          "Undisclosed history. A refusal from six years ago that nobody asked about surfaces during processing and costs more time than declaring it ever would have.",
          "And documentation gathered at the end rather than the start — attestation, apostille and MOFA steps for UAE-issued documents take longer than most HR calendars assume.",
        ],
      },
      {
        heading: "How we work with HR and mobility teams",
        body: [
          "A feasibility view first: which routes are open for this role, this person and this timeline, with the constraint that actually binds identified rather than a list of options.",
          "Then a documented plan with owners — what the company produces, what the employee produces, and what we produce — because the single largest source of delay in corporate files is a document nobody was assigned.",
          "For volume moves, the same assessment applied across a cohort, so that the people who can move now are separated from the people who need a different route, before anyone is promised anything.",
        ],
      },
    ],
    faq: [
      {
        q: "Can a UAE company transfer staff to Canada or the UK?",
        a: "Yes, where the company has, or establishes, a qualifying related entity in the destination country and the employee meets the role and tenure conditions. The gates are usually the corporate relationship and the role's classification rather than the individual, which is why feasibility should be checked before any commitment is made to an employee.",
      },
      {
        q: "How long does a corporate relocation take?",
        a: "It depends on the route, and the dependant timeline is often longer than the employee's. A realistic plan works backwards from the start date and identifies the single step that binds — usually documentation or classification, rarely the visa decision itself.",
      },
      {
        q: "Do you handle the family as well?",
        a: "Yes, and it should be planned at the same time rather than afterwards. Spousal work rights and school admission cycles are the two things most likely to turn a successful transfer into a returned employee.",
      },
      {
        q: "Can you assess a whole team at once?",
        a: "Yes. For cohort moves the same assessment is applied across the group, which separates the people who can move on the intended timeline from those who need a different route, before any commitments are made internally.",
      },
    ],
    related: ["canada-immigration-consultants-in-dubai", "verify-immigration-consultant", "canada-pr-consultants-abu-dhabi"],
  },
];

export function getLocalLanding(slug: string) {
  return localLandings.find((landing) => landing.slug === slug);
}
