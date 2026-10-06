// Brochure builder: turns one programme page or one country page into a PDF.
// Everything in the brochure comes from that page's own content file, so the
// brochure always matches the page.

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage, type RGB } from "pdf-lib";
import { clean, parseBlocks, parseInline, plain, runsText, toSections, type Block, type ListItem, type Run } from "./markdown";

/* ───────────────────────── inputs ───────────────────────── */

export type Fm = Record<string, unknown>;

export type SiteInfo = {
  company: string;
  website: string; // display form, e.g. www.xiphiasimmigration.ae
  phone: string;
  email: string;
  whatsapp?: string;
  office: string; // one-line office description
  credentials: string[];
  boundary: string; // "not a law firm" line
};

export type ProgrammeCard = {
  title: string;
  tagline?: string;
  from?: string;
  timeline?: string;
  thumb?: Uint8Array; // JPEG
};

export type BrochureInput = {
  kind: "programme" | "country";
  vertical: "citizenship" | "residency" | "skilled" | "corporate";
  fm: Fm;
  body: string;
  site: SiteInfo;
  cover?: Uint8Array; // JPEG, portrait crop
  banner?: Uint8Array; // JPEG, wide crop for the closing page
  logo?: Uint8Array; // PNG, light logo for dark backgrounds
  programmes?: ProgrammeCard[]; // country brochures only
};

/* ───────────────────────── look ───────────────────────── */

const W = 595.28;
const H = 841.89;
const MX = 50;
const TOP = 72;
const BOTTOM = 62;
const CW = W - MX * 2;

const hex = (v: string): RGB => {
  const n = parseInt(v.replace("#", ""), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};
const C = {
  navy: hex("0a1733"),
  navy2: hex("10244a"),
  ink: hex("0c1f3f"),
  text: hex("27324a"),
  muted: hex("6b7488"),
  gold: hex("bfa15c"),
  goldDark: hex("8f7536"),
  cream: hex("f7f3e8"),
  line: hex("e4dcc8"),
  white: hex("ffffff"),
  soft: hex("d7deeb"),
  zebra: hex("faf8f2"),
};

export const VERTICAL_LABEL: Record<BrochureInput["vertical"], string> = {
  citizenship: "Citizenship by Investment",
  residency: "Residency by Investment",
  skilled: "Skilled Migration",
  corporate: "Corporate Mobility",
};

type Fonts = { reg: PDFFont; bold: PDFFont; ital: PDFFont; boldItal: PDFFont; serif: PDFFont; serifBold: PDFFont; serifItal: PDFFont };

/* ───────────────────────── small helpers ───────────────────────── */

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown): string => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");
const arr = <T = unknown>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const strList = (v: unknown): string[] => (Array.isArray(v) ? v : typeof v === "string" ? [v] : []).map(str).filter(Boolean);

export function money(amount: unknown, currency?: unknown): string {
  if (typeof amount !== "number" || !isFinite(amount)) return str(amount);
  const cur = str(currency).toUpperCase();
  const n = amount.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return cur ? `${cur} ${n}` : n;
}

function months(n: unknown): string {
  if (typeof n !== "number" || !isFinite(n) || n <= 0) return "";
  if (n >= 24 && n % 12 === 0) return `${n / 12} years`;
  return n === 1 ? "1 month" : `${n} months`;
}

function humanise(slug: string): string {
  return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function niceDate(v: unknown): string {
  const s = v instanceof Date ? v.toISOString().slice(0, 10) : str(v);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return "";
  const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${parseInt(m[3], 10)} ${names[parseInt(m[2], 10) - 1]} ${m[1]}`;
}

function familyLine(fmx: unknown): string {
  if (!isObj(fmx)) return "";
  const parts: string[] = [];
  if (fmx.spouse !== false) parts.push("Spouse");
  if (typeof fmx.childrenUpTo === "number") parts.push(`children up to age ${fmx.childrenUpTo}`);
  if (typeof fmx.parentsFromAge === "number") parts.push(fmx.parentsFromAge > 0 ? `parents aged ${fmx.parentsFromAge}+` : "dependent parents");
  if (fmx.siblings === true) parts.push("siblings");
  return parts.join(", ");
}

// pdf-lib measures built-in fonts with kerning but draws them without it, so
// long strings come out wider than measured. Measure glyph by glyph instead.
const glyphCache = new WeakMap<PDFFont, Map<string, number>>();
function tw(font: PDFFont, text: string, size: number): number {
  let m = glyphCache.get(font);
  if (!m) { m = new Map(); glyphCache.set(font, m); }
  let w = 0;
  for (const ch of text) {
    let g = m.get(ch);
    if (g === undefined) { g = font.widthOfTextAtSize(ch, 1000); m.set(ch, g); }
    w += g;
  }
  return (w * size) / 1000;
}

/* ───────────────────────── layout engine ───────────────────────── */

const CURRENCY_WORD = /^[(\[]?(?:[A-Z]{3}|(?:US|S|A|AU|NZ|HK|CA|C)?\$|RM|\u20ac|\u00a3)$/;
function keepTogether(a: string, b: string): boolean {
  if (CURRENCY_WORD.test(a) && /^[$\u20ac\u00a3]?\d/.test(b)) return true;
  return /\d$/.test(a) && /^(million|billion|trillion)\b/i.test(b);
}

type Word = { segs: { text: string; font: PDFFont }[]; width: number };
type Line = { segs: { text: string; font: PDFFont }[]; width: number };

class Layout {
  pdf: PDFDocument;
  f: Fonts;
  page!: PDFPage;
  y = 0;
  contentPages: PDFPage[] = [];
  runningTitle = "";
  k: number; // spacing factor: 1 = normal, below 1 = slightly tighter
  endY = 0; // where the flowing content stopped on its last page

  constructor(pdf: PDFDocument, f: Fonts, k = 1) { this.pdf = pdf; this.f = f; this.k = k; }
  /** Line spacing, tightened a little when a tighter pass is needed. */
  lh(base: number) { return base * Math.max(0.92, this.k); }

  newPage() {
    this.page = this.pdf.addPage([W, H]);
    this.contentPages.push(this.page);
    this.y = H - TOP;
  }
  room() { return this.y - BOTTOM; }
  ensure(h: number) { if (!this.page || this.room() < h) this.newPage(); }
  gap(h: number) { this.y -= h * this.k; }

  fontFor(r: Run, base: "sans" | "serif" = "sans"): PDFFont {
    if (base === "serif") return r.bold ? this.f.serifBold : r.italic ? this.f.serifItal : this.f.serif;
    if (r.bold && r.italic) return this.f.boldItal;
    return r.bold ? this.f.bold : r.italic ? this.f.ital : this.f.reg;
  }

  /** Break styled text into lines no wider than maxW. */
  wrap(runs: Run[], size: number, maxW: number, opts: { forceBold?: boolean; base?: "sans" | "serif" } = {}): Line[] {
    const words: Word[] = [];
    let glue = false; // true when the next piece continues the current word
    for (const r of runs) {
      const font = opts.forceBold ? (opts.base === "serif" ? this.f.serifBold : this.f.bold) : this.fontFor(r, opts.base);
      const pieces = r.text.split(/(\s+)/);
      for (const p of pieces) {
        if (!p) continue;
        if (/^\s+$/.test(p)) { glue = false; continue; }
        const w = tw(font, p, size);
        if (glue && words.length) {
          const last = words[words.length - 1];
          last.segs.push({ text: p, font });
          last.width += w;
        } else {
          words.push({ segs: [{ text: p, font }], width: w });
        }
        glue = true;
      }
    }
    // Keep a currency with its amount ("USD 220,000") and a figure with its unit ("10 million") on one line.
    const joined: Word[] = [];
    for (const w of words) {
      const prev = joined[joined.length - 1];
      if (prev && keepTogether(prev.segs.map((x) => x.text).join(""), w.segs.map((x) => x.text).join(""))) {
        const last = prev.segs[prev.segs.length - 1];
        prev.width += tw(last.font, " ", size) + w.width;
        last.text += " ";
        if (last.font === w.segs[0].font) { last.text += w.segs[0].text; prev.segs.push(...w.segs.slice(1)); }
        else prev.segs.push(...w.segs);
      } else joined.push(w);
    }
    // Hard-split any single word that is wider than the line.
    const fitted: Word[] = [];
    for (const w of joined) {
      if (w.width <= maxW || w.segs.length !== 1) { fitted.push(w); continue; }
      const { text, font } = w.segs[0];
      let chunk = "";
      for (const ch of text) {
        if (tw(font, chunk + ch, size) > maxW && chunk) {
          fitted.push({ segs: [{ text: chunk, font }], width: tw(font, chunk, size) });
          chunk = ch;
        } else chunk += ch;
      }
      if (chunk) fitted.push({ segs: [{ text: chunk, font }], width: tw(font, chunk, size) });
    }
    const lines: Line[] = [];
    let cur: Line = { segs: [], width: 0 };
    for (const w of fitted) {
      const spaceFont = cur.segs.length ? cur.segs[cur.segs.length - 1].font : w.segs[0].font;
      const space = cur.segs.length ? tw(spaceFont, " ", size) : 0;
      if (cur.segs.length && cur.width + space + w.width > maxW) {
        lines.push(cur);
        cur = { segs: [], width: 0 };
      }
      if (cur.segs.length) {
        const lastSeg = cur.segs[cur.segs.length - 1];
        if (lastSeg.font === w.segs[0].font) {
          lastSeg.text += " " + w.segs[0].text;
          cur.segs.push(...w.segs.slice(1));
        } else {
          lastSeg.text += " ";
          cur.segs.push(...w.segs.map((s) => ({ ...s })));
        }
        cur.width += space + w.width;
      } else {
        cur.segs.push(...w.segs.map((s) => ({ ...s })));
        cur.width = w.width;
      }
    }
    if (cur.segs.length) lines.push(cur);
    return lines;
  }

  drawLine(page: PDFPage, line: Line, x: number, y: number, size: number, color: RGB) {
    let cx = x;
    for (const s of line.segs) {
      page.drawText(s.text, { x: cx, y, size, font: s.font, color });
      cx += tw(s.font, s.text, size);
    }
  }

  /** Flowing paragraph that may continue on the next page. */
  para(runs: Run[], o: { size?: number; lead?: number; color?: RGB; x?: number; width?: number; after?: number; forceBold?: boolean; base?: "sans" | "serif" } = {}) {
    const size = o.size ?? 9.4;
    const lead = this.lh(o.lead ?? size * 1.46);
    const x = o.x ?? MX;
    const width = o.width ?? CW - (x - MX);
    const lines = this.wrap(runs, size, width, { forceBold: o.forceBold, base: o.base });
    for (const ln of lines) {
      this.ensure(lead);
      this.y -= lead;
      this.drawLine(this.page, ln, x, this.y + lead * 0.28, size, o.color ?? C.text);
    }
    this.gap(o.after ?? 6);
  }

  text(t: string, o: Parameters<Layout["para"]>[1] = {}) { this.para([{ text: clean(t) }], o); }

  /** Letter-spaced capitals, used for small labels. */
  tracked(page: PDFPage, t: string, x: number, y: number, size: number, font: PDFFont, color: RGB, tracking = 1.2): number {
    let cx = x;
    for (const ch of clean(t).toUpperCase()) {
      page.drawText(ch, { x: cx, y, size, font, color });
      cx += tw(font, ch, size) + tracking;
    }
    return cx - x;
  }
  trackedWidth(t: string, size: number, font: PDFFont, tracking = 1.2): number {
    let w = 0;
    for (const ch of clean(t).toUpperCase()) w += tw(font, ch, size) + tracking;
    return w;
  }

  h2(title: string, keepWith = 36) {
    const lines = this.wrap([{ text: clean(title) }], 19, CW, { base: "serif" });
    const need = 26 + lines.length * 23 + keepWith;
    if (this.page && this.y < H - TOP - 4) this.gap(14);
    this.ensure(need);
    this.page.drawRectangle({ x: MX, y: this.y - 3, width: 30, height: 1.6, color: C.gold });
    this.gap(12);
    for (const ln of lines) {
      this.y -= 23;
      this.drawLine(this.page, ln, MX, this.y + 5, 19, C.ink);
    }
    this.gap(9);
  }

  h3(title: string) {
    const lines = this.wrap([{ text: clean(title) }], 11, CW, { forceBold: true });
    this.gap(4);
    this.ensure(lines.length * 15 + 30);
    for (const ln of lines) {
      this.y -= 15;
      this.drawLine(this.page, ln, MX, this.y + 4, 11, C.ink);
    }
    this.gap(5);
  }

  bullets(items: ListItem[], ordered = false, o: { size?: number; color?: RGB } = {}) {
    const size = o.size ?? 9.4;
    const lead = this.lh(size * 1.46);
    items.forEach((it, idx) => {
      const indent = 14 + it.level * 14;
      const x = MX + indent;
      const lines = this.wrap(it.runs, size, CW - indent);
      lines.forEach((ln, li) => {
        this.ensure(lead);
        this.y -= lead;
        if (li === 0) {
          if (ordered) {
            this.page.drawText(`${idx + 1}.`, { x: x - 14, y: this.y + lead * 0.28, size, font: this.f.bold, color: C.goldDark });
          } else {
            this.page.drawRectangle({ x: x - 10, y: this.y + lead * 0.28 + size * 0.22, width: 3.2, height: 3.2, color: it.level ? C.muted : C.gold });
          }
        }
        this.drawLine(this.page, ln, x, this.y + lead * 0.28, size, o.color ?? C.text);
      });
      this.gap(2.5);
    });
    this.gap(5);
  }

  quote(runs: Run[]) {
    const lines = this.wrap(runs, 9.6, CW - 16);
    const lead = 14.4;
    this.ensure(Math.min(lines.length, 3) * lead + 6);
    for (const ln of lines) {
      this.ensure(lead);
      this.y -= lead;
      this.page.drawRectangle({ x: MX, y: this.y - 1, width: 2, height: lead, color: C.gold });
      this.drawLine(this.page, ln, MX + 14, this.y + lead * 0.28, 9.6, C.text);
    }
    this.gap(8);
  }

  table(head: Run[][], rows: Run[][][]) {
    const cols = head.length;
    if (!cols) return;
    const size = 8.5;
    const lead = 11.6;
    const padX = 6;
    const padY = 5;
    const widthOf = (runs: Run[], bold: boolean) => tw((bold ? this.f.bold : this.f.reg), runsText(runs), size);
    const longestWord = (runs: Run[]) => {
      const units: string[] = [];
      for (const w of runsText(runs).split(/\s+/).filter(Boolean)) {
        if (units.length && keepTogether(units[units.length - 1], w)) units[units.length - 1] += " " + w;
        else units.push(w);
      }
      return Math.max(0, ...units.map((u) => tw(this.f.bold, u, size)));
    };
    const natural: number[] = [];
    const minw: number[] = [];
    for (let c = 0; c < cols; c++) {
      let nat = widthOf(head[c], true);
      let mn = longestWord(head[c]);
      for (const r of rows) {
        nat = Math.max(nat, widthOf(r[c] ?? [], false));
        mn = Math.max(mn, longestWord(r[c] ?? []));
      }
      natural.push(Math.min(nat, CW * 0.62) + padX * 2);
      minw.push(Math.min(Math.max(mn, 34), CW * 0.4) + padX * 2);
    }
    let widths: number[];
    const sumNat = natural.reduce((a, b) => a + b, 0);
    const sumMin = minw.reduce((a, b) => a + b, 0);
    if (sumNat <= CW) {
      widths = natural.map((n) => (n / sumNat) * CW);
    } else if (sumMin >= CW) {
      widths = minw.map((n) => (n / sumMin) * CW);
    } else {
      const spare = CW - sumMin;
      const want = natural.map((n, i) => Math.max(0, n - minw[i]));
      const sumWant = want.reduce((a, b) => a + b, 0) || 1;
      widths = minw.map((m, i) => m + (want[i] / sumWant) * spare);
    }
    const xs: number[] = [];
    widths.reduce((acc, w) => { xs.push(acc); return acc + w; }, MX);

    const drawRow = (cells: Run[][], header: boolean, shade: boolean) => {
      const wrapped = cells.map((c, i) => this.wrap(c, size, widths[i] - padX * 2, { forceBold: header }));
      const h = Math.max(1, ...wrapped.map((l) => l.length)) * lead + padY * 2;
      if (this.room() < h) {
        this.newPage();
        if (!header) drawRow(head, true, false);
      }
      const top = this.y;
      if (header) this.page.drawRectangle({ x: MX, y: top - h, width: CW, height: h, color: C.ink });
      else if (shade) this.page.drawRectangle({ x: MX, y: top - h, width: CW, height: h, color: C.zebra });
      wrapped.forEach((lines, i) => {
        lines.forEach((ln, li) => {
          this.drawLine(this.page, ln, xs[i] + padX, top - padY - (li + 1) * lead + lead * 0.27, size, header ? C.white : C.text);
        });
      });
      if (!header) this.page.drawLine({ start: { x: MX, y: top - h }, end: { x: MX + CW, y: top - h }, thickness: 0.5, color: C.line });
      this.y = top - h;
    };

    this.ensure(70);
    drawRow(head, true, false);
    rows.forEach((r, i) => drawRow(Array.from({ length: cols }, (_, k) => r[k] ?? []), false, i % 2 === 1));
    this.gap(12);
  }

  /** Label / value grid in a tinted panel. */
  facts(pairs: [string, string][]) {
    const items = pairs.filter(([, v]) => v);
    if (!items.length) return;
    const colW = (CW - 18) / 2;
    const padX = 14;
    const rowsData: { label: string; lines: Line[] }[][] = [];
    for (let i = 0; i < items.length; i += 2) {
      rowsData.push(items.slice(i, i + 2).map(([label, value]) => ({ label, lines: this.wrap(parseInline(value), 10, colW - padX, { forceBold: true }) })));
    }
    for (const row of rowsData) {
      const h = Math.max(...row.map((c) => c.lines.length)) * 13.5 + 30;
      this.ensure(h + 4);
      const top = this.y;
      this.page.drawRectangle({ x: MX, y: top - h, width: CW, height: h, color: C.cream });
      this.page.drawRectangle({ x: MX, y: top - 1, width: CW, height: 1, color: C.line });
      row.forEach((cell, ci) => {
        const x = MX + padX + ci * (colW + 18);
        this.tracked(this.page, cell.label, x, top - 15, 6.6, this.f.bold, C.goldDark, 0.9);
        cell.lines.forEach((ln, li) => this.drawLine(this.page, ln, x, top - 30 - li * 13.5, 10, C.ink));
      });
      this.y = top - h;
    }
    this.gap(16);
  }

  steps(steps: { title: string; description?: string }[]) {
    steps.forEach((s, i) => {
      const x = MX + 32;
      const tl = this.wrap([{ text: clean(s.title) }], 10.2, CW - 32, { forceBold: true });
      const dl = s.description ? this.wrap(parseInline(s.description), 9.4, CW - 32) : [];
      const h = Math.max(26, tl.length * 14 + dl.length * 13.6 + 10);
      this.ensure(h);
      const top = this.y;
      this.page.drawCircle({ x: MX + 10, y: top - 11, size: 10, color: C.gold });
      const n = String(i + 1);
      this.page.drawText(n, { x: MX + 10 - tw(this.f.bold, n, 9) / 2, y: top - 14.2, size: 9, font: this.f.bold, color: C.navy });
      let yy = top;
      tl.forEach((ln) => { yy -= 14; this.drawLine(this.page, ln, x, yy + 3.6, 10.2, C.ink); });
      dl.forEach((ln) => { yy -= 13.6; this.drawLine(this.page, ln, x, yy + 3.6, 9.4, C.text); });
      this.y = top - h;
    });
    this.gap(8);
  }

  blocks(blocks: Block[]) {
    for (const b of blocks) {
      if (b.t === "h2") this.h2(b.text);
      else if (b.t === "h3") this.h3(b.text);
      else if (b.t === "p") this.para(b.runs);
      else if (b.t === "ul") this.bullets(b.items);
      else if (b.t === "ol") this.bullets(b.items, true);
      else if (b.t === "table") this.table(b.head, b.rows);
      else if (b.t === "quote") this.quote(b.runs);
    }
  }

  list(items: string[]) {
    this.bullets(items.map((t) => ({ runs: parseInline(t), level: 0 })));
  }
}

/* ───────────────────────── cover and closing pages ───────────────────────── */

function drawCover(L: Layout, pdf: PDFDocument, a: {
  eyebrow: string; kicker: string; title: string; tagline: string; stats: [string, string][]; updated: string; site: SiteInfo;
  photo?: PDFImage; logo?: PDFImage;
}) {
  const page = pdf.addPage([W, H]);
  const f = L.f;
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.navy });
  const photoH = H * 0.5;
  if (a.photo) {
    page.drawImage(a.photo, { x: 0, y: H - photoH, width: W, height: photoH });
  } else {
    page.drawRectangle({ x: 0, y: H - photoH, width: W, height: photoH, color: C.navy2 });
    page.drawRectangle({ x: MX, y: H - photoH + 40, width: W - MX * 2, height: 0.8, color: C.gold, opacity: 0.5 });
  }
  if (a.logo) {
    const lw = 132;
    const lh = (a.logo.height / a.logo.width) * lw;
    page.drawImage(a.logo, { x: MX - 4, y: H - 44 - lh, width: lw, height: lh });
  } else {
    page.drawText("XIPHIAS Immigration", { x: MX, y: H - 70, size: 20, font: f.serif, color: C.white });
  }
  const kw = L.trackedWidth(a.kicker, 7.4, f.bold, 1.6);
  L.tracked(page, a.kicker, W - MX - kw, H - 66, 7.4, f.bold, C.gold, 1.6);

  let y = H - photoH - 20;
  page.drawRectangle({ x: MX, y: y + 4, width: 34, height: 1.6, color: C.gold });
  L.tracked(page, a.eyebrow, MX + 44, y, 8, f.bold, C.gold, 1.5);
  y -= 22;

  // Key figures along the bottom
  const stats = a.stats.filter(([, v]) => v).slice(0, 4);
  const floor = stats.length ? 196 : 92; // lowest point the title block may reach
  const tagLines = a.tagline ? L.wrap(parseInline(a.tagline), 11, CW * 0.9).slice(0, 5) : [];
  const tagH = tagLines.length ? 18 + tagLines.length * 16.5 : 0;
  let size = 38;
  let lines = L.wrap([{ text: clean(a.title) }], size, CW, { base: "serif" });
  while (size > 20 && (lines.length > 3 || y - lines.length * size * 1.1 - tagH < floor)) {
    size -= 2;
    lines = L.wrap([{ text: clean(a.title) }], size, CW, { base: "serif" });
  }
  for (const ln of lines) { y -= size * 1.1; L.drawLine(page, ln, MX, y, size, C.white); }
  y -= 18;
  for (const ln of tagLines) { y -= 16.5; L.drawLine(page, ln, MX, y + 4, 11, C.soft); }

  if (stats.length) {
    const baseY = 112;
    const colW = CW / stats.length;
    page.drawRectangle({ x: MX, y: baseY + 62, width: CW, height: 0.6, color: C.gold, opacity: 0.55 });
    stats.forEach(([label, value], i) => {
      const x = MX + i * colW;
      if (i) page.drawRectangle({ x: x - 10, y: baseY + 4, width: 0.6, height: 46, color: C.gold, opacity: 0.4 });
      L.tracked(page, label, x, baseY + 42, 6.6, f.bold, C.gold, 1.1);
      let vs = 15;
      let vl = L.wrap([{ text: clean(value) }], vs, colW - 18, { base: "serif" });
      while (vl.length > 2 && vs > 9.5) { vs -= 1; vl = L.wrap([{ text: clean(value) }], vs, colW - 18, { base: "serif" }); }
      vl.slice(0, 3).forEach((ln, li) => L.drawLine(page, ln, x, baseY + 22 - li * (vs + 2.5), vs, C.white));
    });
  }

  page.drawRectangle({ x: MX, y: 62, width: CW, height: 0.6, color: C.gold, opacity: 0.55 });
  page.drawText(clean(a.site.company), { x: MX, y: 44, size: 8.4, font: f.bold, color: C.white });
  page.drawText(clean(a.site.website), { x: MX, y: 31, size: 8, font: f.reg, color: C.soft });
  if (a.updated) {
    const t = clean(`Updated ${a.updated}`);
    page.drawText(t, { x: W - MX - tw(f.reg, t, 8), y: 44, size: 8, font: f.reg, color: C.soft });
  }
  const c = clean(`${a.site.phone}  |  ${a.site.email}`);
  page.drawText(c, { x: W - MX - tw(f.reg, c, 8), y: 31, size: 8, font: f.reg, color: C.soft });
}

function drawClosing(L: Layout, pdf: PDFDocument, a: { heading: string; lead: string; site: SiteInfo; note: string; banner?: PDFImage; logo?: PDFImage }) {
  const page = pdf.addPage([W, H]);
  const f = L.f;
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.navy });
  const bannerH = 250;
  if (a.banner) {
    page.drawImage(a.banner, { x: 0, y: H - bannerH, width: W, height: bannerH });
  }
  if (a.logo) {
    const lw = 128;
    const lh = (a.logo.height / a.logo.width) * lw;
    page.drawImage(a.logo, { x: MX - 4, y: H - 42 - lh, width: lw, height: lh });
  }
  let y = H - bannerH - 26;
  page.drawRectangle({ x: MX, y: y + 4, width: 34, height: 1.6, color: C.gold });
  L.tracked(page, "Next step", MX + 44, y, 8, f.bold, C.gold, 1.5);
  y -= 16;
  for (const ln of L.wrap([{ text: clean(a.heading) }], 30, CW, { base: "serif" })) { y -= 34; L.drawLine(page, ln, MX, y, 30, C.white); }
  y -= 12;
  for (const ln of L.wrap(parseInline(a.lead), 10.6, CW * 0.9)) { y -= 16; L.drawLine(page, ln, MX, y + 4, 10.6, C.soft); }
  y -= 26;

  const rows: [string, string][] = [
    ["Call or WhatsApp", a.site.phone],
    ["Email", a.site.email],
    ["Website", a.site.website],
    ["Office", a.site.office],
  ];
  for (const [label, value] of rows) {
    page.drawRectangle({ x: MX, y: y + 12, width: CW, height: 0.5, color: C.gold, opacity: 0.35 });
    L.tracked(page, label, MX, y - 6, 7, f.bold, C.gold, 1.2);
    const vl = L.wrap([{ text: clean(value) }], 12.5, CW - 150, { base: "serif" });
    vl.forEach((ln, i) => L.drawLine(page, ln, MX + 150, y - 8 - i * 15, 12.5, C.white));
    y -= 22 + vl.length * 15;
  }
  page.drawRectangle({ x: MX, y: y + 12, width: CW, height: 0.5, color: C.gold, opacity: 0.35 });
  y -= 18;

  if (a.site.credentials.length) {
    L.tracked(page, "Credentials", MX, y, 7, f.bold, C.gold, 1.2);
    y -= 8;
    for (const c of a.site.credentials) {
      for (const [i, ln] of L.wrap(parseInline(c), 9.4, CW - 14).entries()) {
        y -= 14;
        if (i === 0) page.drawRectangle({ x: MX, y: y + 6, width: 3.2, height: 3.2, color: C.gold });
        L.drawLine(page, ln, MX + 12, y + 3.6, 9.4, C.soft);
      }
      y -= 2;
    }
  }

  const note = L.wrap(parseInline(a.note), 7.6, CW);
  let ny = 44 + note.length * 10.6;
  page.drawRectangle({ x: MX, y: ny + 8, width: CW, height: 0.5, color: C.gold, opacity: 0.35 });
  for (const ln of note) { ny -= 10.6; L.drawLine(page, ln, MX, ny, 7.6, hex("9aa6bd")); }
}

function finishPages(L: Layout, pdf: PDFDocument, site: SiteInfo) {
  const total = pdf.getPageCount();
  const f = L.f;
  L.contentPages.forEach((page) => {
    const index = pdf.getPages().indexOf(page) + 1;
    L.tracked(page, "XIPHIAS Immigration", MX, H - 40, 7.2, f.bold, C.ink, 1.4);
    let title = clean(L.runningTitle);
    while (title.length > 8 && tw(f.reg, title, 8) > CW * 0.55) title = title.slice(0, -2);
    if (title !== clean(L.runningTitle)) title = title.trimEnd() + "...";
    page.drawText(title, { x: W - MX - tw(f.reg, title, 8), y: H - 40, size: 8, font: f.reg, color: C.muted });
    page.drawRectangle({ x: MX, y: H - 50, width: CW, height: 0.8, color: C.gold });
    page.drawRectangle({ x: MX, y: 44, width: CW, height: 0.5, color: C.line });
    const foot = clean(`${site.website}   |   ${site.phone}   |   ${site.email}`);
    page.drawText(foot, { x: MX, y: 30, size: 7.4, font: f.reg, color: C.muted });
    const pn = `Page ${index} of ${total}`;
    page.drawText(pn, { x: W - MX - tw(f.reg, pn, 7.4), y: 30, size: 7.4, font: f.reg, color: C.muted });
  });
}

/* ───────────────────────── content assembly ───────────────────────── */

const SKIP_SECTION = /^(talk to|speak to|contact|book a|get in touch)\b/i;
const SOURCES = /^(official )?sources?( and references)?$/i;

function bodyParts(body: string) {
  const { intro, sections } = toSections(parseBlocks(body));
  // The first line of a page is a local italic strap line; it is not part of the brochure.
  const cleanIntro = intro.filter((b, i) => !(i === 0 && b.t === "p" && b.runs.every((r) => r.italic)));
  const sources = sections.find((s) => SOURCES.test(s.title));
  const kept = sections.filter((s) => !SKIP_SECTION.test(s.title) && !SOURCES.test(s.title) && s.blocks.length);
  const headings = [
    ...kept.map((s) => s.title),
    ...[...cleanIntro, ...kept.flatMap((s) => s.blocks)].flatMap((b) => (b.t === "h3" || b.t === "h2" ? [b.text] : [])),
  ];
  return { intro: cleanIntro, sections: kept, sources, headings };
}

function sourceNames(sec?: { blocks: Block[] }): string[] {
  if (!sec) return [];
  const names: string[] = [];
  for (const b of sec.blocks) {
    if (b.t === "ul" || b.t === "ol") for (const it of b.items) names.push(runsText(it.runs).trim());
  }
  return names.filter(Boolean).slice(0, 12);
}

function stepList(v: unknown): { title: string; description?: string }[] {
  return arr(v)
    .map((s) => (isObj(s) ? { title: str(s.title) || str(s.step) || str(s.name), description: str(s.description) || str(s.detail) } : { title: str(s) }))
    .filter((s) => s.title);
}

function faqList(v: unknown): { q: string; a: string }[] {
  return arr(v)
    .map((x) => (isObj(x) ? { q: str(x.q) || str(x.question), a: str(x.a) || str(x.answer) } : { q: "", a: "" }))
    .filter((x) => x.q && x.a);
}

function drawFaq(L: Layout, faq: { q: string; a: string }[]) {
  if (!faq.length) return;
  L.h2("Questions clients ask");
  faq.slice(0, 8).forEach((x) => {
    const ql = L.wrap([{ text: clean(x.q) }], 10.2, CW, { forceBold: true });
    L.ensure(ql.length * 14.4 + 34);
    ql.forEach((ln) => { L.y -= 14.4; L.drawLine(L.page, ln, MX, L.y + 4, 10.2, C.ink); });
    L.gap(2);
    L.para(parseInline(x.a), { after: 9 });
  });
}

function drawSources(L: Layout, names: string[]) {
  if (!names.length) return;
  // Kept small and in one block so it never strands a heading on a new page.
  L.gap(8);
  L.ensure(58);
  L.page.drawRectangle({ x: MX, y: L.y, width: CW, height: 0.5, color: C.line });
  L.gap(6);
  L.para([{ text: "Official sources: ", bold: true }, { text: clean(names.join("; ") + ".") }], { size: 7.8, lead: 11.2, color: C.muted, after: 4 });
}

function closingNote(pageUrl: string, updated: string, boundary: string): string {
  const when = updated ? ` as at ${updated}` : "";
  return `This brochure is produced from the programme information published at ${pageUrl}${when}. Rules, fees and processing times are set by the relevant government and can change, and approval is always the authority's decision. Please confirm the current position with us before you apply. ${boundary}`;
}

function composeProgramme(L: Layout, pdf: PDFDocument, input: BrochureInput, img: { cover?: PDFImage; banner?: PDFImage; logo?: PDFImage }, pageUrl: string) {
  const fm = input.fm;
  const cur = str(fm.currency);
  const title = str(fm.title) || "Programme";
  const country = str(fm.country);
  const vLabel = VERTICAL_LABEL[input.vertical];
  const updated = niceDate(fm.lastUpdated ?? fm.updatedAt);
  const minInv = typeof fm.minInvestment === "number" && fm.minInvestment > 0 ? money(fm.minInvestment, cur) : "";
  const timeline = str(fm.timelineLabel) || months(fm.timelineMonths);
  const hold = months(fm.holdingPeriodMonths);
  const family = familyLine(fm.familyMatrix);
  const lang = isObj(fm.language) ? str(fm.language.minLevel) : "";
  const jobOffer = typeof fm.jobOfferRequired === "boolean" ? (fm.jobOfferRequired ? "Required" : "Not required") : "";
  const points = typeof fm.pointsThreshold === "number" ? String(fm.pointsThreshold) : "";
  const snap = isObj(fm.snapshot) ? fm.snapshot : {};

  const coverStats: [string, string][] = [
    ["Investment from", minInv],
    ["Timeline", timeline.length <= 44 ? timeline : ""],
    ["Holding period", hold],
    ["Points threshold", points],
    ["Job offer", jobOffer],
    ["Family", family.length <= 44 ? family : ""],
  ];
  L.runningTitle = title;
  drawCover(L, pdf, {
    eyebrow: `${vLabel}  |  ${country}`, kicker: "Programme brochure", title, tagline: str(fm.tagline), stats: coverStats, updated, site: input.site,
    photo: img.cover, logo: img.logo,
  });

  const { intro, sections, sources, headings } = bodyParts(input.body);
  const has = (re: RegExp) => headings.some((h) => re.test(h));

  L.newPage();
  L.h2("At a glance");
  L.facts([
    ["Country", country],
    ["Route", [vLabel, str(fm.routeType) ? humanise(str(fm.routeType)) : ""].filter(Boolean).join(" - ")],
    ["Minimum investment", minInv],
    ["Timeline", timeline],
    ["Holding period", hold],
    ["Family members", family],
    ["Language", lang],
    ["Job offer", jobOffer],
    ["Points threshold", points],
    ["Company structure", str(snap.structure)],
    ["Ownership", str(snap.ownership)],
    ["Office", str(snap.office)],
    ["Visa quota", str(snap.visaQuota)],
    ["Bank account", str(snap.bankReady)],
    ["Last updated", updated],
  ]);

  if (intro.length) L.blocks(intro);
  for (const s of sections) { L.h2(s.title); L.blocks(s.blocks); }

  const benefits = strList(fm.benefits);
  if (benefits.length && !has(/benefit|highlight|advantage|why choose/i)) { L.h2("Key benefits"); L.list(benefits); }

  const reqs = strList(fm.requirements);
  const disq = strList(fm.disqualifiers);
  if ((reqs.length || disq.length) && !has(/^requirements?$|eligib|who qualifies|who can apply/i)) {
    L.h2("Requirements");
    if (reqs.length) L.list(reqs);
    if (disq.length) { L.h3("When this route may not fit"); L.list(disq); }
  } else if (disq.length) {
    L.h2("When this route may not fit");
    L.list(disq);
  }

  // Skilled-migration detail
  const langObj = isObj(fm.language) ? fm.language : null;
  const grid = arr(fm.pointsGrid).filter(isObj);
  const occ = arr(fm.occupationLists).filter(isObj);
  if ((langObj || grid.length || occ.length || str(fm.jobOfferNote)) && input.vertical === "skilled") {
    L.h2("Skills, language and points");
    if (langObj) {
      const tests = strList(langObj.tests).join(", ");
      L.facts([["Accepted tests", tests], ["Minimum level", str(langObj.minLevel)]]);
    }
    if (str(fm.jobOfferNote)) L.para(parseInline(`**Job offer:** ${str(fm.jobOfferNote)}`));
    if (grid.length) {
      L.table([[{ text: "Points factor" }], [{ text: "Maximum" }], [{ text: "Notes" }]],
        grid.map((g) => [parseInline(str(g.category)), [{ text: clean(str(g.max)) }], parseInline(str(g.notes))]));
    }
    for (const o of occ) {
      const names = strList(o.occupations);
      if (!names.length) continue;
      L.h3(str(o.listName) || "Eligible occupations");
      L.list(names.slice(0, 24));
    }
  }

  // Corporate detail
  const spons = isObj(fm.sponsorship) ? fm.sponsorship : null;
  if (spons && !has(/assess|threshold|salary|sponsor/i)) {
    const th = arr(spons.thresholds).filter(isObj);
    L.h2(str(spons.title) || "Thresholds");
    if (th.length) {
      L.table([[{ text: "Threshold" }], [{ text: "Amount" }], [{ text: "Notes" }]],
        th.map((t) => [parseInline(str(t.level)), [{ text: clean(money(t.amount, t.currency ?? cur)) }], parseInline(str(t.note))]));
    }
    const notes = strList(spons.notes);
    if (notes.length) L.list(notes);
  }

  // Costs
  const prices = arr(fm.prices).filter(isObj);
  const gov = arr(fm.governmentFees).filter(isObj);
  const pof = arr(fm.proofOfFunds).filter(isObj);
  const costCovered = has(/\b(fees?|costs?|prices?|pricing)\b|what you (actually )?pay/i);
  if ((prices.length || gov.length) && !costCovered) {
    L.h2("Costs and government fees");
    if (prices.length) {
      L.h3("Programme costs");
      L.table([[{ text: "Item" }], [{ text: "Amount" }], [{ text: "Notes" }]],
        prices.map((p) => [parseInline(str(p.label)), [{ text: clean(money(p.amount, p.currency ?? cur)) }], parseInline([str(p.when), str(p.notes)].filter(Boolean).join(". "))]));
    }
    if (gov.length) {
      L.h3("Government fees");
      L.table([[{ text: "Fee" }], [{ text: "Amount" }], [{ text: "Notes" }]],
        gov.map((g) => [parseInline(str(g.label)), [{ text: clean(money(g.amount, g.currency ?? cur)) }], parseInline(str(g.notes))]));
    }
  }
  if (pof.length && !has(/proof of funds|settlement funds|funds you need/i)) {
    L.h2("Funds to show");
    L.table([[{ text: "Requirement" }], [{ text: "Amount" }], [{ text: "Notes" }]],
      pof.map((p) => [parseInline(str(p.label)), [{ text: clean(money(p.amount, p.currency ?? cur)) }], parseInline(str(p.notes))]));
  }

  const projects = arr(fm.projectList).filter(isObj).filter((p) => str(p.name));
  if (projects.length) {
    L.h2("Qualifying investments");
    L.table([[{ text: "Option" }], [{ text: "Minimum" }], [{ text: "Hold" }], [{ text: "Notes" }]],
      projects.map((p) => [parseInline(str(p.name)), [{ text: clean(typeof p.minBuyIn === "number" ? money(p.minBuyIn, cur) : "") }], [{ text: clean(months(p.holdMonths)) }], parseInline(str(p.notes))]));
  }

  const steps = stepList(fm.processSteps ?? fm.procesSteps ?? fm.applicationProcess);
  if (steps.length && !has(/^process$|how the (route|application|process) |application process|step by step/i)) {
    L.h2("How the process works");
    L.steps(steps);
  }

  const post = isObj(fm.postSetup) ? fm.postSetup : null;
  if (post && strList(post.items).length) { L.h2(str(post.title) || "After approval"); L.list(strList(post.items)); }

  const docs = arr(fm.documentChecklist).filter(isObj);
  if (docs.length && !has(/document|checklist/i)) {
    L.h2("Document checklist");
    for (const g of docs) {
      const items = strList(g.documents);
      if (!items.length) continue;
      if (str(g.group)) L.h3(str(g.group));
      L.list(items);
    }
  }

  drawFaq(L, faqList(fm.faq));

  const risks = strList(fm.riskNotes ?? fm.risknotes);
  const comp = strList(fm.complianceNotes);
  const showRisks = risks.length && !has(/risk/i);
  if (showRisks || comp.length) {
    L.h2("Important notes");
    if (showRisks) L.list(risks);
    if (comp.length) { if (showRisks) L.h3("Compliance"); L.list(comp); }
  }

  const src = sourceNames(sources);
  drawSources(L, src);

  L.endY = L.y;
  drawClosing(L, pdf, {
    heading: `Plan your ${country} application with our Dubai team`,
    lead: `Tell us about your profile, family and timeline. We will confirm whether **${title}** fits, set out the full cost in writing and manage the application with you from start to finish.`,
    site: input.site, note: closingNote(pageUrl, updated, input.site.boundary), banner: img.banner, logo: img.logo,
  });
}

async function composeCountry(L: Layout, pdf: PDFDocument, input: BrochureInput, img: { cover?: PDFImage; banner?: PDFImage; logo?: PDFImage }, pageUrl: string) {
  const fm = input.fm;
  const country = str(fm.country) || "Country";
  const vLabel = VERTICAL_LABEL[input.vertical];
  const updated = niceDate(fm.lastUpdated ?? fm.updatedAt);
  const facts = isObj(fm.facts) ? fm.facts : {};
  const fact = (k: string) => str(facts[k] ?? facts[k.charAt(0).toUpperCase() + k.slice(1)]);
  const progs = input.programmes ?? [];
  const title = `${country} ${vLabel}`;
  const population = (() => {
    const p = facts.population ?? facts.Population;
    return typeof p === "number" ? p.toLocaleString("en-US") : str(p);
  })();

  L.runningTitle = title;
  drawCover(L, pdf, {
    eyebrow: `${vLabel}  |  Country guide`, kicker: "Country brochure", title,
    tagline: str(fm.tagline) || str(fm.summary),
    stats: [
      ["Programmes", progs.length ? String(progs.length) : ""],
      ["Visa-free destinations", typeof fm.visaFreeCount === "number" && input.vertical === "citizenship" ? String(fm.visaFreeCount) : ""],
      ["Capital", fact("capital")],
      ["Currency", fact("currency")],
      ["Language", fact("language").length <= 30 ? fact("language") : ""],
    ],
    updated, site: input.site, photo: img.cover, logo: img.logo,
  });

  L.newPage();
  L.h2(`${country} at a glance`);
  L.facts([
    ["Capital", fact("capital")],
    ["Population", population],
    ["Language", fact("language")],
    ["Currency", fact("currency")],
    ["Time zone", fact("timeZone")],
    ["Climate", fact("climate")],
    ["Programmes we advise on", progs.length ? String(progs.length) : ""],
    ["Last updated", updated],
  ]);

  const overview = str(fm.overview);
  if (overview) { L.h2("Overview"); L.blocks(parseBlocks(overview)); }
  const keyPoints = strList(fm.keyPoints).length ? strList(fm.keyPoints) : strList(fm.introPoints);
  if (keyPoints.length) { L.h2("Key points"); L.list(keyPoints); }

  if (progs.length) {
    L.h2(`Programmes in ${country}`, 190);
    const gutter = 16;
    const cardW = (CW - gutter) / 2;
    const thumbH = 74;
    const pad = 11;
    const thumbs = await Promise.all(progs.map(async (p) => (p.thumb ? pdf.embedJpg(p.thumb).catch(() => undefined) : undefined)));
    for (let i = 0; i < progs.length; i += 2) {
      const pair = progs.slice(i, i + 2);
      const laid = pair.map((p) => {
        const tl = L.wrap([{ text: clean(p.title) }], 11.6, cardW - pad * 2, { base: "serif", forceBold: true });
        const dl = p.tagline ? L.wrap(parseInline(p.tagline), 8.4, cardW - pad * 2).slice(0, 5) : [];
        const meta = [p.from ? `From ${p.from}` : "", p.timeline ?? ""].filter(Boolean).join("   |   ");
        const ml = meta ? L.wrap([{ text: clean(meta) }], 7.8, cardW - pad * 2, { forceBold: true }).slice(0, 2) : [];
        return { tl, dl, ml };
      });
      const h = thumbH + pad + Math.max(...laid.map((c) => c.tl.length * 14.4 + c.dl.length * 11.8 + (c.ml.length ? c.ml.length * 11 + 8 : 0))) + pad;
      L.ensure(h + 12);
      const top = L.y;
      pair.forEach((p, k) => {
        if (!p) return;
        const x = MX + k * (cardW + gutter);
        const c = laid[k];
        L.page.drawRectangle({ x, y: top - h, width: cardW, height: h, color: C.cream });
        const th = thumbs[i + k];
        if (th) L.page.drawImage(th, { x, y: top - thumbH, width: cardW, height: thumbH });
        else L.page.drawRectangle({ x, y: top - thumbH, width: cardW, height: thumbH, color: C.navy2 });
        L.page.drawRectangle({ x, y: top - thumbH - 1.4, width: cardW, height: 1.4, color: C.gold });
        let yy = top - thumbH - pad + 2;
        c.tl.forEach((ln) => { yy -= 14.4; L.drawLine(L.page, ln, x + pad, yy + 3, 11.6, C.ink); });
        yy -= 2;
        c.dl.forEach((ln) => { yy -= 11.8; L.drawLine(L.page, ln, x + pad, yy + 3, 8.4, C.text); });
        if (c.ml.length) { yy -= 6; c.ml.forEach((ln) => { yy -= 11; L.drawLine(L.page, ln, x + pad, yy + 3, 7.8, C.goldDark); }); }
      });
      L.y = top - h;
      L.gap(14);
    }
  }

  const { intro, sections, sources } = bodyParts(input.body);
  if (intro.length) L.blocks(intro);
  for (const s of sections) { L.h2(s.title); L.blocks(s.blocks); }

  const steps = stepList(fm.applicationProcess);
  if (steps.length) { L.h2("How the application works"); L.steps(steps); }
  const reqs = strList(fm.requirements);
  if (reqs.length) { L.h2("General requirements"); L.list(reqs); }
  const sectors = strList(fm.demandSectors);
  if (sectors.length) { L.h2("Sectors in demand"); L.list(sectors); }

  drawFaq(L, faqList(fm.faq));

  const src = sourceNames(sources);
  drawSources(L, src);

  L.endY = L.y;
  drawClosing(L, pdf, {
    heading: `Discuss your ${country} options with our Dubai team`,
    lead: `Tell us about your profile, family and timeline. We will compare the ${country} routes that fit you, set out the full cost in writing and manage the application with you from start to finish.`,
    site: input.site, note: closingNote(pageUrl, updated, input.site.boundary), banner: img.banner, logo: img.logo,
  });
}

/* ───────────────────────── entry point ───────────────────────── */

async function render(input: BrochureInput, pageUrl: string, k: number): Promise<{ bytes: Uint8Array; strandedLines: boolean }> {
  const pdf = await PDFDocument.create();
  const f: Fonts = {
    reg: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    ital: await pdf.embedFont(StandardFonts.HelveticaOblique),
    boldItal: await pdf.embedFont(StandardFonts.HelveticaBoldOblique),
    serif: await pdf.embedFont(StandardFonts.TimesRoman),
    serifBold: await pdf.embedFont(StandardFonts.TimesRomanBold),
    serifItal: await pdf.embedFont(StandardFonts.TimesRomanItalic),
  };
  const embed = async (bytes: Uint8Array | undefined, kind: "jpg" | "png") => {
    if (!bytes) return undefined;
    try { return kind === "jpg" ? await pdf.embedJpg(bytes) : await pdf.embedPng(bytes); } catch { return undefined; }
  };
  const img = { cover: await embed(input.cover, "jpg"), banner: await embed(input.banner, "jpg"), logo: await embed(input.logo, "png") };
  const L = new Layout(pdf, f, k);

  if (input.kind === "programme") composeProgramme(L, pdf, input, img, pageUrl);
  else await composeCountry(L, pdf, input, img, pageUrl);
  finishPages(L, pdf, input.site);

  const title = input.kind === "programme" ? plain(str(input.fm.title)) : `${plain(str(input.fm.country))} ${VERTICAL_LABEL[input.vertical]}`;
  pdf.setTitle(clean(`${title} - ${input.site.company}`));
  pdf.setAuthor(clean(input.site.company));
  pdf.setSubject(clean(`${VERTICAL_LABEL[input.vertical]} brochure`));
  pdf.setCreator(clean(input.site.website));
  // "Stranded" = the last inside page holds only a few lines.
  const used = H - TOP - L.endY;
  return { bytes: await pdf.save(), strandedLines: L.contentPages.length > 1 && used < 130 };
}

export async function buildBrochure(input: BrochureInput, pageUrl: string): Promise<Uint8Array> {
  // If a few lines spill onto an otherwise empty page, lay the brochure out
  // again slightly tighter so they fit on the page before.
  let out = await render(input, pageUrl, 1);
  for (const k of [0.93, 0.86]) {
    if (!out.strandedLines) break;
    const next = await render(input, pageUrl, k);
    out = next;
  }
  return out.bytes;
}
