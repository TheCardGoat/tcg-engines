import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { hatchetOfMind } from "./hatchet-of-mind.ts";
import { hatchetOfBody } from "./hatchet-of-body.ts";

/**
 * Hatchet of Body (BOL003) — Warrior Weapon Axe 1H, power 2.
 *
 * Printed:
 *   Once per Turn Action - {r}: Attack
 *   Whenever you attack with Hatchet of Body, if Hatchet of Mind was the last
 *   attack this turn, Hatchet of Body gains +1{p} until end of turn.
 */

describe("Hatchet of Body (BOL003) AAA", () => {
  it("happy: activateAttack opens combat at printed 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [hatchetOfBody],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Boltyn = game.as(boltyn);

    expectFabCard(Boltyn, hatchetOfBody).toBeIn("weapon1");
    Boltyn.activateAttack(hatchetOfBody);

    expectCombat(game).toBeOpen();
    expectCombat(game).toHaveAttackPower(2);
  });

  it("boundary: first attack this turn stays at 2{p} when Mind was not last", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [hatchetOfBody],
        weapon2: [hatchetOfMind],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Boltyn = game.as(boltyn);

    Boltyn.activateAttack(hatchetOfBody);

    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: after Mind was the last attack this turn, Body attacks for 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        weapon1: [hatchetOfBody],
        weapon2: [hatchetOfMind],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );
    const Boltyn = game.as(boltyn);

    Boltyn.activateAttack(hatchetOfMind);
    game.closeCombat();
    Boltyn.activateAttack(hatchetOfBody);

    expectCombat(game).toHaveAttackPower(3);
  });
});
