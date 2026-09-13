import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { hellHammer } from "./hell-hammer.ts";

/**
 * Hell Hammer (DTD105) — Shadow Brute Weapon - Hammer (2H), 6{p}, Blood Debt.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack
 *   When the combat chain closes, if you've attacked with this, banish it.
 *   Blood Debt
 */

describe("Hell Hammer (DTD105) AAA", () => {
  it("happy: attacking with the hammer banishes it when the combat chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [hellHammer],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activateAttack(hellHammer);
    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Rhinar, hellHammer).toBeBanished();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: a chain closed without attacking with the hammer leaves it equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [hellHammer],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Rhinar, hellHammer).toBeIn("weapon1");
  });
});
