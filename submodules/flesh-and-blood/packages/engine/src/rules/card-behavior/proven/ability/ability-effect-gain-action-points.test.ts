/**
 * AAA test for effect:gain-action-points.
 * Representative card: Timesnap Potion Blue (RNR029) — Generic Action Item, cost 0.
 * Activated ability: "Action - Destroy this: Gain 2 action points."
 *   → cost: destroy-self
 *   → effect: gain-action-points 2
 *
 * Verifies that activating the ability destroys the item and grants 2 AP.
 * The activation itself costs 1 AP, so the net change is +1 AP.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, timesnapPotionBlue } from "../../../fixtures.ts";

describe("effect: gain-action-points", () => {
  it("AAA: activating Timesnap Potion destroys it and grants 2 action points (net +1)", () => {
    // Arrange — Timesnap Potion in the arena. Default starting AP is 1.
    const game = FabTestEngine.start(
      { hero: bravo, arena: [timesnapPotionBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("arena")).toContain(timesnapPotionBlue.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);

    // Act — Activate "Destroy this: Gain 2 action points."
    Bravo.activate(timesnapPotionBlue);

    // Assert — Card destroyed to graveyard; AP went from 1 → 0 (activation cost)
    // → 2 (effect), netting +1 AP.
    expect(Bravo.zone("arena")).not.toContain(timesnapPotionBlue.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(timesnapPotionBlue.canonicalId);
    expect(Bravo.actionPoints()).toBe(2);
  });

  it("AAA boundary: before activation the item stays in the arena with default AP", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [timesnapPotionBlue], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);

    // Assert — Without activation the card stays in arena and AP is unchanged.
    expect(Bravo.zone("arena")).toContain(timesnapPotionBlue.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(timesnapPotionBlue.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);
  });
});
