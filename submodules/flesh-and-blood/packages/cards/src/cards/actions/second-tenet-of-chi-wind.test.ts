import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zen } from "../heroes/zen.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { secondTenetOfChiWindBlue } from "./second-tenet-of-chi-wind.ts";

/**
 * Second Tenet of Chi: Wind (MST083) — go again if you've transcended this turn.
 */

describe("Second Tenet of Chi: Wind (MST083) AAA", () => {
  it("boundary: without transcending this turn there is no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [secondTenetOfChiWindBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.attackWith(secondTenetOfChiWindBlue);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveAP(0);
  });

  it("happy: printed 5{p} hits", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [secondTenetOfChiWindBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.attackWith(secondTenetOfChiWindBlue);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [secondTenetOfChiWindBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Zen = game.as(zen);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Zen.defendWith([secondTenetOfChiWindBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveLife(19);
  });
});
