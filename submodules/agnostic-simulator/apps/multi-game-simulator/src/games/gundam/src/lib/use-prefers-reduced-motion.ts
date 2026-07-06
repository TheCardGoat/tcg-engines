import { usePrefersReducedMotion as useSharedPrefersReducedMotion } from "../../../../lib/media-query.ts";

/**
 * `true` when the user has OS-level "reduced motion" preference enabled.
 * Used to gate JS-driven animations that the global CSS rule (see
 * `index.css`) can't reach.
 *
 * SSR-safe: the first render is always `false` so the server-rendered
 * markup matches the client's first paint and React hydration sees no
 * diff. The effect reads `matchMedia()` on mount and re-syncs if the
 * user actually prefers reduced motion. The trade-off is a one-frame
 * "flip" on first paint for reduced-motion users.
 */
export function usePrefersReducedMotion(): boolean {
  return useSharedPrefersReducedMotion();
}
