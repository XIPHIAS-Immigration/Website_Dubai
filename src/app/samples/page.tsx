import type { Metadata } from "next";
import { cormorant } from "@/lib/local-fonts";
import MenuIconSamples from "./MenuIconSamples";

const serif = cormorant;

// Design scratchpad, not content. Without this the route is indexable and the
// sitemap walker happily lists it, which hands Google a page of unfinished
// component demos as if it were a real page.
export const metadata: Metadata = {
  title: "Menu icon samples — internal",
  robots: { index: false, follow: false },
};

export default function SamplesPage() { return <MenuIconSamples serifClass={serif.className} />; }
