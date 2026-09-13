import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { wageGoldBlue } from "./wage-gold.ts";
import { doubleDownRed } from "./double-down.ts";

/**
 * Double Down (HVY176) — Guardian/Warrior Action.
 *
 * Printed delayed effect: the next attack that wagers this turn gets +3 power
 * and overpower. Wager-created tokens are also increased by one this turn.
 */

describe("Double Down (HVY176) AAA", () => {
  it("happy: the next wagering attack gets +3 power and overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [doubleDownRed, wageGoldBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(doubleDownRed);
    game.helpers.resolveUntilIdle({ optionals: "decline" });
    Bravo.playAttack(wageGoldBlue, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectCombat(game).toHaveAttackPower(8).toHaveKeyword("overpower");

    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Bravo).toHaveTokenCount("gold", 2);
  });

  it("boundary: declining the wager does not consume or apply the delayed trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [doubleDownRed, wageGoldBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(doubleDownRed);
    game.helpers.resolveUntilIdle({ optionals: "decline" });
    Bravo.playAttack(wageGoldBlue, { stopAt: "on-attack" });
    Bravo.decline();
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectCombat(game).toHaveAttackPower(5).notToHaveKeyword("overpower");
  });

  it("timing: only the first wagering attack this turn receives the bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [doubleDownRed, wageGoldBlue, wageGoldBlue],
        resourcePoints: 8,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 30, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(doubleDownRed);
    game.helpers.resolveUntilIdle({ optionals: "decline" });

    Bravo.playAttack(wageGoldBlue, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(8);
    game.closeCombat({ ordering: "listed" });

    Bravo.playAttack(wageGoldBlue, { stopAt: "on-attack" });
    Bravo.accept();
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(5);
  });
});
