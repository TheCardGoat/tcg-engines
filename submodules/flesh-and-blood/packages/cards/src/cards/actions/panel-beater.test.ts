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
import { panelBeaterRed } from "./panel-beater.ts";

/**
 * Panel Beater (EVO213) — Mechanologist Action - Attack, cost 2, 5{p}, 3{d},
 * Boost.
 *
 * Printed: "Boost. This gets +X{p}, where X is the number of equipment
 * defending it."
 */

describe("Panel Beater (EVO213) AAA", () => {
  it("happy: one defending equipment grants +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [panelBeaterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, arms: [ironrotGauntlet], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(panelBeaterRed);
    expectCombat(game).toHaveAttackPower(5);
    game.advanceCombatTo("defend");
    Bravo.defendWith(ironrotGauntlet);

    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: a non-equipment defender does not grant +X{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [panelBeaterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(panelBeaterRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(snatchRed);

    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: boosting grants go again and banishes the top card", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [panelBeaterRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, grindingGearsBlue],
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.attackWith(panelBeaterRed, { boost: true });
    expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
    expectFabCard(Teklo, grindingGearsBlue).toBeBanished();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Teklo).toHaveAP(1);
    expectFabPlayer(game.as(fai)).toHaveLife(15);
  });
});
