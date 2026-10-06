// Small Markdown reader for the brochure builder.
// It understands what the programme and country pages actually use:
// headings, paragraphs, bold/italic, links (text only), bullet and numbered
// lists, tables and block quotes.

export type Run = { text: string; bold?: boolean; italic?: boolean };
export type ListItem = { runs: Run[]; level: number };
export type Block =
  | { t: "h2"; text: string }
  | { t: "h3"; text: string }
  | { t: "p"; runs: Run[] }
  | { t: "ul"; items: ListItem[] }
  | { t: "ol"; items: ListItem[] }
  | { t: "table"; head: Run[][]; rows: Run[][][] }
  | { t: "quote"; runs: Run[] };

export type Section = { title: string; blocks: Block[] };

/* ───────────────────────── text clean-up ───────────────────────── */

// The built-in PDF fonts only cover the Windows-1252 character set.
const CP1252_EXTRA = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ";

const REPLACE: Record<string, string> = {
  " ": " ", " ": " ", " ": " ", " ": " ", "​": "", "﻿": "", "­": "",
  "‑": "-", "‐": "-", "‒": "-", "―": "—", "−": "-",
  "≥": ">=", "≤": "<=", "≈": "approx. ", "→": " to ", "←": " from ", "⇒": " to ", "↔": " and ",
  "✓": "Yes", "✔": "Yes", "✗": "No", "✘": "No", "★": "*", "₹": "INR ", "′": "'", "″": '"',
  "ı": "i", "İ": "I", "ğ": "g", "Ğ": "G", "ş": "s", "Ş": "S", "ł": "l", "Ł": "L", "đ": "d", "Đ": "D",
  "₀": "0", "₁": "1", "₂": "2", "₃": "3",
};

const CYRILLIC: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sht",
  ъ: "a", ы: "y", ь: "", э: "e", ю: "yu", я: "ya", ё: "e",
};

function encodable(ch: string): boolean {
  const c = ch.charCodeAt(0);
  return (c >= 0x20 && c <= 0x7e) || (c >= 0xa0 && c <= 0xff) || CP1252_EXTRA.includes(ch);
}

/** Make any string safe for the built-in PDF fonts without losing meaning. */
export function clean(input: unknown): string {
  const src = String(input ?? "");
  let out = "";
  for (const ch of src) {
    if (ch === "\n" || ch === "\t" || ch === "\r") { out += " "; continue; }
    if (encodable(ch)) { out += ch; continue; }
    if (ch in REPLACE) { out += REPLACE[ch]; continue; }
    const lower = ch.toLowerCase();
    if (lower in CYRILLIC) {
      const tr = CYRILLIC[lower];
      out += ch === lower ? tr : tr.charAt(0).toUpperCase() + tr.slice(1);
      continue;
    }
    const base = ch.normalize("NFKD").replace(/[̀-ͯ]/g, "");
    if (base && [...base].every(encodable)) { out += base; continue; }
    // Anything else (emoji, rare symbols) is dropped.
  }
  return out.replace(/ {2,}/g, " ");
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&", "&nbsp;": " ", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&apos;": "'",
  "&mdash;": "—", "&ndash;": "–", "&rsquo;": "’", "&lsquo;": "‘", "&ldquo;": "“", "&rdquo;": "”",
};

function stripInlineSyntax(src: string): string {
  return src
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\(\s*[^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/?[A-Za-z][^>]*>/g, "")
    .replace(/&[a-z#0-9]+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m)
    .replace(/\\([*_|#>\-[\]()`.!+{}])/g, "$1");
}

/** Inline Markdown → styled runs. Handles bold inside italic and the reverse. */
export function parseInline(src: string): Run[] {
  const s = stripInlineSyntax(src);
  const runs: Run[] = [];
  let buf = "";
  let bold = false;
  let italic = false;
  const flush = () => {
    const t = clean(buf);
    if (t) runs.push({ text: t, ...(bold ? { bold: true } : {}), ...(italic ? { italic: true } : {}) });
    buf = "";
  };
  for (let i = 0; i < s.length; ) {
    const ch = s[i];
    if (ch === "*" || ch === "_") {
      let n = 1;
      while (s[i + n] === ch) n++;
      const prev = i > 0 ? s[i - 1] : " ";
      const next = i + n < s.length ? s[i + n] : " ";
      const canOpen = !/\s/.test(next);
      const canClose = !/\s/.test(prev);
      const insideWord = ch === "_" && /[A-Za-z0-9]/.test(prev) && /[A-Za-z0-9]/.test(next);
      if (insideWord || (!canOpen && !canClose)) { buf += s.slice(i, i + n); i += n; continue; }
      let k = n;
      if (k >= 2 && (bold ? canClose : canOpen)) { flush(); bold = !bold; k -= 2; }
      if (k >= 1 && (italic ? canClose : canOpen)) { flush(); italic = !italic; }
      i += n; // any markers left over are dropped rather than printed
      continue;
    }
    buf += ch;
    i++;
  }
  flush();
  return runs;
}

export function plain(src: string): string {
  return parseInline(src).map((r) => r.text).join("").replace(/ {2,}/g, " ").trim();
}

export function runsText(runs: Run[]): string {
  return runs.map((r) => r.text).join("");
}

/* ───────────────────────── blocks ───────────────────────── */

const RE_UL = /^(\s*)[-*+]\s+(.*)$/;
const RE_OL = /^(\s*)\d+[.)]\s+(.*)$/;
const RE_HEAD = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const RE_TABLE = /^\s*\|/;
const RE_QUOTE = /^\s*>\s?/;
const RE_RULE = /^\s*([-*_])(\s*\1){2,}\s*$/;

function splitRow(line: string): string[] {
  let l = line.trim();
  if (l.startsWith("|")) l = l.slice(1);
  if (l.endsWith("|") && !l.endsWith("\\|")) l = l.slice(0, -1);
  return l.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));
}

export function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n?/g, "\n").replace(/^﻿/, "").split("\n");
  const out: Block[] = [];
  let i = 0;
  const startsBlock = (l: string) =>
    RE_HEAD.test(l) || RE_TABLE.test(l) || RE_UL.test(l) || RE_OL.test(l) || RE_QUOTE.test(l) || RE_RULE.test(l);

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || RE_RULE.test(line)) { i++; continue; }

    const h = line.match(RE_HEAD);
    if (h) {
      const text = plain(h[2]);
      if (text) out.push({ t: h[1].length <= 2 ? "h2" : "h3", text });
      i++;
      continue;
    }

    if (RE_TABLE.test(line)) {
      const rows: string[][] = [];
      while (i < lines.length && RE_TABLE.test(lines[i])) { rows.push(splitRow(lines[i])); i++; }
      const body = rows.filter((r) => !r.every((c) => /^:?-{2,}:?$/.test(c) || c === ""));
      if (body.length) {
        const cols = Math.max(...body.map((r) => r.length));
        const norm = body.map((r) => Array.from({ length: cols }, (_, k) => parseInline(r[k] ?? "")));
        out.push({ t: "table", head: norm[0], rows: norm.slice(1) });
      }
      continue;
    }

    if (RE_UL.test(line) || RE_OL.test(line)) {
      const ordered = RE_OL.test(line) && !RE_UL.test(line);
      const items: { text: string; level: number }[] = [];
      while (i < lines.length) {
        const l = lines[i];
        const mu = l.match(RE_UL);
        const mo = l.match(RE_OL);
        const m = mu ?? mo;
        if (m) {
          items.push({ text: m[2], level: Math.min(2, Math.floor(m[1].length / 2)) });
          i++;
        } else if (l.trim() && /^\s{2,}\S/.test(l) && items.length && !RE_TABLE.test(l)) {
          items[items.length - 1].text += " " + l.trim();
          i++;
        } else if (!l.trim()) {
          // A blank line only ends the list if the next real line is not another item.
          let j = i + 1;
          while (j < lines.length && !lines[j].trim()) j++;
          if (j < lines.length && (RE_UL.test(lines[j]) || RE_OL.test(lines[j]))) i = j;
          else break;
        } else break;
      }
      const parsed = items.map((it) => ({ runs: parseInline(it.text), level: it.level })).filter((it) => it.runs.length);
      if (parsed.length) out.push({ t: ordered ? "ol" : "ul", items: parsed });
      continue;
    }

    if (RE_QUOTE.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && RE_QUOTE.test(lines[i])) { buf.push(lines[i].replace(RE_QUOTE, "")); i++; }
      const runs = parseInline(buf.join(" "));
      if (runs.length) out.push({ t: "quote", runs });
      continue;
    }

    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() && !(buf.length && startsBlock(lines[i]))) { buf.push(lines[i].trim()); i++; }
    const runs = parseInline(buf.join(" "));
    if (runs.length) out.push({ t: "p", runs });
  }
  return out;
}

/** Group blocks under their "##" headings. Text before the first heading is the intro. */
export function toSections(blocks: Block[]): { intro: Block[]; sections: Section[] } {
  const intro: Block[] = [];
  const sections: Section[] = [];
  let cur: Section | null = null;
  for (const b of blocks) {
    if (b.t === "h2") { cur = { title: b.text, blocks: [] }; sections.push(cur); continue; }
    if (cur) cur.blocks.push(b);
    else intro.push(b);
  }
  return { intro, sections };
}
