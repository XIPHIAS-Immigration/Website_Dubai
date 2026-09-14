import type { Metadata } from "next";

import { JsonLd } from "@/lib/seo";
import XiaAutoOpen from "@/components/Xia/XiaAutoOpen";
import XiaBand from "@/components/Xia/XiaBand";

export const metadata: Metadata = {
  title: "XIA Intelligence — Your immigration assistant | XIPHIAS Dubai",
  description:
    "Tell XIA what you do and where you want to go. It checks your profile against every residency, citizenship and skilled-migration programme XIPHIAS tracks, and comes back with the routes you qualify for.",
  alternates: { canonical: "/xia-intelligence" },
  openGraph: {
    title: "XIA Intelligence — Your immigration assistant",
    description:
      "Two minutes of questions, then the routes you actually qualify for — with the gaps named.",
    url: "/xia-intelligence",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "XIA Intelligence",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "/xia-intelligence",
  description:
    "An immigration assistant that scores a visitor's profile against residency, citizenship and skilled-migration programmes and returns the routes they qualify for.",
  provider: { "@type": "Organization", name: "XIPHIAS Immigration" },
  offers: { "@type": "Offer", price: 0, priceCurrency: "AED" },
};

export default function XiaIntelligencePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <XiaAutoOpen />
      <XiaBand />
    </>
  );
}
