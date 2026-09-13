import { describe, expect, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { crossTheLineRed } from "../actions/cross-the-line.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { raydnDuskbane } from "./raydn-duskbane.ts";

/**
 * Raydn, Duskbane (MON031) — Light Warrior Weapon - Sword - 2H, base
 * 0{p}.
 * Printed: "Once per Turn Action - 0: Attack. If you've charged this
 * turn, Raydn gains +3{p}."
 */

describe("Raydn, Duskbane (MON031) AAA", () => {
  it("happy: charging this turn raises Raydn to 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [raydnDuskbane],
        hand: [crossTheLineRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(crossTheLineRed, {
      charge: true,
      chargeCard: nimblismBlue,
    });
    game.closeCombat();
    Boltyn.activateAttack(raydnDuskbane);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: without charging this turn Raydn stays 0{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [raydnDuskbane],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.activateAttack(raydnDuskbane);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(0);
  });

  it("timing: the activation is once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [raydnDuskbane],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.activateAttack(raydnDuskbane);
    game.closeCombat();

    expect(() => Boltyn.activateAttack(raydnDuskbane)).toThrow();
  });
});
