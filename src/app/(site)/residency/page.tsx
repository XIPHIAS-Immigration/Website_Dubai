// src/app/(site)/residency/page.tsx
import type { Metadata } from "next";
import { cormorant } from "@/lib/local-fonts";
import { getResidencyCountries, getResidencyPrograms, type ProgramMeta, type CountryMeta } from "@/lib/residency-content";
import { JsonLd } from "@/lib/seo";
import VerticalHub, { type VerticalConfig } from "@/components/Vertical/VerticalHub";

const serif = cormorant;

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Golden Visa & Investor Residency Programs | XIPHIAS",
  description:
    "UAE 10-yr Golden Visa, Portugal from €250k, Greece from €400k. Real estate, fund & capital routes across 20+ jurisdictions. IMC Fellow-led, Dubai.",
  alternates: { canonical: "/residency" },
  openGraph: {
    title: "Golden Visa & Investor Residency Programs | XIPHIAS",
    description:
      "UAE Golden Visa, Portugal, Greece & Malta — investor residence across 20+ jurisdictions from €50k. Real estate & fund routes, Dubai-based.",
    url: "https://www.xiphiasimmigration.ae/residency",
    siteName: "XIPHIAS Immigration",
    locale: "en_US",
    type: "website",
    images: [{ url: "/xiphias-immigration.png", width: 1200, height: 630, alt: "Residency & Golden Visas – XIPHIAS Immigration" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Residency & Golden Visas — Investor Residence, Privately Arranged",
    description: "Investor residence across 20+ jurisdictions, arranged with discretion from Dubai.",
    images: ["/xiphias-immigration.png"],
  },
};

const config: VerticalConfig = {
  verticalSlug: "residency",
  vertical: "Residency & Golden Visas",
  curtainLabel: "Residency & Golden Visas",
  heroImage: "/images/residency/uae/uae-golden-visa.webp",
  heroEyebrow: "Residency & Golden Visas",
  heroEyebrowAr: "الإقامة والفيزا الذهبية",
  heroTitle: "Residency & golden visas,",
  heroTitleItalic: "expertly arranged.",
  heroSummary:
    "A 10-year UAE Golden Visa, an EU golden visa or a global investor residence — the right to live, work and retire across 20+ jurisdictions, arranged end-to-end.",
  heroChips: ["EU & Schengen access", "10-year UAE Golden Visa", "Family included"],
  heroStats: [
    { v: "20+", u: "jurisdictions" },
    { v: "€50k", u: "entry point" },
    { v: "195", u: "visa-free max" },
    { v: "10-yr", u: "residency" },
  ],
  whyHeading: "Investor residence,",
  whyHeadingItalic: "properly arranged.",
  whySubline:
    "We match you to the jurisdiction before we recommend the programme — not the other way around.",
  whyProps: [
    {
      no: "01",
      title: "Jurisdiction matching",
      line: "We match you to the programme — not the other way around.",
      detail:
        "Tax residency, travel patterns, family situation, investment preference — we map all four before recommending a single programme.",
    },
    {
      no: "02",
      title: "Investment-route compliance",
      line: "Source of funds, anti-money-laundering, due diligence.",
      detail:
        "We prepare your compliance file before the government does their checks — to reduce the risk of surprises or a refusal at the due-diligence stage.",
    },
    {
      no: "03",
      title: "End-to-end execution",
      line: "From first consultation to residence card.",
      detail:
        "We handle the application, the investment, the legal structuring and the travel — so you appear in the country to collect your card, not to manage paperwork.",
    },
    {
      no: "04",
      title: "Family fully in scope",
      line: "Spouse, children, dependent parents.",
      detail:
        "We plan the family application from day one — not as an add-on when the individual application is already in progress.",
    },
  ],
  destHeading: "Where we arrange residency",
  destSub: "Twenty-one jurisdictions to call home.",
  regions: ["All", "Europe", "Gulf", "Asia", "Americas", "Caribbean", "Oceania", "Africa"],
  countries: [
    { name: "United Arab Emirates", slug: "uae",      region: "Gulf",      img: "/images/residency/uae/uae-golden-visa.webp",                                      time: "~2 mo",    visa: "183", from: "AED 2M",  note: "10-yr Golden Visa" },
    { name: "Portugal",             slug: "portugal", region: "Europe",    img: "/images/residency/portugal/portugal-golden-visa.webp",                             time: "~15 mo",   visa: "188", from: "€250k",  note: "EU · permanent residence in 5 yrs" },
    { name: "Greece",               slug: "greece",   region: "Europe",    img: "/images/residency/greece/greece-golden-visa.webp",                                  time: "50 days",  visa: "186", from: "€400k",  note: "Schengen · €800k in prime areas" },
    { name: "Malta",                slug: "malta",    region: "Europe",    img: "/images/residency/malta/malta-mprp.webp",                                           time: "Varies",   visa: "184", from: "€14k/yr lease", note: "Permanent residence · plus €99k in fees & contributions" },
    { name: "Cyprus",               slug: "cyprus",   region: "Europe",    img: "/images/residency/cyprus/cyprus-residential-property.webp",                        time: "Varies",   visa: "182", from: "on assessment", note: "Permanent residence · EU, not Schengen" },
    { name: "France",               slug: "france",   region: "Europe",    img: "/images/residency/france/france-residency.webp",                                    time: "3–7 mo",   visa: "185", from: "€300k",  note: "Talent card · no golden visa" },
    { name: "Hungary",              slug: "hungary",  region: "Europe",    img: "/images/residency/hungary/hungary-residency-by-investment.webp",                   time: "Varies",   visa: "186", from: "€250k",  note: "Guest Investor" },
    { name: "Bulgaria",             slug: "bulgaria", region: "Europe",    img: "/images/residency/bulgaria/bulgaria-aif.webp",                                     time: "Varies",   visa: "176", from: "on assessment", note: "EU permanent residence" },
    { name: "Singapore",            slug: "singapore",region: "Asia",      img: "/images/residency/singapore/singapore-gip-pr-investment-hero.webp",                time: "~12 mo",   visa: "195", from: "S$10M",  note: "Global Investor (GIP)" },
    { name: "Curaçao",              slug: "curacao",  region: "Caribbean", img: "/images/residency/curacao/curacao-3-year-investor-residency.webp",                 time: "~4 mo",    visa: "187", from: "XCG 500k", note: "Path to Netherlands nationality" },
    { name: "Switzerland",          slug: "switzerland", region: "Europe", img: "/images/residency/switzerland/switzerland.webp",                                    time: "~6 mo",    visa: "187", from: "CHF 434.7k tax base", note: "Lump-sum tax residence" },
    { name: "Monaco",               slug: "monaco",   region: "Europe",    img: "/images/residency/Monaco/monaco-residency-property-investment.webp",               time: "~6 mo",    visa: "178", note: "No set minimum · bank attestation" },
    { name: "Latvia",               slug: "latvia",   region: "Europe",    img: "/images/residency/latvia/latvia-residency-by-investment-golden-visa.webp",          time: "Varies",   visa: "184", from: "€50k",   note: "Share-capital route only · Schengen" },
    { name: "Hong Kong",            slug: "hong-kong",region: "Asia",      img: "/images/residency/hong-kong/hong-kong-residency-investment.webp",                  time: "Varies",   visa: "170", from: "HK$30M", note: "CIES investor scheme" },
    { name: "Malaysia",             slug: "malaysia", region: "Asia",      img: "/images/residency/malaysia/malaysia-residency-investment.webp",                    time: "Varies",   visa: "183", from: "$150k",  note: "MM2H long-stay residence" },
    { name: "Canada",               slug: "canada",   region: "Americas",  img: "/images/residency/canada/bc-entrepreneur-base.webp",                               time: "18–24 mo", visa: "185", from: "C$100k", note: "Ten provincial entrepreneur routes" },
    { name: "USA",                  slug: "usa",      region: "Americas",  img: "/images/residency/usa/usa-eb5.webp",                                               time: "~24 mo",   visa: "182", from: "$800k",  note: "EB-5 investor green card" },
    { name: "Panama",               slug: "panama",   region: "Americas",  img: "/images/residency/panama/panama-residency-by-investment.webp",                     time: "2–3 mo",   visa: "141", from: "$500k",  note: "Qualified Investor visa" },
    { name: "Uruguay",              slug: "uruguay",  region: "Americas",  img: "/images/residency/uruguay/uruguay-residency-by-investment.webp",                   time: "~18 mo",   visa: "153", note: "No set investment minimum" },
    { name: "New Zealand",          slug: "new-zealand", region: "Oceania", img: "/images/residency/new-zealand/new-zealand-residency-by-investment.webp",          time: "36 working days", visa: "190", from: "NZ$5M",  note: "Active Investor Plus" },
    { name: "Mauritius",            slug: "mauritius",region: "Africa",    img: "/images/residency/mauritius/mauritius-residency-investment.webp",                  time: "~3 mo",    visa: "143", from: "$375k",  note: "Residence permit via property" },
  ],
  routesEyebrow: "How you invest",
  routesEyebrowAr: "طرق الاستثمار",
  routesTitle: "Three routes.",
  routesTitleItalic: "One global residence.",
  routes: [
    {
      k: "Real estate",
      tag: "Tangible & resaleable",
      line: "Buy a qualifying property and hold it — your capital stays in a hard asset that can be sold after the holding period.",
      points: ["Tangible, resaleable asset", "Potential rental yield", "Capital retained, not spent"],
    },
    {
      k: "Investment fund",
      tag: "Regulated & passive",
      line: "Subscribe to a government-approved fund — a hands-off, professionally managed route with no property to maintain.",
      points: ["Fully passive", "Regulated & diversified", "No asset management required"],
    },
    {
      k: "Capital transfer",
      tag: "Simple & liquid",
      line: "A bank deposit, business or talent route — a simple path to a Gulf or EU residence permit.",
      points: ["Fewest moving parts", "Straightforward to evidence", "Liquid capital retained"],
    },
  ],
  process: [
    {
      no: "01",
      title: "Private consultation",
      detail: "We understand your goals — mobility, tax, family, a base or a path to citizenship — and recommend the right residence programme.",
      handle: ["Jurisdiction & route strategy", "Indicative costs & timeline", "Under NDA from day one"],
    },
    {
      no: "02",
      title: "Eligibility & source of funds",
      detail: "We pre-clear your source of funds and confirm eligibility before anything is filed, so there are no surprises.",
      handle: ["Source-of-funds dossier", "Eligibility confirmation", "Full document checklist"],
    },
    {
      no: "03",
      title: "Application & investment",
      detail: "We assemble and submit your application and guide the qualifying investment — property, fund or transfer.",
      handle: ["Full application assembly", "Government submission", "Qualifying investment guide"],
    },
    {
      no: "04",
      title: "Residence granted",
      detail: "Your residence permit or golden visa is issued for you and your family — and we handle the formalities on arrival.",
      handle: ["Permit / visa issued", "Family included", "Banking & relocation"],
    },
    {
      no: "05",
      title: "Renewal & the path onward",
      detail: "We manage renewals and, where you wish, the route to permanent residence and citizenship.",
      handle: ["Renewals managed", "Path to PR & citizenship", "Lifetime concierge"],
    },
  ],
  quotes: [
    {
      q: "XIPHIAS matched us to the UAE Golden Visa and arranged everything — from our investment to the residence cards — in under three months.",
      who: "A family principal",
      where: "Dubai",
    },
    {
      q: "They recommended Portugal's golden visa over three others we were considering, and explained exactly why. That clarity was everything.",
      who: "A business owner",
      where: "Mumbai",
    },
    {
      q: "The most professional advisory I've worked with. Every step documented, every deadline met — and the whole family included.",
      who: "A senior executive",
      where: "Singapore",
    },
  ],
  articles: [
    {
      cat: "Golden Visa",
      title: "UAE Golden Visa: the complete guide",
      meta: "8 min read · Residency",
      img: "/images/residency/uae/uae-golden-visa.webp",
      href: "/insights",
    },
    {
      cat: "Investor Residence",
      title: "Portugal Golden Visa: what routes are still open in 2025",
      meta: "6 min read · Residency",
      img: "/images/residency/portugal/portugal-golden-visa.webp",
      href: "/insights",
    },
    {
      cat: "Investor Residence",
      title: "Greece Golden Visa: the €800k, €400k and €250k tiers explained",
      meta: "5 min read · Residency",
      img: "/images/residency/greece/greece-golden-visa.webp",
      href: "/insights",
    },
  ],
  ctaHeading: "Begin your",
  ctaItalic: "residence.",
  ctaSummary:
    "Tell us your goals — mobility, tax, family or a path to citizenship. A senior advisor will match the right programme and jurisdiction, privately.",
  ctaImage: "/images/residency/portugal/portugal-golden-visa.webp",
};

export default function ResidencyPage() {
  const countries: CountryMeta[] = getResidencyCountries();
  const programs: ProgramMeta[] = getResidencyPrograms();

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Residency & Golden Visas — Investor Residence, Privately Arranged",
    url: "https://www.xiphiasimmigration.ae/residency",
    description: "Investor residence across 20+ jurisdictions — the UAE Golden Visa, Portugal, Greece, Malta and more.",
  };
  const countryListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Residency Countries",
    itemListElement: countries.map((c, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://www.xiphiasimmigration.ae/residency/${c.countrySlug}`,
      name: c.title || c.country,
    })),
  };
  const topProgramsLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top Residency Programmes",
    itemListElement: programs.slice(0, 5).map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `https://www.xiphiasimmigration.ae/residency/${p.countrySlug}/${p.programSlug}`,
      name: p.title,
    })),
  };

  return (
    <>
      <JsonLd data={webPageLd} />
      <JsonLd data={countryListLd} />
      <JsonLd data={topProgramsLd} />
      <VerticalHub c={config} serifClass={serif.className} />
    </>
  );
}
