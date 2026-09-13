import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { harvestSeasonRed } from "../actions/harvest-season.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rotwoodReaper } from "./rotwood-reaper.ts";

/**
 * Rotwood Reaper (FLR002) — Earth Runeblade Weapon - Sword - 2H, base
 * 2{p}.
 * Printed: "Once per Turn Action - {r}{r}: Attack. If you've played or
 * created an aura this turn, this gets +2{p}."
 */

describe("Rotwood Reaper (FLR002) AAA", () => {
  it("happy: an aura played this turn raises this to 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [rotwoodReaper],
        hand: [harvestSeasonRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.play(harvestSeasonRed);
    game.helpers.resolveUntilIdle();
    Briar.activateAttack(rotwoodReaper);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: with no aura this turn this stays 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [rotwoodReaper],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.activateAttack(rotwoodReaper);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: a non-aura play does not raise this", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [rotwoodReaper],
        hand: [snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });
    Briar.activateAttack(rotwoodReaper);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(2);
  });
});
