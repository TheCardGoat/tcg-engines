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
import { might } from "../tokens/might.ts";
import { vigor } from "../tokens/vigor.ts";
import { laughingKneeSlappers } from "./laughing-knee-slappers.ts";

/**
 * Laughing Knee Slappers (SUP065) — Equipment - Legs. (Blade Break)
 * Printed: "If you control a Toughness and a Vigor token, this gets
 * +2{d}."
 */

describe("Laughing Knee Slappers (SUP065) AAA", () => {
  it("happy: Might + Vigor together raise this to 3{d} (blocks 4 with Nimblism)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [nimblismBlue],
        legs: [laughingKneeSlappers],
        arena: [might, vigor],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([laughingKneeSlappers, nimblismBlue]);
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
        legs: [laughingKneeSlappers],
        arena: [might],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith([laughingKneeSlappers, nimblismBlue]);
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
        legs: [laughingKneeSlappers],
        arena: [might, vigor],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(laughingKneeSlappers);
    game.helpers.resolveRestOfCombat();

    // 1 + 2 = 3: 1 damage carries even without a co-defender.
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });
});
