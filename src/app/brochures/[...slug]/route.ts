// Auto-made brochures.
//   /brochures/<vertical>/<country>/<programme>.pdf  → that programme's brochure
//   /brochures/<vertical>/<country>.pdf              → that country's brochure
// Each PDF is built from the page's own content file, so it always matches the page.

import { countryBrochure, programmeBrochure } from "@/lib/brochure/source";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function notFound() {
  return new Response("Brochure not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await ctx.params;
  if (!Array.isArray(slug) || slug.length < 2 || slug.length > 3) return notFound();
  const last = slug[slug.length - 1];
  if (!last.toLowerCase().endsWith(".pdf")) return notFound();
  const name = last.slice(0, -4);

  try {
    const result = slug.length === 3 ? await programmeBrochure(slug[0], slug[1], name) : await countryBrochure(slug[0], name);
    if (!result) return notFound();
    return new Response(Buffer.from(result.bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(result.bytes.length),
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Cache-Control": "public, max-age=600",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (err) {
    console.error("[brochure] failed to build", slug.join("/"), err);
    return new Response("The brochure could not be prepared. Please try again.", { status: 500, headers: { "X-Robots-Tag": "noindex" } });
  }
}
