/**
 * CR Chapter 2 — Object Properties (defining sections).
 * 2.2 cost, 2.3 defense, 2.4 intellect, 2.5 life, 2.8 pitch, 2.9 power, 2.1 color.
 */
import { describe, expect, it } from "vite-plus/test";
import {
  FabTestEngine,
  baseCardCost,
  baseCardDefense,
  baseCardPower,
  basePitchValue,
  toFabCardDefinition,
} from "../../../index.ts";
import { bravo, dash, nimbleStrikeRed, nimblismBlue, snatchRed } from "../../fixtures.ts";

describe("CR 2 — Object Properties", () => {
  it("2.8 / 2.1: blue pitch value 3 generates 3 resources when pitched as payment", () => {
    expect(basePitchValue(toFabCardDefinition(nimblismBlue))).toBe(3);
    expect(nimblismBlue.base.color).toBe("blue");
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimblismBlue, nimbleStrikeRed], deck: 4, resourcePoints: 0 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).play(nimbleStrikeRed, {
      pitch: [nimblismBlue],
      target: game.as(dash).id,
    });
    // pitch 3 − cost 1 = leftover 2 RP; blue is in pitch zone
    expect(game.as(bravo).resourcePoints()).toBe(2);
    expect(game.as(bravo).zone("pitch")).toContain(nimblismBlue.canonicalId);
  });

  it("2.2 / 2.9: printed cost and power of Snatch drive play and damage", () => {
    expect(baseCardCost(toFabCardDefinition(snatchRed))).toBe(0);
    expect(baseCardPower(toFabCardDefinition(snatchRed))).toBe(4);
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });

  it("2.3: defense property contributes to damage calculation", () => {
    expect(baseCardDefense(toFabCardDefinition(nimblismBlue))).toBe(2);
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).blockWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(18); // 4 − 2
  });

  it("2.4 / 2.5: hero intellect and life come from printed hero stats", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(game.as(bravo).life()).toBe(bravo.base.numeric.life);
    expect(game.as(bravo).intellect()).toBe(bravo.base.numeric.intellect);
    expect(game.as(dash).life()).toBe(dash.base.numeric.life);
  });
});
