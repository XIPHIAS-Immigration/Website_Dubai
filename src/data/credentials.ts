// src/data/credentials.ts
// -----------------------------------------------------------------------------
// Verifiable regulatory credentials and firm facts for the UAE entity.
//
// RULE: nothing goes in this file unless a member of the public can check it
// against a primary source. Every entry carries the register URL, the exact
// name the regulator holds, and the date it was last confirmed. Claims that
// cannot be verified belong somewhere else, not here.
//
// The CICC Code of Professional Conduct (SOR/2022-128) s.44(1)(b) requires any
// written advertisement carrying a licence to include the College's public
// register address — which is why every credential below renders as a link.
// -----------------------------------------------------------------------------

export type Credential = {
  id: string;
  label: string;
  authority: string;
  authorityShort: string;
  reference: string;
  heldBy: string;
  scope: string;
  verifyUrl: string;
  lastVerified: string;
  country: string;
};

export const credentials: Credential[] = [
  {
    id: "rcic",
    label: "RCIC R516194",
    authority: "College of Immigration and Citizenship Consultants",
    authorityShort: "CICC",
    reference: "R516194",
    heldBy:
      "Lijun Wang — listed against XIPHIAS Immigration DMCC and XIPHIAS Immigration Pvt Ltd",
    scope:
      "Regulated Canadian Immigration Consultant, Class L2. Status on the public register: entitled to practise.",
    verifyUrl: "https://register.college-ic.ca/Public-Register-EN/RCIC_Search.aspx",
    lastVerified: "2026-09-13",
    country: "Canada",
  },
  {
    id: "mara",
    label: "MARA 1680615",
    authority: "Office of the Migration Agents Registration Authority",
    authorityShort: "OMARA",
    reference: "1680615",
    heldBy: "Registered migration agent acting for XIPHIAS Immigration",
    scope: "Registered to provide Australian immigration assistance.",
    verifyUrl: "https://portal.mara.gov.au/search-the-register-of-migration-agents/",
    lastVerified: "2026-09-13",
    country: "Australia",
  },
  {
    id: "imc",
    label: "Fellow IMC",
    authority: "Investment Migration Council",
    authorityShort: "IMC",
    reference: "Fellow · Cert IMC",
    heldBy: "Varun Singh, Managing Director",
    scope:
      "Fellow and certified member of the industry body for residence and citizenship by investment.",
    verifyUrl: "https://investmentmigration.org/fellow-members-directory/",
    lastVerified: "2026-09-13",
    country: "Global",
  },
];

/**
 * The strongest differentiator in the UAE market specifically. Dubai has a
 * "Top 10 consultants" listicle industry precisely because buyers here are
 * frightened of being scammed — a checkable Canadian regulator licence held
 * against a DMCC entity answers that better than any claim about experience.
 */
export const primaryCredentialId = "rcic";

/**
 * The Dubai street address is deliberately absent. LocalBusiness structured
 * data with an unverified address is worse than none — Google reconciles
 * conflicting entities by ignoring them, and a wrong address on a map card
 * costs walk-in trust. Fill DUBAI_ADDRESS below and flip emitLocalBusiness to
 * true once someone has confirmed the exact registered string.
 */
export const DUBAI_ADDRESS: {
  streetAddress: string;
  locality: string;
  region: string;
  postalCode?: string;
  countryCode: "AE";
  emitLocalBusiness: boolean;
} = {
  streetAddress: "", // [VERIFY] exact DMCC unit / tower / cluster string
  locality: "Dubai",
  region: "Jumeirah Lakes Towers",
  countryCode: "AE",
  emitLocalBusiness: false,
};

export const DUBAI_CONTACT = {
  phone: "+971527275101",
  phoneDisplay: "+971 52 727 5101",
  whatsapp: "https://wa.me/971527275101",
  email: "dubai@xiphiasimmigration.com",
} as const;

export const openingHours = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  opens: "09:00",
  closes: "18:00",
} as const;

export const firmFacts = {
  foundedYear: 2009,
  advisorYearsExperience: 17,
  jurisdictions: 35,
  googleRating: 4.8,
  awards: 39,
  serviceBoundary:
    "XIPHIAS provides immigration consulting and documentation support. It is not a law firm, and nothing on this page is legal advice.",
} as const;
