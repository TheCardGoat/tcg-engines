import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kayo } from "../heroes/kayo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { knucklehead } from "./knucklehead.ts";

/**
 * Knucklehead — Brute Head d2 (Kayo Specialization), Temper.
 *
 * Printed: "Action - Destroy this: Roll a 6 sided die. Until end of turn, your
 * base {i} is the number rolled. Temper"
 */

describe("Knucklehead AAA", () => {
  it("happy: destroying the head rolls a die and base intellect becomes the roll", () => {
    const game = FabTestEngine.start(
      { hero: kayo, head: [knucklehead], hand: [], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.activate(knucklehead);
    game.untilIdle();

    expectFabCard(Kayo, knucklehead).toBeIn("graveyard");
    const roll = game.lastDieFace();

    // End phase draws up to base intellect — now the rolled number.
    Kayo.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Kayo).toHaveHandCount(roll);
  });

  it("keyword: Temper puts a -1{d} counter on the head after it defends", () => {
    const game = FabTestEngine.start(
      { hero: kayo, head: [knucklehead], hand: [], deck: 6 },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Kayo = game.as(kayo);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    Kayo.defendWith(knucklehead);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Kayo, knucklehead).toHaveDefenseCounters(-1);
    expectFabCard(Kayo, knucklehead).toBeIn("head");
  });
});
