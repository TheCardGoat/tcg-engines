import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { civicSteps } from "../../../../../../cards/src/cards/equipment/civic-steps.ts";

function hasQuicken(ids: readonly string[]): boolean {
  return ids.some((id) => /quicken|token:quicken/i.test(id));
}

describe("civic-steps (TCC033)", () => {
  it("AAA: defending with Civic Steps creates a Quicken under the other hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, legs: [civicSteps], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(civicSteps);
    game.helpers.resolveRestOfCombat();
    expect(hasQuicken(game.as(bravo).zone("arena"))).toBe(true);
  });

  it("boundary: a different defender does not trigger Civic Steps", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, legs: [civicSteps], hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();
    expect(hasQuicken(game.as(bravo).zone("arena"))).toBe(false);
    expect(game.as(dash).zone("legs")).toContain(civicSteps.canonicalId);
  });
});
