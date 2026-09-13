import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { cullRed } from "../actions/cull.ts";
import { shadenSwingYellow } from "../actions/shaden-swing.ts";
import { hexagoreTheDeathHydra } from "./hexagore-the-death-hydra.ts";

/**
 * Hexagore, the Death Hydra (FAB186) — Shadow Brute Weapon - Flail (2H), 6{p}.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}: Attack
 *   Whenever you attack with Hexagore, it deals damage to you equal to 6 minus
 *   the number of cards with blood debt in your banished zone.
 */

describe("Hexagore, the Death Hydra (FAB186) AAA", () => {
  it("happy: with no blood debt banished, the hydra deals its controller 6 on attack", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [hexagoreTheDeathHydra],
        life: 25,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activateAttack(hexagoreTheDeathHydra);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Rhinar).toHaveLife(19);
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });

  it("boundary: each banished blood debt card reduces the recoil damage", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        weapon1: [hexagoreTheDeathHydra],
        life: 25,
        banished: [cullRed, shadenSwingYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.activateAttack(hexagoreTheDeathHydra);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 6 − 2 blood debt cards = 4 recoil damage; the attack still lands for 6.
    expectFabPlayer(Rhinar).toHaveLife(21);
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });
});
