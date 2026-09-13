import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhimGrandfatherOfEternity } from "../heroes/oldhim-grandfather-of-eternity.ts";
import { fertileGroundBlue } from "../instants/fertile-ground.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { strongWoodRed } from "./strong-wood.ts";
import { strongWoodYellow } from "./strong-wood.ts";

/**
 * Strong Wood (TER012) — Elemental Guardian Attack.
 *
 * Printed: Earth Bond - If an Earth card was pitched to play this, this
 * gets +1{p}.
 */

describe("Strong Wood (TER012) AAA", () => {
  it("happy: pitching an Earth card gives this +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [strongWoodRed, fertileGroundBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.playAttack(strongWoodRed, { pitch: [fertileGroundBlue] });
    game.advanceCombatTo("defend");

    // Printed 6 + Earth Bond +1 = 7.
    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Oldhim, fertileGroundBlue).toBeIn("pitch");
  });

  it("boundary: pitching a non-Earth card leaves printed 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [strongWoodRed, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.playAttack(strongWoodRed, { pitch: [nimblismBlue] });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Oldhim, nimblismBlue).toBeIn("pitch");
  });

  it("timing: the Earth Bond +1{p} is this-turn only", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [strongWoodRed, fertileGroundBlue, snatchRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);
    const Dash = game.as(dash);

    Oldhim.playAttack(strongWoodRed, { pitch: [fertileGroundBlue] });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveRestOfCombat();

    Oldhim.endTurn();
    Dash.endTurn();
    game.helpers.untilIdle();

    Oldhim.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});

/**
 * Strong Wood (TER016) — Elemental Guardian Attack.
 *
 * Printed: Earth Bond - If an Earth card was pitched to play this, this
 * gets +1{p}.
 */

describe("Strong Wood (TER016) AAA", () => {
  it("happy: pitching an Earth card gives this +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [strongWoodYellow, fertileGroundBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.playAttack(strongWoodYellow, { pitch: [fertileGroundBlue] });
    game.advanceCombatTo("defend");

    // Printed 5 + Earth Bond +1 = 6.
    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Oldhim, fertileGroundBlue).toBeIn("pitch");
  });

  it("boundary: pitching a non-Earth card leaves printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [strongWoodYellow, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);

    Oldhim.playAttack(strongWoodYellow, { pitch: [nimblismBlue] });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Oldhim, nimblismBlue).toBeIn("pitch");
  });

  it("timing: the Earth Bond +1{p} is this-turn only", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhimGrandfatherOfEternity,
        hand: [strongWoodYellow, fertileGroundBlue, snatchRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhimGrandfatherOfEternity);
    const Dash = game.as(dash);

    Oldhim.playAttack(strongWoodYellow, { pitch: [fertileGroundBlue] });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(6);
    game.helpers.resolveRestOfCombat();

    Oldhim.endTurn();
    Dash.endTurn();
    game.helpers.untilIdle();

    Oldhim.attackWith(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
