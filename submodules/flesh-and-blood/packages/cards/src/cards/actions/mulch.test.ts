import { describe, expect, it } from "vitest";
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
import { mulchRed } from "./mulch.ts";

describe("Mulch (ELE019) AAA", () => {
  it("happy: fused hit puts their arsenal on the bottom of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [mulchRed, weaveEarthRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);
    Oldhim.playAttack(mulchRed, { fuse: true, fuseCards: [weaveEarthRed] });
    game.helpers.resolveRestOfCombat();
    expect(Dash.zone("deck")[0]).toBe(nimblismBlue.canonicalId);
    expect(Dash.zone("arsenal")).toHaveLength(0);
  });

  it("boundary: unfused hit does not grant the fused rider", () => {
    const game = FabTestEngine.start(
      { hero: oldhim, hand: [mulchRed], resourcePoints: 4, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);
    Oldhim.playAttack(mulchRed);
    expectCombat(game).toHaveAttackPower(8);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: oldhim, hand: [mulchRed], life: 20, deck: 6 },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Oldhim = game.as(oldhim);
    const Dash = game.as(dash);
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Oldhim.defendWith([mulchRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Oldhim).toHaveLife(19);
  });
});
