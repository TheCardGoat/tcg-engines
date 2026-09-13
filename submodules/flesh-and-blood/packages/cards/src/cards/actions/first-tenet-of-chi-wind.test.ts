import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { zen } from "../heroes/zen.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { firstTenetOfChiWindBlue } from "./first-tenet-of-chi-wind.ts";

/**
 * First Tenet of Chi: Wind (MST094) — next blue action this turn gets go again.
 */

describe("First Tenet of Chi: Wind (MST094) AAA", () => {
  it("happy: the next blue action gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [firstTenetOfChiWindBlue, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(firstTenetOfChiWindBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Zen).toHaveAP(1);
    Zen.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(Zen).toHaveAP(1);
  });

  it("boundary: a Red action does not get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [firstTenetOfChiWindBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(firstTenetOfChiWindBlue);
    game.helpers.resolveUntilIdle();
    Zen.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveAP(0);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [firstTenetOfChiWindBlue],
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
    Zen.defendWith([firstTenetOfChiWindBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Zen).toHaveLife(19);
  });
});
