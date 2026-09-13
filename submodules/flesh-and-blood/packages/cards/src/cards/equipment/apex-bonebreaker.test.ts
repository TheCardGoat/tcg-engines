import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { debilitateBlue } from "../actions/debilitate.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { apexBonebreaker } from "./apex-bonebreaker.ts";

/**
 * Apex Bonebreaker (HVY008) — Brute Equipment - Arms. (Temper)
 * Printed: "When this defends together with a card with 6 or more {p},
 * create a Might token."
 */

describe("Apex Bonebreaker (HVY008) AAA", () => {
  it("happy: defending together with a 6{p}+ card creates a Might token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [debilitateBlue], arms: [apexBonebreaker], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([apexBonebreaker, debilitateBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveTokenCount("might", 1);
  });

  it("boundary: defending together with a sub-6{p} card creates nothing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [nimblismBlue], arms: [apexBonebreaker], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith([apexBonebreaker, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0);
  });

  it("timing: the Might token is created even when the pair fully blocks", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [debilitateBlue, nimblismBlue],
        arms: [apexBonebreaker],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([apexBonebreaker, debilitateBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveTokenCount("might", 1);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
