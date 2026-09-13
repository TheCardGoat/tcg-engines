import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { civicGuide } from "../../../../../../cards/src/cards/equipment/civic-guide.ts";

function hasMight(ids: readonly string[]): boolean {
  return ids.some((id) => /might|token:might/i.test(id));
}

describe("civic-guide (TCC032)", () => {
  it("AAA: defending with Civic Guide creates a Might under the other hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, arms: [civicGuide], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(civicGuide);
    game.helpers.resolveRestOfCombat();

    expect(hasMight(game.as(bravo).zone("arena"))).toBe(true);
  });

  it("boundary: a different defender does not trigger Civic Guide", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, arms: [civicGuide], hand: [nimblismBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();

    expect(hasMight(game.as(bravo).zone("arena"))).toBe(false);
    expect(game.as(dash).zone("arms")).toContain(civicGuide.canonicalId);
  });
});
