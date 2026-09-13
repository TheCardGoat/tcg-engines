import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { weaveEarthRed } from "./weave-earth.ts";

import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { entangleRed } from "./entangle.ts";

describe("Entangle (ELE013) AAA", () => {
  it("happy: fused hit gives their first attack next turn -2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [entangleRed, weaveEarthRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);
    Oldhim.playAttack(entangleRed, { fuse: true, fuseCards: [weaveEarthRed] });
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(13);
    Oldhim.endTurn();
    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(2);
  });

  it("boundary: unfused hit does not grant the fused rider", () => {
    const game = FabTestEngine.start(
      { hero: oldhim, hand: [entangleRed], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);
    Oldhim.playAttack(entangleRed);
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: oldhim, hand: [entangleRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Oldhim.defendWith([entangleRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Oldhim).toHaveLife(19);
  });
});
