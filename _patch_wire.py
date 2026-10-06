#!/usr/bin/env python3
"""Point every Download brochure button on the Dubai site at that page's own auto-made brochure.
usage: patch_wire.py ROOT   (ROOT contains src/). Exact-match edits; line endings preserved."""
import sys, io, os
ROOT = sys.argv[1]
IMPORT = 'import { brochureHref } from "@/lib/brochure/href";\n'
jobs = []
for v in ("citizenship", "residency", "skilled", "corporate"):
    jobs.append((f"src/app/(site)/{v}/[country]/[program]/page.tsx",
                 [('brochure: typeof p.brochure === "string" ? p.brochure : undefined', f'brochure: brochureHref("{v}", country, program)')], True))
    jobs.append((f"src/app/(site)/{v}/[country]/page.tsx",
                 [('brochure: typeof m.brochure === "string" ? m.brochure : undefined', f'brochure: brochureHref("{v}", slug)')], True))
jobs.append(("src/app/(site)/[vertical]/[country]/[program]/page.tsx", [
    ("    brochure: doc.brochure,\n", "    brochure: brochureHref(doc.vertical, doc.country, doc.program),\n"),
    ("        {doc.brochure && (\n", "        {shellData.brochure && (\n"),
    ("            href={doc.brochure}\n", "            href={shellData.brochure}\n"),
], True))
jobs.append(("src/components/guid/brochures.ts", [
    ("    return brochureMap[programHref] ?? null;",
     "    // Every programme page now has its own auto-made brochure.\n"
     "    const m = programHref.match(/^\\/(citizenship|residency|skilled|corporate)\\/([a-z0-9-]+)\\/([a-z0-9-]+)\\/?$/);\n"
     "    if (m) return `/brochures/${m[1]}/${m[2]}/${m[3]}.pdf`;\n"
     "    return brochureMap[programHref] ?? null;"),
], False))
ok = True; changed = []
for rel, reps, add_import in jobs:
    p = os.path.join(ROOT, rel)
    raw = io.open(p, encoding="utf-8", newline="").read()
    crlf = "\r\n" in raw; t = raw.replace("\r\n", "\n")
    for old, new in reps:
        n = t.count(old)
        if n == 1 and new not in t: t = t.replace(old, new)
        elif new in t: print("already applied:", rel)
        else: print("FAIL (%d): %s :: %s" % (n, rel, old[:60])); ok = False
    if add_import and IMPORT not in t:
        lines = t.split("\n")
        # insert after the last top-level import line (single-line imports only)
        idx = max(i for i, l in enumerate(lines) if l.startswith("import ") and (l.rstrip().endswith(";") or " from " in l))
        lines.insert(idx + 1, IMPORT.rstrip("\n"))
        t = "\n".join(lines)
    out = t.replace("\n", "\r\n") if crlf else t
    if out != raw and ok:
        io.open(p, "w", encoding="utf-8", newline="").write(out); changed.append(rel)
print("OK" if ok else "ERRORS", "| changed:", len(changed))
sys.exit(0 if ok else 1)
