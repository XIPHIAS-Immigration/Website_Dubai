import type { Metadata } from "next";
import { notFound } from "next/navigation";

import GuideArticle from "@/components/Guides/GuideArticle";
import { getGuide } from "@/data/guides";
import {
  SITE_URL,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  jsonLdScript,
  organizationSchema,
  personSchema,
} from "@/lib/seo/schema";

const SLUG = "canada-pr-from-dubai";
const guide = getGuide(SLUG);

export const revalidate = 86400;

export const metadata: Metadata = {
  title: guide?.title,
  description: guide?.description,
  alternates: { canonical: `/${SLUG}` },
  openGraph: {
    title: guide?.title,
    description: guide?.description,
    url: `${SITE_URL}/${SLUG}`,
    siteName: "XIPHIAS Immigration",
    type: "article",
    images: [`${SITE_URL}/xiphias-immigration.png`],
  },
};

export default function Page() {
  if (!guide) notFound();

  const graph = [
    organizationSchema(),
    personSchema(),
    articleSchema({
      id: `${SITE_URL}/${SLUG}#article`,
      headline: guide.h1,
      description: guide.description,
      updated: guide.updated,
      path: `/${SLUG}`,
    }),
    faqSchema(`${SITE_URL}/${SLUG}#faq`, guide.faq),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: guide.h1, path: `/${SLUG}` },
    ]),
  ];

  return (
    <>
      <GuideArticle guide={guide} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />
    </>
  );
}
