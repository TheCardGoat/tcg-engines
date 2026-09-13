import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { mercilessBattleaxe } from "./merciless-battleaxe.ts";

/**
 * Merciless Battleaxe (DYN068) — Warrior Weapon - Axe (2H), 3{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}{r}: Attack
 *   When this attacks, if the attack's {p} is greater than twice its base,
 *   the attack gets overpower.
 *
 * The overpower grant lives only in this conditional: this suite owns the
 * power comparison and the CR 8.3.22 defend rejection it produces.
 */

describe("Merciless Battleaxe (DYN068) AAA", () => {
  it("happy: at 7{p} (> 2x base) the attack gets overpower and rejects a two-action defend", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [{ card: mercilessBattleaxe, state: { powerCounterTotal: 4 } }],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.activateAttack(mercilessBattleaxe);
    expectCombat(game).toHaveAttackPower(7);
    expectCombat(game).toHaveKeyword("overpower");

    const rejection = Dash.expectFailure({
      move: "defend",
      payload: {
        instanceIds: Dash.findCardsInZone("hand", [snatchRed, nimblismBlue]),
      },
    });
    expect(rejection.errorCode).toBe("overpower");

    Dash.defendWith(snatchRed);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    // 7 − 2{d}
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: at base 3{p} the attack has no overpower and two actions may defend", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [mercilessBattleaxe],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.activateAttack(mercilessBattleaxe);
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).notToHaveKeyword("overpower");

    Dash.defendWith(snatchRed, nimblismBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    // 3 − (2{d} + 2{d}) = 0
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: at exactly twice its base (6{p}) the attack does not get overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [{ card: mercilessBattleaxe, state: { powerCounterTotal: 3 } }],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.activateAttack(mercilessBattleaxe);
    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).notToHaveKeyword("overpower");
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });
});
