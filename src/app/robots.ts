// src/app/robots.ts
import type { MetadataRoute } from "next";

// ✅ Keep robots consistent with your canonical domain (www)
const HOST = "https://www.xiphiasimmigration.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Internal or system
          "/api/",
          "/search",
          "/thank-you",
          "/login",
          "/profile",
          "/admin",
          "/dashboard",

          // Draft/preview routes
          "/preview",
          "/draft",
          "/private",

          // Design scratchpad — component demos, not content
          "/samples",
          "/sample2",
          "/sample3",
          "/hero-preview",

          // Transactional and internal
          "/payment",
          "/booking",
          "/event",
          "/report-advisor-workflow",
          "/australia-assesment-report",
          "/canada-assesent-report",

          // Common duplicate param patterns
          "/*?*utm_*",
          "/*?*gclid=*",
          "/*?*fbclid=*",
          "/*?*msclkid=*",
          "/*?*igshid=*",
          "/*?*ref=*",
          "/*?*source=*",
          "/*?*campaign=*",

          // add into disallow array
          "/cdn-cgi/",
          "/*%7C*",

        ],
      },
    ],
    sitemap: `${HOST}/sitemap.xml`,
    host: HOST,
  };
}