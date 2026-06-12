import { describe, expect, it } from "vite-plus/test";

import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  createMockResource,
} from "../gundam/testing/index.ts";
import type { PlayerId } from "../types/branded.ts";

import type { GundamBotCandidateFamily } from "./candidate-types.ts";
import { greedyLegalStrategy } from "./greedy-legal-strategy.ts";
import { passOnlyStrategy } from "./pass-only-strategy.ts";
import { playMatch } from "./play-match.ts";

/**
 * Self-play harness contract:
 *   - Drives both seats to a stable termination (game-won or
 *     max-actions-exceeded).
 *   - Never throws on a registered strategy that returns no candidates
 *     (the planner's fallback chain handles that).
 *   - Throws loudly when a strategy is missing for the active player.
 *   - Action trace is well-formed: monotonic state IDs, every step has
 *     a recognised outcome.
 */
describe("playMatch: termination", () => {
  it("two pass-only bots terminate within the action budget", () => {
    // Both players refuse to attack/develop and only submit
    // setup/forced/pass candidates. The match runs until the engine's
    // turn cycle eventually exhausts something — usually a deck-out or
    // the action cap. We just want a stable termination, not a
    // specific winner.
    const engine = GundamTestEngine.create({}, {});
    const strategies = new Map<PlayerId, typeof passOnlyStrategy>([
      [PLAYER_ONE as PlayerId, passOnlyStrategy],
      [PLAYER_TWO as PlayerId, passOnlyStrategy],
    ]);

    const outcome = playMatch(engine.runtime, strategies, engine.runtime.getStaticResources(), {
      maxActions: 500,
    });

    expect(["game-won", "max-actions-exceeded", "concede-failed"]).toContain(outcome.termination);
    expect(outcome.actionCount).toBeGreaterThan(0);
    expect(outcome.actionCount).toBeLessThanOrEqual(500);
  });

  it("greedy vs pass-only: greedy submits aggressive actions; pass-only doesn't", () => {
    const attacker = createMockUnit({ cost: 1, level: 1, ap: 2, hp: 3, name: "RX-78-2" });
    const engine = GundamTestEngine.create(
      {
        play: [attacker],
        resourceArea: [createMockResource(), createMockResource()],
      },
      {},
    );
    const strategies = new Map<PlayerId, typeof greedyLegalStrategy>([
      [PLAYER_ONE as PlayerId, greedyLegalStrategy],
      [PLAYER_TWO as PlayerId, passOnlyStrategy],
    ]);

    const outcome = playMatch(engine.runtime, strategies, engine.runtime.getStaticResources(), {
      maxActions: 200,
    });

    // Greedy must have submitted at least one enterBattle / play action
    // somewhere in the trace (P1 has an attacker on the board with
    // resources to act). Pass-only never appears with an aggressive
    // family. This is the smoke test for "the strategies actually
    // differ in self-play".
    const p1Actions = outcome.actions.filter((a) => a.playerId === (PLAYER_ONE as PlayerId));
    const p2Actions = outcome.actions.filter((a) => a.playerId === (PLAYER_TWO as PlayerId));

    const p1Families = collectFamilies(p1Actions);
    const p2Families = collectFamilies(p2Actions);

    const PASS_FAMILIES: ReadonlySet<GundamBotCandidateFamily> = new Set([
      "passTurn",
      "passActionStep",
      "passBattleAction",
      "passBlock",
    ]);
    const AGGRESSIVE_FAMILIES: ReadonlySet<GundamBotCandidateFamily> = new Set([
      "deployUnit",
      "deployBase",
      "playCommand",
      "activateAbility",
      "assignPilot",
      "enterBattle",
      "declareBlock",
    ]);

    // Greedy's trace contains a non-pass family at some point.
    const greedyHasAggression = [...p1Families].some((f) => !PASS_FAMILIES.has(f));
    expect(greedyHasAggression).toBe(true);

    // Pass-only never submits a fundamentally aggressive family.
    const passOnlySubmittedAggression = [...p2Families].some((f) => AGGRESSIVE_FAMILIES.has(f));
    expect(passOnlySubmittedAggression).toBe(false);
  });
});

function collectFamilies(
  actions: readonly { selectedCandidate?: { family: GundamBotCandidateFamily } }[],
): Set<GundamBotCandidateFamily> {
  const out = new Set<GundamBotCandidateFamily>();
  for (const action of actions) {
    if (action.selectedCandidate) out.add(action.selectedCandidate.family);
  }
  return out;
}

describe("playMatch: trace shape", () => {
  it("each action's stateIdAfter is >= stateIdBefore", () => {
    const engine = GundamTestEngine.create({}, {});
    const strategies = new Map<PlayerId, typeof passOnlyStrategy>([
      [PLAYER_ONE as PlayerId, passOnlyStrategy],
      [PLAYER_TWO as PlayerId, passOnlyStrategy],
    ]);

    const outcome = playMatch(engine.runtime, strategies, engine.runtime.getStaticResources(), {
      maxActions: 100,
    });

    for (const action of outcome.actions) {
      expect(action.stateIdAfter).toBeGreaterThanOrEqual(action.stateIdBefore);
    }
  });

  it("respects trace: false (no in-memory accumulation)", () => {
    const engine = GundamTestEngine.create({}, {});
    const strategies = new Map<PlayerId, typeof passOnlyStrategy>([
      [PLAYER_ONE as PlayerId, passOnlyStrategy],
      [PLAYER_TWO as PlayerId, passOnlyStrategy],
    ]);

    let onActionCount = 0;
    const outcome = playMatch(engine.runtime, strategies, engine.runtime.getStaticResources(), {
      maxActions: 50,
      trace: false,
      onAction: () => {
        onActionCount++;
      },
    });

    expect(outcome.actions).toEqual([]);
    expect(onActionCount).toBe(outcome.actionCount);
  });
});

describe("playMatch: missing-strategy guard", () => {
  it("throws loudly when the active player has no registered strategy", () => {
    const engine = GundamTestEngine.create({}, {});
    const strategies = new Map<PlayerId, typeof passOnlyStrategy>([
      [PLAYER_ONE as PlayerId, passOnlyStrategy],
      // Intentionally omitting PLAYER_TWO.
    ]);

    expect(() =>
      playMatch(engine.runtime, strategies, engine.runtime.getStaticResources(), {
        maxActions: 50,
      }),
    ).toThrow(/No strategy registered/);
  });
});

describe("playMatch: game-already-ended short-circuit", () => {
  it("returns game-won with zero actions when the match is already over", () => {
    const engine = GundamTestEngine.create({}, {});
    engine.runtime.getState().ctx.status.gameEnded = true;
    engine.runtime.getState().ctx.status.winner = PLAYER_ONE as PlayerId;
    engine.runtime.getState().ctx.status.winReason = "DAMAGE";

    const strategies = new Map<PlayerId, typeof passOnlyStrategy>([
      [PLAYER_ONE as PlayerId, passOnlyStrategy],
      [PLAYER_TWO as PlayerId, passOnlyStrategy],
    ]);

    const outcome = playMatch(engine.runtime, strategies, engine.runtime.getStaticResources());
    expect(outcome.termination).toBe("game-won");
    expect(outcome.actionCount).toBe(0);
    expect(outcome.winner).toBe(PLAYER_ONE);
    expect(outcome.winReason).toBe("DAMAGE");
  });
});
