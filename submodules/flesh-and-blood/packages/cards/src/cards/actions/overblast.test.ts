import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { zeroToSixtyYellow } from "./zero-to-sixty.ts";
import { fai } from "../heroes/fai.ts";
import { overblastRed } from "./overblast.ts";

/**
 * Overblast (CRU112) — Mechanologist Action - Attack.
 * Printed: "Overblast gains +X{p}, where X is the number of times you have
 * boosted this combat chain."
 *
 * X counts THIS combat chain's boosts only (CR 8.3.9 Boost): each boosted
 * attack on the open chain adds +1{p} to Overblast's power at its Defend
 * Step (CR 7.3.1); a closed chain's boosts and non-boost attacks count 0.
 */

describe("Overblast (CRU112) AAA", () => {
  it("happy: one boost this combat chain grants +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed, overblastRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: fai, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    Dash.attackWith(overblastRed);

    expectCombat(game).toHaveAttackPower(6);
  });

  it("scaling: two boosts this combat chain grant +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed, zeroToSixtyYellow, overblastRed],
        resourcePoints: 3,
        actionPoints: 3,
        deck: 6,
      },
      { hero: fai, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    Dash.attackWith(zeroToSixtyYellow, { boost: true });
    game.advanceCombatTo("resolution");
    Dash.attackWith(overblastRed);

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a non-boost attack on the chain grants nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed, overblastRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: fai, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(zeroToSixtyRed);
    game.advanceCombatTo("resolution");
    Dash.attackWith(overblastRed);

    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: boosts on a CLOSED chain do not carry over", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed, overblastRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: fai, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(zeroToSixtyRed, { boost: true });
    game.helpers.resolveRestOfCombat();

    // New combat chain — the previous chain's single boost counts 0.
    Dash.attackWith(overblastRed);

    expectCombat(game).toHaveAttackPower(5);
  });
});
