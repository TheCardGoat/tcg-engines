import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { wageMightRed } from "./wage-might.ts";

/**
 * Wage Might (BET013) — Brute / Guardian Action - Attack, cost 3, 7{p}/2{d}.
 *
 * Printed: "When this attacks a hero, you may wager a Might token with them."
 */

describe("Wage Might family AAA", () => {
  it("happy: attacking a hero may wager a Might token; a hit awards it to you", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [wageMightRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(wageMightRed, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveTokenCount("might", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0).toHaveLife(13);
    expectFabCard(Bravo, wageMightRed).toBeIn("graveyard");
  });

  it("boundary: declining the wager still deals printed 7 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [wageMightRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(wageMightRed, { stopAt: "on-attack" });
    Bravo.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0).toHaveLife(13);
  });

  it("timing: a miss still opened the on-attack wager window", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [wageMightRed],
        resourcePoints: 3,
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
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(wageMightRed, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20).toHaveTokenCount("might", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("might", 0);
  });
});
