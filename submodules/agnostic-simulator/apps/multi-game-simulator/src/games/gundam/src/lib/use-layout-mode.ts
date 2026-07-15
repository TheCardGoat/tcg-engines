import { useEffect, useState } from "react";

export type LayoutMode = "mobile" | "tablet" | "desktop";

const MOBILE_MAX = 767;
const TABLET_MAX = 1023;

function resolve(width: number): LayoutMode {
  if (width <= MOBILE_MAX) return "mobile";
  if (width <= TABLET_MAX) return "tablet";
  return "desktop";
}

/**
 * Reactive viewport breakpoint. Tablet currently shares desktop chrome; only
 * `mobile` triggers the vertical-stack re-layout.
 */
export function useLayoutMode(): LayoutMode {
  // Initialize to "desktop" on BOTH server and client — if we read
  // `window.innerWidth` during the initial client render the output
  // would diverge from the server (which has no window), hydration
  // would fail, and React would throw away the server tree. The
  // effect below flips to the real viewport post-hydration, which
  // is a cheap second render.
  const [mode, setMode] = useState<LayoutMode>("desktop");

  useEffect(() => {
    setMode(resolve(window.innerWidth));
    const onResize = () => setMode(resolve(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return mode;
}

export const isMobileMode = (mode: LayoutMode) => mode === "mobile";
