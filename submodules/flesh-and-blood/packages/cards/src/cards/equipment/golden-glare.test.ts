import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { harvestSeasonYellow } from "../actions/harvest-season.ts";
import { sigilOfProtectionYellow } from "../actions/sigil-of-protection.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { goldenGlare } from "./golden-glare.ts";

/**
 * Golden Glare (HVY054) — Guardian Equipment - Head. (Blade Break)
 * Printed: "When this defends together with 2 or more yellow cards,
 * create a Gold token."
 */

describe("Golden Glare (HVY054) AAA", () => {
  it("happy: defending together with 2 yellow cards creates a Gold token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [harvestSeasonYellow, sigilOfProtectionYellow],
        head: [goldenGlare],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([goldenGlare, harvestSeasonYellow, sigilOfProtectionYellow]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveTokenCount("gold", 1);
  });

  it("boundary: a single yellow co-defender is not enough", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [harvestSeasonYellow], head: [goldenGlare], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith([goldenGlare, harvestSeasonYellow]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("gold", 0);
  });

  it("timing: yellow-plus-blue does not qualify (2 yellow required)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [harvestSeasonYellow, nimblismBlue],
        head: [goldenGlare],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([goldenGlare, harvestSeasonYellow, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveTokenCount("gold", 0);
  });
});
