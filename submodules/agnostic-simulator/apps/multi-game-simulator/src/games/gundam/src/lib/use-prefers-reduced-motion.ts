import { useEffect, useState } from "react";

const MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * `true` when the user has OS-level "reduced motion" preference enabled.
 * Used to gate JS-driven animations that the global CSS rule (see
 * `index.css`) can't reach — notably the SVG `<animate>` element that
 * paints the dashed attack-arrow flow in `AttackTargetingOverlay`.
 *
 * SSR-safe: the first render is always `false` so the server-rendered
 * markup matches the client's first paint and React hydration sees no
 * diff. The effect reads `matchMedia()` on mount and re-syncs if the
 * user actually prefers reduced motion. The trade-off is a one-frame
 * "flip" on first paint for reduced-motion users — acceptable because
 * the only animation affected is the attack-arrow dash flow, which is
 * gated on an overlay that can't be active at first paint.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia(MEDIA_QUERY);
    // Sync once on mount — `useState(false)` is an SSR-safe lie we
    // correct here rather than in the initializer (which would diverge
    // from server markup).
    setPrefers(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefers(e.matches);
    // `addEventListener` is the modern API; older Safari exposes only
    // `addListener`. Support both.
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    }
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  return prefers;
}
