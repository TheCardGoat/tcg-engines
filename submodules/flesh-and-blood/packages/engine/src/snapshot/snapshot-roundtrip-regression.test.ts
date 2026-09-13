import { describe, expect, it } from "vite-plus/test";
import { fleshAndBloodDeckCardLibrary } from "../../../cards/src/deck-library.ts";
import { runFuzzMatch } from "../testing/snapshot-fuzz-runner.ts";

/**
 * Regression replays for the two snapshot-refusal bugs found by the local
 * fuzzer (FAB_SNAPSHOT_FUZZ=1, seed family snapshot-fuzz:cc-edinburgh-1st-
 * gravy-bones) on 2026-08-19:
 *
 * 1. seed :1 — the turn-transition reducer emptied `lkiArena` wholesale while
 *    the in-flight end-turn process still carried resolution event groups
 *    referencing pre-rollover incarnations (`hasValidRuntimeGraphs` refused).
 *    Fixed by pruning to pending-fact references (pruneFabLkiToPendingFacts).
 * 2. seed :2 — an activation destroy-cost target names a token by bare
 *    instance id; the token's interned LKI was pruned the same command
 *    because retention only collected (instanceId, incarnation) pairs, never
 *    bare target ids (`hasValidRuntimeGraphs` refused at the cost payment).
 *    Fixed by collecting id-only refs from targets/declaredTargets lists.
 *
 * Each replay serializes after EVERY command via {@link runFuzzMatch}, so any
 * future invariant break on these lines fails here with the named check.
 * If catalog deck fixtures drift and these exact paths stop being exercised,
 * rerun the local fuzzer to capture fresh seeds.
 */
describe("FAB snapshot roundtrip regressions", () => {
  it("keeps the end-turn rollover persistable (turn-boundary LKI retention)", () => {
    const { termination, history } = runFuzzMatch({
      cardLibrary: fleshAndBloodDeckCardLibrary,
      seed: "snapshot-fuzz:cc-edinburgh-1st-gravy-bones:1",
      player1DeckId: "cc-edinburgh-1st-gravy-bones",
      maxActions: 260,
    });
    // The refusal fired at the turn rollover, so the replay must actually
    // cross a turn boundary — a stall or drifted fixture that never reaches
    // it would silently pass a serialization-only assertion.
    expect(termination).not.toBe("stall");
    expect(history.length).toBeGreaterThan(0);
    const maxTurn = Math.max(...history.map((entry) => entry.turnNumber));
    expect(maxTurn).toBeGreaterThanOrEqual(2);
  }, 120_000);

  it("keeps a destroy-cost target's interned LKI anchored (bare-id retention)", () => {
    const { termination, history } = runFuzzMatch({
      cardLibrary: fleshAndBloodDeckCardLibrary,
      seed: "snapshot-fuzz:cc-edinburgh-1st-gravy-bones:2",
      player1DeckId: "cc-edinburgh-1st-gravy-bones",
      // The original refusal fired at stateID 11 and the exact-target
      // migration later exposed the same checkpoint at stateID 30. Thirty
      // five actions covers both without drifting into unrelated long-match
      // automation behavior.
      maxActions: 35,
    });
    // Reaching the cost payment is the point: the replay must get past the
    // stateID where the refusal fired, not merely terminate cleanly.
    expect(termination).not.toBe("stall");
    expect(history.length).toBeGreaterThan(0);
    const maxStateId = Math.max(...history.map((entry) => entry.stateID));
    expect(maxStateId).toBeGreaterThanOrEqual(30);
  }, 120_000);
});
