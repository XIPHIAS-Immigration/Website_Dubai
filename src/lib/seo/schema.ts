// src/lib/seo/schema.ts
// -----------------------------------------------------------------------------
// One place that builds JSON-LD, so every page emits the same organisation, the
// same person and the same contact details. Duplicated-but-slightly-different
// schema is worse than none: search engines reconcile conflicting entities by
// ignoring them.
//
// Everything is derived from src/data/credentials.ts. Nothing is stated twice.
// -----------------------------------------------------------------------------

import {
  DUBAI_ADDRESS,
  DUBAI_CONTACT,
  credentials,
  firmFacts,
  openingHours,
} from "@/data/credentials";
import { getSiteUrl } from "@/lib/seo/site";

export const SITE_URL = getSiteUrl();
export const ORG_ID = `${SITE_URL}#organization`;
export const PERSON_ID = `${SITE_URL}#varun-singh`;

type Json = Record<string, unknown>;

const ADVISOR_SAME_AS = [
  "https://www.linkedin.com/in/varunxiphias/",
  "https://www.imidaily.com/varun-singh/",
];

export function organizationSchema(): Json {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "XIPHIAS Immigration DMCC",
    alternateName: "XIPHIAS Immigration",
    url: SITE_URL,
    logo: `${SITE_URL}/xiphias-immigration.png`,
    foundingDate: String(firmFacts.foundedYear),
    email: DUBAI_CONTACT.email,
    telephone: DUBAI_CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: DUBAI_ADDRESS.locality,
      addressRegion: DUBAI_ADDRESS.region,
      addressCountry: DUBAI_ADDRESS.countryCode,
    },
    sameAs: ADVISOR_SAME_AS,
    areaServed: [
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Country", name: "Portugal" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "United States" },
    ],
  };
}

/**
 * Emitted only once a verified street address exists. An address we cannot
 * confirm stays out of structured data — a wrong one is worse than none, and
 * it is the kind of error that is hard to correct after Google has cached it.
 */
export function localBusinessSchemas(): Json[] {
  if (!DUBAI_ADDRESS.emitLocalBusiness || !DUBAI_ADDRESS.streetAddress) return [];
  return [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}#office-dubai`,
      name: "XIPHIAS Immigration DMCC — Dubai",
      parentOrganization: { "@id": ORG_ID },
      url: SITE_URL,
      image: `${SITE_URL}/xiphias-immigration.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: DUBAI_ADDRESS.streetAddress,
        addressLocality: DUBAI_ADDRESS.locality,
        addressRegion: DUBAI_ADDRESS.region,
        postalCode: DUBAI_ADDRESS.postalCode,
        addressCountry: DUBAI_ADDRESS.countryCode,
      },
      telephone: DUBAI_CONTACT.phone,
      email: DUBAI_CONTACT.email,
      priceRange: "$$$",
      currenciesAccepted: "AED",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: openingHours.days,
          opens: openingHours.opens,
          closes: openingHours.closes,
        },
      ],
      knowsAbout: [
        "Canadian permanent residence",
        "Australian skilled migration",
        "Residency by investment",
        "Citizenship by investment",
        "Corporate mobility",
        "UAE Golden Visa",
      ],
    },
  ];
}

export function personSchema(): Json {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Varun Singh",
    jobTitle: "Managing Director",
    worksFor: { "@id": ORG_ID },
    sameAs: ADVISOR_SAME_AS,
    hasCredential: credentials.map((credential) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Professional licence",
      name: `${credential.authorityShort} ${credential.reference}`,
      recognizedBy: { "@type": "Organization", name: credential.authority },
      url: credential.verifyUrl,
    })),
  };
}

export function faqSchema(id: string, items: ReadonlyArray<{ q: string; a: string }>): Json {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function articleSchema(input: {
  id: string;
  headline: string;
  description: string;
  updated: string;
  path: string;
}): Json {
  return {
    "@type": "Article",
    "@id": input.id,
    headline: input.headline,
    description: input.description,
    dateModified: input.updated,
    mainEntityOfPage: `${SITE_URL}${input.path}`,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbSchema(trail: Array<{ name: string; path: string }>): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

/** Serialise a @graph safely for dangerouslySetInnerHTML. */
export function jsonLdScript(graph: Json[]) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(
    /</g,
    "\\u003c",
  );
}
