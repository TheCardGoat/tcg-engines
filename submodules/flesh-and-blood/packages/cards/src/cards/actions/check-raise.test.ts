import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { checkRaiseBlue } from "./check-raise.ts";
import { nimblismBlue } from "./nimblism.ts";
import { wageGoldRed } from "./wage-gold.ts";

/**
 * Check-Raise (AOL024) — Warrior Action, cost 0, go again.
 *
 * Printed: "The next time an attack you control wagers this turn, it gets
 * +2{p}.\nGo again" (blue)
 */

describe("Check-Raise (AOL024) AAA", () => {
  it("happy: the next wagering attack gets +2 power when it wagers", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [checkRaiseBlue, wageGoldRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(checkRaiseBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(9);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(11);
    expectFabCard(Bravo, checkRaiseBlue).toBeIn("graveyard");
  });

  it("boundary: declining the wager leaves the attack at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [checkRaiseBlue, wageGoldRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(checkRaiseBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Bravo.decline();
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(13);
  });

  it("timing: a fully defended wagering attack still grants the +2 and misses", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [checkRaiseBlue, wageGoldRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(checkRaiseBlue);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(wageGoldRed, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(9);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
  });
});
