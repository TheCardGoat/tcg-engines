import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { nerveScalpel } from "../weapons/nerve-scalpel.ts";
import { prowlRed } from "../actions/prowl.ts";
import { snatchRed } from "../actions/snatch.ts";
import { twoSidesToTheBladeRed } from "./two-sides-to-the-blade.ts";

/**
 * Two Sides to the Blade (HNT051) — Assassin Attack Reaction, cost 1, 3{d}.
 *
 * Printed: Choose 1;
 *   - Target dagger attack gets +3{p}.
 *   - Target attack action card with stealth gets +3{p} and
 *     "When this hits a hero, mark them."
 */

describe("Two Sides to the Blade (HNT051) AAA", () => {
  it("happy: dagger mode gives a dagger attack +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [nerveScalpel],
        hand: [twoSidesToTheBladeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.activate(nerveScalpel);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(twoSidesToTheBladeRed, {
      modeIds: ["wNtNbFgrfzcjJTMwRbkcg:chooseDaggerOrStealthMode:boostDagger"],
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Arakni, twoSidesToTheBladeRed).toBeIn("graveyard");
  });

  it("happy: stealth mode gives a stealth attack +3{p} and marks on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [prowlRed, twoSidesToTheBladeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);
    const Dash = game.as(dash);

    Arakni.must.playAttack(prowlRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(twoSidesToTheBladeRed, {
      modeIds: ["wNtNbFgrfzcjJTMwRbkcg:chooseDaggerOrStealthMode:boostStealthAndMarkOnHit"],
    });
    game.passBoth();

    expectCombat(game).toHaveAttackPower(6);
    expectFabPlayer(Dash).notToBeMarked();

    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Dash).toBeMarked();
  });

  it("boundary: dagger mode does not buff a non-dagger attack", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [snatchRed, twoSidesToTheBladeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() =>
      Arakni.must.playReaction(twoSidesToTheBladeRed, {
        modeIds: ["wNtNbFgrfzcjJTMwRbkcg:chooseDaggerOrStealthMode:boostDagger"],
      }),
    );

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Arakni, twoSidesToTheBladeRed).toBeIn("hand");
  });

  it("boundary: stealth mode does not buff a non-stealth attack", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [snatchRed, twoSidesToTheBladeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() =>
      Arakni.must.playReaction(twoSidesToTheBladeRed, {
        modeIds: ["wNtNbFgrfzcjJTMwRbkcg:chooseDaggerOrStealthMode:boostStealthAndMarkOnHit"],
      }),
    );

    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Arakni, twoSidesToTheBladeRed).toBeIn("hand");
  });
});
