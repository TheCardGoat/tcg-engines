import { usePrefersReducedMotion } from "../../../lib/media-query.ts";

/**
 * Live subscription to the OS-level reduced-motion preference. SSR-safe —
 * defaults to `false` on the server so animations render normally during
 * static rendering, then re-evaluate on the client.
 */
export function useReducedMotion(): boolean {
  return usePrefersReducedMotion();
}
