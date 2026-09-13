import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { bravo } from "../heroes/bravo.ts";
import { fai } from "../heroes/fai.ts";
import { ironrotGauntlet } from "../equipment/ironrot-gauntlet.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { snatchRed } from "./snatch.ts";
import { fenderBenderRed } from "./fender-bender.ts";

/**
 * Fender Bender (EVO210) — Mechanologist Action - Attack, cost 1, 4{p}, 3{d},
 * Boost.
 *
 * Printed: "Boost. This gets +X{p}, where X is the number of equipment
 * defending it."
 */

describe("Fender Bender family AAA", () => {
  it("happy: one defending equipment grants +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fenderBenderRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, arms: [ironrotGauntlet], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(fenderBenderRed);
    expectCombat(game).toHaveAttackPower(4);
    game.advanceCombatTo("defend");
    Bravo.defendWith(ironrotGauntlet);

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: a non-equipment defender does not grant +X{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fenderBenderRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(fenderBenderRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(snatchRed);

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: boosting grants go again and banishes the top card", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [fenderBenderRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, grindingGearsBlue],
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(fenderBenderRed, { boost: true });
    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Teklo).toHaveAP(1);
    expectFabPlayer(game.as(fai)).toHaveLife(16);
  });
});
