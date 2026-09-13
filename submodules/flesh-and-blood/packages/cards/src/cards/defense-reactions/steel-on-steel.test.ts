import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { katsu } from "../heroes/katsu.ts";
import { bravo } from "../heroes/bravo.ts";
import { galaxxiBlack } from "../weapons/galaxxi-black.ts";
import { snatchRed } from "../actions/snatch.ts";
import { steelOnSteelRed } from "./steel-on-steel.ts";

/**
 * Steel on Steel Red (MPW096) — Warrior Defense Reaction.
 *
 * Printed: While this is defending a weapon attack, this gets +1{d}.
 */

describe("Steel on Steel family AAA", () => {
  it("happy: defending a sword weapon attack, the +1{d} arm blocks fully", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon1: [galaxxiBlack], resourcePoints: 4, actionPoints: 1, deck: 6 },
      {
        hero: katsu,
        hand: [steelOnSteelRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Katsu = game.as(katsu);

    // Galaxxi Black: 4{p} sword. 3 base + 1 = full block.
    Bravo.activateAttack(galaxxiBlack);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Katsu.play(steelOnSteelRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Katsu).toHaveLife(20); // 4 - (3 + 1) full block
  });

  it("boundary: defending an attack action keeps the printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [steelOnSteelRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    game.as(bravo).attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    game.as(bravo).pass();
    Katsu.play(steelOnSteelRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Katsu).toHaveLife(19); // 4{p} vs printed 3{d}
  });
});
