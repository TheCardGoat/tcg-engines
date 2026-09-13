import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { bellyBusterRed } from "./belly-buster.ts";
import { nimblismBlue } from "./nimblism.ts";
import { valiantThrustRed } from "./valiant-thrust.ts";

/**
 * Belly Buster (AOL010) — Warrior Action, cost 1, go again.
 *
 * Printed: "Your next Warrior attack this turn gets +3{p} and "When this
 * attacks a hero, you may wager with them. The winner creates a Courage
 * token."\nGo again"
 */

describe("Belly Buster (AOL010) AAA", () => {
  it("happy: the next Warrior attack gets +3 and a hit wins the wager's Courage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bellyBusterRed, valiantThrustRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(bellyBusterRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(valiantThrustRed, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(13).toHaveTokenCount("courage", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("courage", 1);
  });

  it("boundary: declining the wager deals printed damage but creates no Courage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bellyBusterRed, valiantThrustRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(bellyBusterRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(valiantThrustRed, { stopAt: "on-attack" });
    Bravo.decline();
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(13).toHaveTokenCount("courage", 0);
    expectFabPlayer(Bravo).toHaveTokenCount("courage", 0);
  });

  it("timing: a missed attack hands the wager's Courage to the defender", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [bellyBusterRed, valiantThrustRed],
        resourcePoints: 2,
        actionPoints: 2,
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

    Bravo.play(bellyBusterRed);
    game.helpers.resolveUntilIdle();
    Bravo.playAttack(valiantThrustRed, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20).toHaveTokenCount("courage", 1);
    expectFabPlayer(Bravo).toHaveTokenCount("courage", 0);
  });
});
