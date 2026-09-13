/**
 * AAA test for trigger:roll.
 * Barkbone Strapping: Instant — Destroy this: Roll a 6-sided die. Gain {r}
 * equal to half the number rolled, rounded down.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { barkboneStrapping } from "../../../../../../cards/src/cards/equipment/barkbone-strapping.ts";

function resolveDecisions(game: FabTestEngine): void {
  for (let safety = 0; safety < 24; safety += 1) {
    const decision = game.getState().decision;
    if (!decision) {
      if (game.getState().rulesStack.length > 0) {
        try {
          game.passBoth();
        } catch {
          return;
        }
        continue;
      }
      return;
    }
    if (game.answerForcedDecision()) continue;
    return;
  }
}

describe("trigger: roll", () => {
  it("AAA: Barkbone Strapping destroy rolls a die and gains resources (RNR005)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [barkboneStrapping], resourcePoints: 0, deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.resourcePoints()).toBe(0);

    const result = Bravo.activate(barkboneStrapping);
    expect(result.accepted).toBe(true);
    resolveDecisions(game);

    // Destroy cost always pays; roll 1–6 → floor(n/2) resources in 0..3.
    expect(Bravo.zone("graveyard")).toContain(barkboneStrapping.canonicalId);
    expect(Bravo.zone("chest")).not.toContain(barkboneStrapping.canonicalId);
    // Deterministic seed "fab-test" yields a roll that grants resources (not zero).
    expect(Bravo.resourcePoints()).toBeGreaterThan(0);
    expect(Bravo.resourcePoints()).toBeLessThanOrEqual(3);
  });

  it("AAA boundary: without equipment, combat still closes cleanly", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });
});
