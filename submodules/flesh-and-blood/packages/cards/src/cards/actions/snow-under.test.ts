import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";

import { weaveIceRed } from "./weave-ice.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { snowUnderRed } from "./snow-under.ts";

describe("Snow Under (ELE022) AAA", () => {
  it("happy: fused hit creates a Frostbite under their control", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [snowUnderRed, weaveIceRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);
    Oldhim.playAttack(snowUnderRed, { fuse: true, fuseCards: [weaveIceRed] });
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 1);
  });

  it("boundary: unfused hit does not grant the fused rider", () => {
    const game = FabTestEngine.start(
      { hero: oldhim, hand: [snowUnderRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);
    Oldhim.playAttack(snowUnderRed);
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 0);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: oldhim, hand: [snowUnderRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Oldhim.defendWith([snowUnderRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Oldhim).toHaveLife(19);
  });
});
