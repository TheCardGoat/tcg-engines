import { useEffect, useState } from "react";

// `any-hover` (vs. `hover`) keeps hover UI enabled on hybrid devices —
// e.g. a touchscreen laptop with an attached mouse, where `(hover: hover)`
// can resolve to `false` because the *primary* pointer is touch but the
// user can still hover via the trackpad/mouse.
const MEDIA_QUERY = "(any-hover: hover)";

function readMatch(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return true;
  return window.matchMedia(MEDIA_QUERY).matches;
}

/**
 * `true` when any pointing device on the system can hover (mouse / pen /
 * trackpad), `false` on touch-only devices. Used to suppress hover-driven
 * UI on mobile where browsers emit synthetic mouse events on tap — the
 * desktop hover preview would otherwise pop up on every tap and compete
 * with the actual click handler (e.g. `enterBattle`).
 *
 * The initial state is read synchronously from `matchMedia` so the very
 * first render on a touch client already sees `false`, eliminating the
 * one-frame window where hover handlers would otherwise be wired. SSR
 * (no `window`) and tests with no `matchMedia` mock fall back to `true`,
 * which keeps existing hover-styling tests passing.
 */
export function useHasHover(): boolean {
  const [hasHover, setHasHover] = useState<boolean>(readMatch);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(MEDIA_QUERY);
    setHasHover(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setHasHover(e.matches);
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  return hasHover;
}
