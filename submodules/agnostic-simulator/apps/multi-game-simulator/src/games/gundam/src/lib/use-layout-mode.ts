import { useEffect, useState } from "react";

export type LayoutMode = "mobile" | "tablet" | "desktop";

const MOBILE_MAX = 767;
const MOBILE_SHORT_HEIGHT_MAX = 520;
const COMPACT_LANDSCAPE_HEIGHT_MAX = 420;
const TABLET_MAX = 1023;

function resolve(width: number, height: number): LayoutMode {
  if (width <= MOBILE_MAX || height <= MOBILE_SHORT_HEIGHT_MAX) return "mobile";
  if (width <= TABLET_MAX) return "tablet";
  return "desktop";
}

/**
 * Reactive viewport breakpoint. Individual surfaces decide whether tablet
 * should use their compact or desktop composition based on available space.
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
    setMode(resolve(window.innerWidth, window.innerHeight));
    const onResize = () => setMode(resolve(window.innerWidth, window.innerHeight));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return mode;
}

/**
 * True when a landscape viewport is too short to show full mobile field cards
 * and an interaction prompt without the two surfaces covering each other.
 */
export function useCompactLandscapeViewport(): boolean {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const update = () =>
      setCompact(
        window.innerWidth > window.innerHeight &&
          window.innerHeight <= COMPACT_LANDSCAPE_HEIGHT_MAX,
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return compact;
}

export const isMobileMode = (mode: LayoutMode) => mode === "mobile";
