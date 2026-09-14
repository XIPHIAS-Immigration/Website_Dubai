"use client";

// Opens the assistant once, on a page whose entire purpose is the assistant.
// A short beat first, so the page paints and a visitor who arrived from search
// sees what this is before the overlay covers it.

import { useEffect, useRef } from "react";

import { openXiaChat } from "./xia-chat";

export default function XiaAutoOpen({ delayMs = 600 }: { delayMs?: number }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const timer = window.setTimeout(() => openXiaChat(), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  return null;
}
