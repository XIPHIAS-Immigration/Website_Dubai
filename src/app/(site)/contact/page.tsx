// src/app/(site)/contact/page.tsx
import type { Metadata } from "next";
import { cormorant } from "@/lib/local-fonts";
import ContactPage from "@/components/Company/ContactPage";

const serif = cormorant;

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Contact XIPHIAS Immigration | Dubai, Bengaluru & Gurugram",
  description:
    "Reach our senior advisors by call, WhatsApp or email. Offices in Dubai, Bengaluru & Gurugram. Confidential consultations by appointment.",
  keywords: ["Contact XIPHIAS", "Immigration consultants Dubai", "Golden Visa consultant", "Citizenship by Investment", "Residency by Investment"],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact XIPHIAS Immigration | Dubai, Bengaluru & Gurugram",
    description: "Call, WhatsApp or email our senior advisors. Dubai, Bengaluru & Gurugram offices. Confidential immigration consultations by appointment.",
    url: "https://www.xiphiasimmigration.ae/contact",
    siteName: "XIPHIAS Immigration", locale: "en_US", type: "website",
    images: [{ url: "/xiphias-immigration.png", width: 1200, height: 630, alt: "Contact XIPHIAS Immigration" }],
  },
  twitter: { card: "summary_large_image", title: "Contact XIPHIAS", description: "Book a private consultation — Dubai · Bengaluru · Gurugram.", images: ["/xiphias-immigration.png"] },
};

export default function Page() {
  return <ContactPage serifClass={serif.className} />;
}
