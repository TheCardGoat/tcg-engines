import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { boltOfCourageYellow } from "./bolt-of-courage.ts";
import { beamingBravadoYellow } from "./beaming-bravado.ts";
import { boltingBladeYellow } from "./bolting-blade.ts";

/**
 * Bolting Blade (MON032) — "costs {r}{r} less to play for each time you've
 * charged this turn." Cost 4, 7{p}.
 *
 * Encoded amount is `count charged-this-way per turn` (1 per charge, not 2).
 */

describe("Bolting Blade (MON032) AAA", () => {
  it("happy: one charge this turn lets 3{r} pay the 4{r} printed cost", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [beamingBravadoYellow, boltOfCourageYellow, boltingBladeYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(beamingBravadoYellow, {
      charge: true,
      chargeCard: boltOfCourageYellow,
    });
    game.advanceCombatTo("resolution");
    Boltyn.playAttack(boltingBladeYellow);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
    expectFabPlayer(Boltyn).toHaveResourceCount(0);
  });

  it("boundary: with no charges, 3{r} cannot pay 4{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [boltingBladeYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    expect(() => Boltyn.playAttack(boltingBladeYellow)).toThrow();
    expectFabPlayer(Boltyn).toHaveResourceCount(3);
  });

  it("timing: a charge this turn still discounts after the charging attack closes", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [beamingBravadoYellow, boltOfCourageYellow, boltingBladeYellow],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(beamingBravadoYellow, {
      charge: true,
      chargeCard: boltOfCourageYellow,
    });
    game.closeCombat({ optionals: "decline" });
    Boltyn.playAttack(boltingBladeYellow);
    expectFabPlayer(Boltyn).toHaveResourceCount(0);
  });
});
