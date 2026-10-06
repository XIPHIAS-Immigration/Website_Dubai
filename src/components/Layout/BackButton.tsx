"use client";

// Back button for the top bar. Shown on every page except the homepage.
// It returns to the page the visitor came from; if they landed here directly
// (for example from Google) it goes up one level instead: programme → country
// → section → home.

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, type CSSProperties } from "react";

const TRAIL_KEY = "xiphias-nav-trail";
const GOLD = "#bfa15c";

function parentOf(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  parts.pop();
  return parts.length ? `/${parts.join("/")}` : "/";
}

function readTrail(): string[] {
  try {
    const raw = window.sessionStorage.getItem(TRAIL_KEY);
    const trail: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(trail) ? trail.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** True when this browser tab already has an earlier page of this site to return to. */
function canGoBackInSite(): boolean {
  const nav = (window as unknown as { navigation?: { canGoBack?: boolean } }).navigation;
  if (nav && typeof nav.canGoBack === "boolean") return nav.canGoBack;
  return readTrail().length > 1 && window.history.length > 1;
}

type Props = {
  /** Text and border colour, so the button matches the bar it sits in. */
  color?: string;
  className?: string;
};

export default function BackButton({ color = "#eef3fb", className = "" }: Props) {
  const pathname = usePathname() || "/";
  const router = useRouter();

  // Remember the pages visited in this tab (used where the browser cannot tell us).
  useEffect(() => {
    try {
      const trail = readTrail();
      if (trail[trail.length - 1] === pathname) return;
      if (trail.length >= 2 && trail[trail.length - 2] === pathname) trail.pop();
      else trail.push(pathname);
      window.sessionStorage.setItem(TRAIL_KEY, JSON.stringify(trail.slice(-40)));
    } catch {
      /* storage can be unavailable in private windows; the button still works */
    }
  }, [pathname]);

  const goBack = useCallback(() => {
    if (canGoBackInSite()) router.back();
    // No earlier page in this tab: step up one level. `replace` keeps Back moving
    // upwards instead of bouncing between this page and its parent.
    else router.replace(parentOf(pathname));
  }, [pathname, router]);

  if (pathname === "/") return null;

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Go back to the previous page"
      title="Back"
      className={`group inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--bb)_38%,transparent)] px-2.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[color:var(--bb)] transition-colors duration-200 hover:border-[#bfa15c] hover:text-[#bfa15c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-4 ${className}`}
      style={{ "--bb": color, outlineColor: GOLD } as CSSProperties}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-200 group-hover:-translate-x-0.5">
        <path d="M19 12H5" />
        <path d="m11 6-6 6 6 6" />
      </svg>
      <span className="hidden sm:inline">Back</span>
    </button>
  );
}
