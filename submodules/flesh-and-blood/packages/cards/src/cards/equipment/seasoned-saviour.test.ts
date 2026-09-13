import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { seasonedSaviour } from "./seasoned-saviour.ts";

/**
 * Seasoned Saviour — Guardian Off-Hand d3, Battleworn.
 *
 * Printed: "When you equip Seasoned Saviour, put two -1{d} counters on it.
 * Battleworn"
 */

describe("Seasoned Saviour (DYN026) AAA", () => {
  it("happy: equipping it puts two -1{d} counters on it", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon1: [seasonedSaviour], hand: [], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.untilIdle();

    expectFabCard(Bravo, seasonedSaviour).toBeIn("weapon1");
    expectFabCard(Bravo, seasonedSaviour).toHaveDefenseCounters(-2);
  });

  it("boundary: defending adds the Battleworn counter on top of the two equip counters", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        weapon1: [seasonedSaviour],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(seasonedSaviour);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, seasonedSaviour).toBeIn("weapon1");
    expectFabCard(Bravo, seasonedSaviour).toHaveDefenseCounters(-3);
  });
});
