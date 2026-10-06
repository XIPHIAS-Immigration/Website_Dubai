#!/usr/bin/env python3
"""Add the Back button to both Dubai-site headers. usage: patch_back.py ROOT"""
import sys, io, os
ROOT = sys.argv[1]
jobs = [
 ("src/components/HomeLuxe/LuxeHeader.tsx", [
   ('className="relative block h-16 w-52"><Image src={logoSrc} alt="XIPHIAS Immigration" fill sizes="208px" className="object-contain object-left" priority /></a>\n',
    'className="relative block h-16 w-[76px] shrink-0 sm:w-52"><Image src={logoSrc} alt="XIPHIAS Immigration" fill sizes="208px" className="object-contain object-left" priority /></a>\n'
    '        {/* The logo artwork is narrower than its box, so on wider screens the button is pulled in beside it. */}\n'
    '        <BackButton color={fg} className="relative z-[1] ml-2 mr-2 sm:-ml-[112px] sm:mr-0" />\n'),
   # On phones the word "Menu" gives way to the Back button on inner pages (the menu icon stays).
   ('          <span>Menu</span>\n', '          <span className={onHome ? undefined : "hidden sm:inline"}>Menu</span>\n'),
   ('  const reduce = useReducedMotion();\n  const [open, setOpen] = useState(false);\n',
    '  const reduce = useReducedMotion();\n  const onHome = (usePathname() || "/") === "/";\n  const [open, setOpen] = useState(false);\n'),
   ('import Image from "next/image";\n', 'import Image from "next/image";\nimport { usePathname } from "next/navigation";\n'),
  ], 'import BackButton from "@/components/Layout/BackButton";'),
 ("src/components/Layout/Header/index.tsx", [
   ('              <div className="ml-3 flex items-center gap-1 sm:gap-2">\n',
    '              <div className="ml-3 flex items-center gap-1 sm:gap-2">\n'
    '                <BackButton />\n'),
  ], "import BackButton from '@/components/Layout/BackButton';"),
]
ok = True; changed = []
for rel, reps, imp in jobs:
    p = os.path.join(ROOT, rel)
    raw = io.open(p, encoding="utf-8", newline="").read()
    crlf = "\r\n" in raw; t = raw.replace("\r\n", "\n")
    for old, new in reps:
        n = t.count(old)
        if new in t: print("already applied:", rel)
        elif n == 1: t = t.replace(old, new)
        else: print("FAIL (%d): %s :: %s" % (n, rel, old[:60])); ok = False
    if imp not in t:
        lines = t.split("\n")
        idx = max(i for i, l in enumerate(lines[:60]) if l.startswith("import ") and " from " in l)
        lines.insert(idx + 1, imp)
        t = "\n".join(lines)
    out = t.replace("\n", "\r\n") if crlf else t
    if out != raw and ok:
        io.open(p, "w", encoding="utf-8", newline="").write(out); changed.append(rel)
print("OK" if ok else "ERRORS", "| changed:", len(changed))
sys.exit(0 if ok else 1)
