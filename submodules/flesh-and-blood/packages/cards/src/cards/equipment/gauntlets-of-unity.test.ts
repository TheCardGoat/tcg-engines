import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { regurgitatingSlogRed } from "../actions/regurgitating-slog.ts";
import { gauntletsOfUnity } from "./gauntlets-of-unity.ts";

/**
 * Gauntlets of Unity (PEN046) — Warrior Equipment - Arms. (Temper)
 * Printed: "When this defends together with a card from hand, this gets
 * +1{d} until end of turn."
 */

describe("Gauntlets of Unity (PEN046) AAA", () => {
  it("happy: defending together with a hand card blocks 4 exactly (1+1 rider+2)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], arms: [gauntletsOfUnity], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([gauntletsOfUnity, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    // 1{d} + 1 rider + Nimblism 2{d} = 4: fully blocked only because
    // the rider fired.
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: defending alone stays at printed 1{d} (3 damage carries)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arms: [gauntletsOfUnity], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(gauntletsOfUnity);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("timing: two hand cards still apply the rider only once (1+1+2+2)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [nimblismBlue, regurgitatingSlogRed],
        arms: [gauntletsOfUnity],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([gauntletsOfUnity, nimblismBlue, regurgitatingSlogRed]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
  });
});
