/**
 * Auto-registers all Gundam custom matchers with the vite-plus/test (Vitest) expect.
 *
 * Import this module once at the top of a test file (or in a shared test setup)
 * to activate all `expect(x).toSucceed()`, `expect(engine).toBeInGameSegment()`,
 * etc. matchers without manually calling registerGundamMatchers(expect).
 *
 * The `declare global` block below augments `jest.Matchers<R>` so TypeScript
 * recognises the custom matchers on every `expect(x)` call in files that import
 * this module. `Assertion<T>` (from @voidzero-dev/vite-plus-test) extends
 * `JestAssertion<T>`, which extends `jest.Matchers<void, T>`, so augmenting
 * the global namespace is the correct extension point.
 *
 * @example
 * ```ts
 * import "@tcg/gundam-engine/testing/register-matchers";
 * // matchers are now active for this file
 * ```
 */

import { expect } from "vite-plus/test";
import { registerGundamMatchers } from "./matchers.ts";

registerGundamMatchers(expect);

declare global {
  namespace jest {
    interface Matchers<R> {
      // ── CommandResult matchers ────────────────────────────────────────────
      toSucceed(): R;
      toFailWith(errorCode: string): R;
      // ── Player-level matchers ─────────────────────────────────────────────
      toBeExhausted(card: unknown): R;
      toBeReady(card: unknown): R;
      toHaveDamage(args: { card: unknown; value: number }): R;
      toHaveResourceCount(expected: number): R;
      toBeInZone(args: { card: unknown; zone: string }): R;
      toHavePilot(args: { unit: unknown; pilot?: string }): R;
      // ── Phase matchers ────────────────────────────────────────────────────
      toBeInPhase(phase: string): R;
      // ── Engine-level matchers ─────────────────────────────────────────────
      toBeInGameSegment(segment: string): R;
      toHaveActivePlayer(playerId: string): R;
      toHaveCardInZone(cardId: string, expectedZoneKey: string): R;
      toHaveCardCountInZone(zone: { zone: string; playerId?: string }, count: number): R;
      toHaveGameEnded(expectedWinner?: string): R;
      toHaveGameInProgress(): R;
    }
  }
}
