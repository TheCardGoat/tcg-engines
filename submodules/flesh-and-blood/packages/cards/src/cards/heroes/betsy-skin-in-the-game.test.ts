import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { wageGoldRed } from "../actions/wage-gold.ts";
import { snatchRed } from "../actions/snatch.ts";
import { betsySkinInTheGame } from "./betsy-skin-in-the-game.ts";

/**
 * Betsy, Skin in the Game (HVY045) — Guardian Hero, 40{h}.
 *
 * Printed: Whenever an attack you control wagers, you may pay {r}{r}. If you
 * do, the attack gets +1{p} and overpower.
 */

describe("Betsy, Skin in the Game (HVY045) AAA", () => {
  it("happy: paying {r}{r} on a wager grants +1{p} and overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: betsySkinInTheGame,
        hand: [wageGoldRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsySkinInTheGame);

    Betsy.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Betsy.accept();
    game.advanceUntil({ stopAt: "defend", optionals: "accept" });

    expectCombat(game).toHaveAttackPower(8).toHaveKeyword("overpower");
  });

  it("boundary: declining the {r}{r} leaves printed 7{p} without overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: betsySkinInTheGame,
        hand: [wageGoldRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsySkinInTheGame);

    Betsy.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Betsy.decline();
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(7).notToHaveKeyword("overpower");
  });

  it("timing: a non-wager attack is unaffected", () => {
    const game = FabTestEngine.start(
      {
        hero: betsySkinInTheGame,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(betsySkinInTheGame).playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(4).notToHaveKeyword("overpower");
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
