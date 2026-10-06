// Reads a programme or country page from /content, prepares its photos and
// hands everything to the brochure builder. Results are kept in memory and
// rebuilt automatically whenever the page's content file changes.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { buildBrochure, money, VERTICAL_LABEL, type BrochureInput, type Fm, type ProgrammeCard, type SiteInfo } from "./build";

export type Vertical = BrochureInput["vertical"];
export const VERTICALS: Vertical[] = ["citizenship", "residency", "skilled", "corporate"];

const SLUG = /^[a-z0-9][a-z0-9-]*$/;
const CONTENT_DIR = () => path.join(process.cwd(), "content");
const PUBLIC_DIR = () => path.join(process.cwd(), "public");

export const SITE: SiteInfo = {
  company: "XIPHIAS Immigration DMCC",
  website: "www.xiphiasimmigration.ae",
  phone: "+971 52 727 5101",
  email: "dubai@xiphiasimmigration.com",
  whatsapp: "https://wa.me/971527275101",
  office: "Jumeirah Lakes Towers, Dubai, United Arab Emirates",
  credentials: [
    "Advising clients on global mobility since 2009; XIPHIAS Immigration DMCC in Dubai since 2017.",
    "Named Best Immigration Consultant by The Times of India in 2022.",
    "Canada files handled by a CICC-licensed Regulated Canadian Immigration Consultant, licence R516194.",
    "Australia files handled by a registered migration agent, MARA 1680615.",
  ],
  boundary: "XIPHIAS provides immigration consulting and documentation support. It is not a law firm, and nothing in this brochure is legal advice.",
};

export type BrochureResult = { bytes: Uint8Array; filename: string };

/* ───────────────────────── files ───────────────────────── */

function readDoc(file: string): { fm: Fm; body: string } | null {
  try {
    const raw = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
    const { data, content } = matter(raw);
    return { fm: (data ?? {}) as Fm, body: content ?? "" };
  } catch {
    return null;
  }
}

function mtime(file: string): number {
  try { return fs.statSync(file).mtimeMs; } catch { return 0; }
}

function publicFile(urlPath: unknown): string | null {
  if (typeof urlPath !== "string" || !urlPath.startsWith("/")) return null;
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const abs = path.normalize(path.join(PUBLIC_DIR(), clean));
  if (!abs.startsWith(PUBLIC_DIR() + path.sep)) return null; // never read outside /public
  return fs.existsSync(abs) && fs.statSync(abs).isFile() ? abs : null;
}

/* ───────────────────────── photos ───────────────────────── */

type Shade = "cover" | "banner" | "none";

// Navy gradients are painted into the photo itself so the brochure needs no
// overlays: the cover fades into the page, the banner sits behind the logo.
function shadeSvg(w: number, h: number, kind: Shade): Buffer | null {
  if (kind === "none") return null;
  const navy = "#0a1733";
  const body =
    kind === "cover"
      ? `<linearGradient id="t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${navy}" stop-opacity="0.94"/><stop offset="0.45" stop-color="${navy}" stop-opacity="0.6"/><stop offset="1" stop-color="${navy}" stop-opacity="0"/></linearGradient>
         <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${navy}" stop-opacity="0"/><stop offset="0.92" stop-color="${navy}" stop-opacity="1"/><stop offset="1" stop-color="${navy}" stop-opacity="1"/></linearGradient>
         </defs><rect x="0" y="0" width="${w}" height="${Math.round(h * 0.5)}" fill="url(#t)"/><rect x="0" y="${Math.round(h * 0.45)}" width="${w}" height="${h - Math.round(h * 0.45)}" fill="url(#b)"/>`
      : `<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${navy}" stop-opacity="0.86"/><stop offset="0.5" stop-color="${navy}" stop-opacity="0.5"/><stop offset="0.94" stop-color="${navy}" stop-opacity="1"/><stop offset="1" stop-color="${navy}" stop-opacity="1"/></linearGradient>
         </defs><rect x="0" y="0" width="${w}" height="${h}" fill="url(#g)"/>`;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs>${body}</svg>`);
}

let sharpLoader: Promise<typeof import("sharp") | null> | null = null;
function loadSharp(): Promise<typeof import("sharp") | null> {
  if (!sharpLoader) {
    sharpLoader = import("sharp")
      .then((m) => ((m as unknown as { default?: typeof import("sharp") }).default ?? (m as unknown as typeof import("sharp"))))
      .catch(() => null);
  }
  return sharpLoader;
}

async function photo(urlPath: unknown, w: number, h: number, quality = 80, shade: Shade = "none"): Promise<Uint8Array | undefined> {
  const abs = publicFile(urlPath);
  if (!abs) return undefined;
  const sharp = await loadSharp();
  if (!sharp) return undefined;
  try {
    let img = sharp(abs).resize(w, h, { fit: "cover", position: "centre" });
    const overlay = shadeSvg(w, h, shade);
    if (overlay) img = img.composite([{ input: overlay }]);
    const buf = await img.jpeg({ quality, mozjpeg: true }).toBuffer();
    return new Uint8Array(buf);
  } catch {
    return undefined;
  }
}

function logo(): Uint8Array | undefined {
  const abs = publicFile("/images/logo/xiphias-immigration-white.png");
  if (!abs) return undefined;
  try { return new Uint8Array(fs.readFileSync(abs)); } catch { return undefined; }
}

/* ───────────────────────── cache ───────────────────────── */

const cache = new Map<string, { stamp: string; result: BrochureResult }>();
const MAX_CACHED = 80;

function remember(key: string, stamp: string, result: BrochureResult) {
  if (cache.size >= MAX_CACHED) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { stamp, result });
}

function fileSlug(s: string): string {
  return s.normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "brochure";
}

function timelineOf(fm: Fm): string {
  if (typeof fm.timelineLabel === "string" && fm.timelineLabel.trim()) return fm.timelineLabel.trim();
  return typeof fm.timelineMonths === "number" && fm.timelineMonths > 0 ? `${fm.timelineMonths} months` : "";
}

/* ───────────────────────── public API ───────────────────────── */

/** Brochure for one programme page, or null when the page does not exist. */
export async function programmeBrochure(vertical: string, country: string, program: string): Promise<BrochureResult | null> {
  if (!VERTICALS.includes(vertical as Vertical) || !SLUG.test(country) || !SLUG.test(program)) return null;
  const file = path.join(CONTENT_DIR(), vertical, country, `${program}.mdx`);
  const countryFile = path.join(CONTENT_DIR(), vertical, country, "_country.mdx");
  const stamp = `${mtime(file)}:${mtime(countryFile)}`;
  if (stamp.startsWith("0:")) return null;
  const key = `p:${vertical}/${country}/${program}`;
  const hit = cache.get(key);
  if (hit && hit.stamp === stamp) return hit.result;

  const doc = readDoc(file);
  if (!doc || doc.fm.draft === true) return null;
  const countryDoc = readDoc(countryFile);
  const hero = doc.fm.heroImage ?? doc.fm.heroPoster;
  const countryHero = countryDoc?.fm.heroImage;
  const [cover, banner] = await Promise.all([
    photo(hero, 1240, 877, 82, "cover"),
    photo(countryHero && countryHero !== hero ? countryHero : hero, 1240, 521, 78, "banner"),
  ]);
  const bytes = await buildBrochure(
    { kind: "programme", vertical: vertical as Vertical, fm: doc.fm, body: doc.body, site: SITE, cover, banner, logo: logo() },
    `${SITE.website}/${vertical}/${country}/${program}`,
  );
  const title = typeof doc.fm.title === "string" ? doc.fm.title : program;
  const result = { bytes, filename: `XIPHIAS-${fileSlug(title)}.pdf` };
  remember(key, stamp, result);
  return result;
}

/** Brochure for one country page, listing every programme in that country. */
export async function countryBrochure(vertical: string, country: string): Promise<BrochureResult | null> {
  if (!VERTICALS.includes(vertical as Vertical) || !SLUG.test(country)) return null;
  const dir = path.join(CONTENT_DIR(), vertical, country);
  const file = path.join(dir, "_country.mdx");
  if (!mtime(file)) return null;
  let files: string[] = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") && f !== "_country.mdx").sort(); } catch { files = []; }
  const stamp = [mtime(file), ...files.map((f) => mtime(path.join(dir, f)))].join(":");
  const key = `c:${vertical}/${country}`;
  const hit = cache.get(key);
  if (hit && hit.stamp === stamp) return hit.result;

  const doc = readDoc(file);
  if (!doc || doc.fm.draft === true) return null;

  const programmes: ProgrammeCard[] = [];
  for (const f of files) {
    const p = readDoc(path.join(dir, f));
    if (!p || p.fm.draft === true) continue;
    const fm = p.fm;
    programmes.push({
      title: typeof fm.title === "string" ? fm.title : f.replace(/\.mdx$/, ""),
      tagline: typeof fm.tagline === "string" ? fm.tagline : typeof fm.summary === "string" ? fm.summary : undefined,
      from: typeof fm.minInvestment === "number" && fm.minInvestment > 0 ? money(fm.minInvestment, fm.currency) : undefined,
      timeline: timelineOf(fm) || undefined,
      thumb: await photo(fm.heroImage ?? fm.heroPoster, 560, 170, 74),
    });
  }

  const hero = doc.fm.heroImage ?? doc.fm.heroPoster;
  const [cover, banner] = await Promise.all([photo(hero, 1240, 877, 82, "cover"), photo(hero, 1240, 521, 78, "banner")]);
  const bytes = await buildBrochure(
    { kind: "country", vertical: vertical as Vertical, fm: doc.fm, body: doc.body, site: SITE, cover, banner, logo: logo(), programmes },
    `${SITE.website}/${vertical}/${country}`,
  );
  const name = typeof doc.fm.country === "string" ? doc.fm.country : country;
  const result = { bytes, filename: `XIPHIAS-${fileSlug(`${name} ${VERTICAL_LABEL[vertical as Vertical]}`)}.pdf` };
  remember(key, stamp, result);
  return result;
}
