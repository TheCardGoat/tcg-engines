/**
 * PEN300 Line Crossers — Arms.
 *
 * Printed a1: "If you have the same {h} as a hero, it also counts as you
 * having more {h} than them, and them having less {h} than you."
 *
 * The assertions use real attacks and the public FabTestEngine move path.
 * Wounded Bull exercises the strict-less-than side; Big Bully exercises the
 * strict-greater-than side through its public crowd-boos/power outcome.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, woundedBullBlue } from "../../../fixtures.ts";
import { mightyboneKnuckles } from "../../../../../../cards/src/cards/equipment/mightybone-knuckles.ts";
import { lineCrossers } from "../../../../../../cards/src/cards/equipment/line-crossers.ts";

describe("PEN300 Line Crossers", () => {
  it("equal life counts as less for Wounded Bull while Line Crossers is in the arms zone", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        arms: [lineCrossers],
        hand: [woundedBullBlue],
        resourcePoints: 3,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(woundedBullBlue);

    // Wounded Bull is 5 base power and gains +1 when equal life is treated as
    // strict less-than by Line Crossers.
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });

  it("equal life counts as greater for the other hero, while the no-equipment boundary does not", () => {
    const withLineCrossers = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        arms: [mightyboneKnuckles],
        resourcePoints: 3,
        deck: 4,
      },
      { hero: dash, life: 20, arms: [lineCrossers], deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    withLineCrossers.as(bravo).activate(mightyboneKnuckles);
    withLineCrossers.passBoth();
    expect(
      Object.values(withLineCrossers.getState().objects).filter(
        (object) => object.canonicalId === "token:might",
      ),
    ).toHaveLength(3);

    const withoutLineCrossers = FabTestEngine.start(
      {
        hero: bravo,
        life: 20,
        arms: [mightyboneKnuckles],
        resourcePoints: 3,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    expect(() => withoutLineCrossers.as(bravo).activate(mightyboneKnuckles)).toThrow();
  });

  it("unequal life keeps the ordinary strict comparisons", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: 19,
        arms: [lineCrossers],
        hand: [woundedBullBlue],
        resourcePoints: 3,
        deck: 4,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(woundedBullBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });
});
