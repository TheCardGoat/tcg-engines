import { useHasHover as useSharedHasHover } from "../../../../lib/media-query.ts";

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
  return useSharedHasHover();
}
