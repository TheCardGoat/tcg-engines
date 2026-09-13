import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { betsy } from "../heroes/betsy.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { pileDriver } from "./pile-driver.ts";

/**
 * Pile Driver (OMN230) — Guardian Weapon Log 2H 6{p}, Betsy specialization.
 *
 * Printed:
 *   Action - {r}{r}{r}{r}, {t}: Attack
 *   When this attacks, you may wager a Gold token with the defending hero.
 */

describe("Pile Driver (OMN230) AAA", () => {
  it("happy: attacking a hero may wager Gold and a hit awards Gold to the attacker", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        weapon1: [pileDriver],
        hand: [],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);

    Betsy.activateAttack(pileDriver, { stopAt: "on-attack" });
    Betsy.accept();
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat();

    expectFabPlayer(Betsy).toHaveTokenCount("gold", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("gold", 0).toHaveLife(14);
  });

  it("boundary: declining the wager still deals printed 6 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        weapon1: [pileDriver],
        hand: [],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);

    Betsy.activateAttack(pileDriver, { stopAt: "on-attack" });
    Betsy.decline();
    game.advanceUntil({ stopAt: "defend" });
    game.closeCombat();

    expectFabPlayer(Betsy).toHaveTokenCount("gold", 0);
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("timing: a miss awards the wagered Gold to the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        weapon1: [pileDriver],
        hand: [],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Betsy = game.as(betsy);
    const Dash = game.as(dash);

    Betsy.activateAttack(pileDriver, { stopAt: "on-attack" });
    Betsy.accept();
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Betsy).toHaveTokenCount("gold", 0);
    expectFabPlayer(Dash).toHaveTokenCount("gold", 1).toHaveLife(20);
    expectFabCard(Betsy, pileDriver).toBeIn("weapon1");
  });
});
