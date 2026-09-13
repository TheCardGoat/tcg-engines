/**
 * SEA008 Cogwerx Tinker Rings — Arms.
 *
 * Printed a1: "When this defends, create a Golden Cog token."
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, rattleBonesRed, snatchRed } from "../../../fixtures.ts";
import { cogwerxTinkerRings } from "../../../../../../cards/src/cards/equipment/cogwerx-tinker-rings.ts";

function goldenCogs(game: FabTestEngine): number {
  return Object.values(game.getState().objects).filter(
    (object) => object.canonicalId === "token:golden-cog",
  ).length;
}

describe("SEA008 Cogwerx Tinker Rings", () => {
  it("creates a Golden Cog when the equipped Rings defend", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, arms: [cogwerxTinkerRings], deck: 6 },
      { autoPassPriority: false },
    );

    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(cogwerxTinkerRings);
    game.helpers.resolveRestOfCombat();

    expect(goldenCogs(game)).toBe(1);
    // Blade Break is incidental lifecycle; the printed token ability is the
    // acceptance target and the defended Rings leave the arena afterward.
    expect(game.as(dash).zone("graveyard")).toContain(cogwerxTinkerRings.canonicalId);
  });

  it("does not create a Cog when the Rings do not defend", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, arms: [cogwerxTinkerRings], deck: 6 },
      { autoPassPriority: false },
    );

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(goldenCogs(game)).toBe(0);
    expect(game.as(dash).zone("arms")).toContain(cogwerxTinkerRings.canonicalId);
  });

  it("does not fire for a different defending card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, arms: [cogwerxTinkerRings], hand: [rattleBonesRed], deck: 6 },
      { autoPassPriority: false },
    );

    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(rattleBonesRed);
    game.helpers.resolveRestOfCombat();

    expect(goldenCogs(game)).toBe(0);
    expect(game.as(dash).zone("arms")).toContain(cogwerxTinkerRings.canonicalId);
  });
});
