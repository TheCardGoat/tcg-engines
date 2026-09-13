import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { boltOfCourageRed } from "./bolt-of-courage.ts";
import { vOfTheVanguardYellow } from "./v-of-the-vanguard.ts";

/**
 * V of the Vanguard, Yellow (BOL009) — Boltyn Specialization Attack Action.
 *
 * Printed: "Boltyn Specialization / As an additional cost to play V of the
 * Vanguard, you may charge your hero's soul any number of times. / Attacks
 * on this combat chain gain +1{p} for each Light card charged this way."
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability), CR 6.2 (layer-continuous
 *     modify-numeric on every Attack of this combat chain), CR 8.5.29
 *     (Charge additional cost), CR 2.9 (power).
 *   behaviorConstraints:
 *     - Each LIGHT card charged to the soul while playing V adds +1{p} to
 *       every Attack on this combat chain (V itself included).
 *     - Charging a non-Light card adds nothing (the count filters Light).
 *     - Declining the optional charge leaves V at its printed 3{p}.
 *   testImplications:
 *     - Light-charged V reads 4{p} with the charged card in the soul; a later
 *       attack on the same chain also gets +1{p}; 0-charge and non-Light
 *       boundaries stay at printed 3{p}. Repeat charge ("any number of times")
 *       is still a single chargeInstanceId and is not asserted here.
 */

describe("V of the Vanguard (BOL009) AAA", () => {
  it("happy: charging one Light card grants +1{p} to V", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [vOfTheVanguardYellow, boltOfCourageRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    // The optional additional cost charges Bolt of Courage (Light) to soul.
    Boltyn.attackWith(vOfTheVanguardYellow, {
      charge: true,
      chargeCard: boltOfCourageRed,
    });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Boltyn, boltOfCourageRed).toBeIn("soul");
  });

  it("boundary: declining the optional charge leaves V at printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [vOfTheVanguardYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(vOfTheVanguardYellow);
    game.advanceCombatTo("defend");

    // No card charged this way: zero Light charges, zero bonus.
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: charging a non-Light card does not count", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [vOfTheVanguardYellow, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(vOfTheVanguardYellow, {
      charge: true,
      chargeCard: nimblismBlue,
    });
    game.advanceCombatTo("defend");

    // Nimblism is Generic, not Light: the count stays 0.
    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
  });

  it("timing: a later attack on the same chain also gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [vOfTheVanguardYellow, boltOfCourageRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(vOfTheVanguardYellow, {
      charge: true,
      chargeCard: boltOfCourageRed,
    });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);

    game.advanceCombatTo("resolution");
    Boltyn.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
  });
});
