/**
 * AAA test for trigger:leave-arena.
 * Representative card: Act of Glory Red (APS011) — Guardian Instant Aura with Suspense.
 * When this leaves the arena, your next attack this turn gets +6{p}.
 * Suspense removes a counter at the start of the controller's turn (CR 8.3.42);
 * the last counter destroys it.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "../../../../index.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { actOfGloryRed } from "../../../../../../cards/src/cards/instants/act-of-glory.ts";

describe("trigger: leave-arena", () => {
  it("AAA: Act of Glory leaves the arena when its last suspense counter is removed (APS011)", () => {
    // Arrange — seed in arena with suspense counters (fixture seeds 2).
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [actOfGloryRed],
        hand: [snatchRed],
        deck: 6,
      },
      { hero: dash, life: 30, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    expect(Bravo.zone("arena")).toContain(actOfGloryRed.canonicalId);

    // Act — CR 8.3.42: a suspense counter is removed at the START of the
    // controller's turn, not the end phase. Seed = 2 counters, so Act of
    // Glory is destroyed at the start of Bravo's turn on the second cycle.
    const drain = (): void => {
      for (let i = 0; i < 8; i += 1) {
        if (game.getState().rulesStack.length === 0 && !game.getState().decision) break;
        try {
          game.passBoth();
        } catch {
          break;
        }
      }
    };

    // Bravo's end phase no longer ticks suspense (both counters persist).
    Bravo.endTurn();
    drain();
    expect(Bravo.zone("arena")).toContain(actOfGloryRed.canonicalId);

    // Cycle 1 — Dash ends → Bravo's next turn starts: 2→1 (survives).
    Dash.endTurn();
    drain();
    expect(Bravo.zone("arena")).toContain(actOfGloryRed.canonicalId);

    // Cycle 2 — Bravo ends, Dash ends → Bravo's next turn starts: 1→0 → destroy.
    Bravo.endTurn();
    drain();
    Dash.endTurn();
    drain();

    // Assert — destroyed by suspense expiry → leave-arena path.
    expect(Bravo.zone("arena")).not.toContain(actOfGloryRed.canonicalId);
    expectFabCard(Bravo, actOfGloryRed).toBeIn("graveyard");
  });

  it("AAA boundary: non-suspense attack does not linger in arena after resolution", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 30, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(bravo).zone("arena")).not.toContain(snatchRed.canonicalId);
    expectFabCard(game.as(bravo), snatchRed).toBeIn("graveyard");
  });
});
