import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { betsy } from "../heroes/betsy.ts";
import { nimblismBlue } from "./nimblism.ts";
import { betBigRed } from "./bet-big.ts";

/**
 * Bet Big (HVY057) — Guardian Action - Attack, cost 4, 8{p}, Betsy specialization.
 *
 * Printed: When this attacks a hero, you may wager a Gold, Might, and Vigor
 * token with them.
 */

describe("Bet Big (HVY057) AAA", () => {
  it("happy: a hit awards Gold, Might, and Vigor to the attacker", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: [betBigRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);

    Betsy.playAttack(betBigRed, { stopAt: "on-attack" });
    Betsy.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat();

    expectFabPlayer(Betsy)
      .toHaveTokenCount("gold", 1)
      .toHaveTokenCount("might", 1)
      .toHaveTokenCount("vigor", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("gold", 0).toHaveLife(12);
    expectFabCard(Betsy, betBigRed).toBeIn("graveyard");
  });

  it("boundary: declining the wager still deals printed 8 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: [betBigRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);

    Betsy.playAttack(betBigRed, { stopAt: "on-attack" });
    Betsy.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();

    expectFabPlayer(Betsy)
      .toHaveTokenCount("gold", 0)
      .toHaveTokenCount("might", 0)
      .toHaveTokenCount("vigor", 0);
    expectFabPlayer(game.as(dash)).toHaveLife(12);
  });

  it("timing: a miss awards the wagered tokens to the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: [betBigRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);
    const Dash = game.as(dash);

    Betsy.playAttack(betBigRed, { stopAt: "on-attack" });
    Betsy.accept();
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash)
      .toHaveLife(20)
      .toHaveTokenCount("gold", 1)
      .toHaveTokenCount("might", 1)
      .toHaveTokenCount("vigor", 1);
    expectFabPlayer(Betsy).toHaveTokenCount("gold", 0);
  });
});
