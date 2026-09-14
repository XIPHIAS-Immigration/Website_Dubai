import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import MenuIconSamples from "./MenuIconSamples";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500","600","700"], style: ["normal","italic"], display: "swap" });

// Design scratchpad, not content. Without this the route is indexable and the
// sitemap walker happily lists it, which hands Google a page of unfinished
// component demos as if it were a real page.
export const metadata: Metadata = {
  title: "Menu icon samples — internal",
  robots: { index: false, follow: false },
};

export default function SamplesPage() { return <MenuIconSamples serifClass={serif.className} />; }
