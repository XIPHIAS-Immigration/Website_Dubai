import type { Metadata } from "next";

import { JsonLd } from "@/lib/seo";
import XiaAutoOpen from "@/components/Xia/XiaAutoOpen";
import XiaBand from "@/components/Xia/XiaBand";

// Route Intelligence, Deep Analysis and the old XIA suite were three names for
// one thing, which is exactly how it read to visitors. This is now a single
// assistant; the URL is kept because it is linked from the menus and indexed.

export const metadata: Metadata = {
  title: "XIA Route Intelligence — which routes you qualify for | XIPHIAS Dubai",
  description:
    "Rank every residency, citizenship and skilled-migration route against your own profile: destination, capital, timeline, family and occupation. Built on XIPHIAS programme data.",
  alternates: { canonical: "/route-intelligence" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "XIA Route Intelligence",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "/route-intelligence",
  description:
    "Scores a profile against residency, citizenship and skilled-migration programmes and ranks the routes that fit.",
  provider: { "@type": "Organization", name: "XIPHIAS Immigration" },
  offers: { "@type": "Offer", price: 0, priceCurrency: "AED" },
};

export default function RouteIntelligencePage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <XiaAutoOpen />
      <XiaBand />
    </>
  );
}
