import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { confidence } from "../tokens/confidence.ts";
import { toughness } from "../tokens/toughness.ts";
import { plateOfToughLove } from "./plate-of-tough-love.ts";

/**
 * Plate Of Tough Love (SUP011) — Equipment - Chest. (Blade Break)
 * Printed: "If you control a Toughness and a Vigor token, this gets
 * +2{d}."
 */

describe("Plate Of Tough Love (SUP011) AAA", () => {
  it("happy: Confidence + Toughness together raise this to 3{d} (blocks 4 with Nimblism)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [nimblismBlue],
        chest: [plateOfToughLove],
        arena: [confidence, toughness],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([plateOfToughLove, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    // 1{d} + 2 rider + Nimblism 2{d} = 5: fully blocked.
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: only one of the pair leaves this at printed 1{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [nimblismBlue],
        chest: [plateOfToughLove],
        arena: [confidence],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith([plateOfToughLove, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    // 1 + 2 = 3: 1 damage carries.
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });

  it("timing: the rider applies even defending alone (3{d} vs the 4{p} hit)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [],
        chest: [plateOfToughLove],
        arena: [confidence, toughness],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(plateOfToughLove);
    game.helpers.resolveRestOfCombat();

    // 1 + 2 = 3: 1 damage carries even without a co-defender.
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });
});
