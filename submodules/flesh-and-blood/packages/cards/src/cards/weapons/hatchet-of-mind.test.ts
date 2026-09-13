import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { hatchetOfBody } from "./hatchet-of-body.ts";
import { hatchetOfMind } from "./hatchet-of-mind.ts";

/**
 * Hatchet of Mind (BOL004) — Warrior Weapon Axe 1H, power 2.
 *
 * Printed:
 *   Once per Turn Action - {r}: Attack
 *   Whenever you attack with Hatchet of Mind, if Hatchet of Body was the last
 *   attack this turn, Hatchet of Mind gains +1{p} until end of turn.
 */

describe("Hatchet of Mind (BOL004) AAA", () => {
  it("happy: activateAttack opens combat at printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [hatchetOfMind],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Boltyn = game.as(boltyn);

    expectFabCard(Boltyn, hatchetOfMind).toBeIn("weapon1");
    Boltyn.activateAttack(hatchetOfMind);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(2);
  });

  it("boundary: first attack this turn stays at 2{p} when Body was not last", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [hatchetOfMind],
        weapon2: [hatchetOfBody],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Boltyn = game.as(boltyn);

    Boltyn.activateAttack(hatchetOfMind);

    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: after Body was the last attack this turn, Mind attacks for 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [hatchetOfMind],
        weapon2: [hatchetOfBody],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Boltyn = game.as(boltyn);

    Boltyn.activateAttack(hatchetOfBody);
    game.closeCombat();
    Boltyn.activateAttack(hatchetOfMind);

    expectCombat(game).toHaveAttackPower(3);
  });
});
