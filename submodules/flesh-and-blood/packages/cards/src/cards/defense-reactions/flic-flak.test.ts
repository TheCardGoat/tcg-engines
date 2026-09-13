import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { katsu } from "../heroes/katsu.ts";
import { whelmingGustwaveBlue } from "../actions/whelming-gustwave.ts";
import { snatchRed } from "../actions/snatch.ts";
import { paddleFasterRed } from "../actions/paddle-faster.ts";
import { flicFlakRed } from "./flic-flak.ts";

/**
 * Flic Flak Red (WTR092) — Ninja Defense Reaction.
 *
 * Printed: If the next card you defend with this turn is a card with
 * combo, it gains +2{d}.
 */

describe("flic-flak family AAA", () => {
  it("happy: the next Combo card defended with gains +2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, paddleFasterRed],
        actionPoints: 2,
        resourcePoints: 4,
        deck: 6,
      },
      {
        hero: katsu,
        hand: [flicFlakRed, whelmingGustwaveBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Katsu = game.as(katsu);

    // Link 1: no defense; Flic Flak resolves in the reaction step, arming
    // its "next card you defend with this turn" latch.
    Bravo.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Katsu.defendWith();
    game.toReaction("defender");
    Katsu.play(flicFlakRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Katsu).toHaveLife(20); // 4 - 4 full block by the DR itself

    // Link 2: Whelming Gustwave has Combo and defends for 3 + 2.
    Bravo.playAttack(paddleFasterRed);
    game.advanceUntil({ stopAt: "defend" });
    Katsu.defendWith(whelmingGustwaveBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Katsu).toHaveLife(20);
  });

  it("boundary: without Flic Flak the combo card defends for its printed {d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: katsu,
        hand: [whelmingGustwaveBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Katsu = game.as(katsu);

    Bravo.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Katsu.defendWith(whelmingGustwaveBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Katsu).toHaveLife(19); // 20 - (4 - 3)
  });

  it("timing: a non-Combo next defender consumes the latch", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, paddleFasterRed, paddleFasterRed],
        actionPoints: 3,
        deck: 6,
      },
      {
        hero: katsu,
        hand: [flicFlakRed, snatchRed, whelmingGustwaveBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Katsu = game.as(katsu);

    Bravo.playAttack(snatchRed);
    Katsu.defendWith();
    game.toReaction("defender");
    Katsu.play(flicFlakRed);
    game.helpers.resolveUntilIdle();

    Bravo.playAttack(paddleFasterRed);
    Katsu.defendWith(snatchRed);
    game.helpers.resolveUntilIdle();

    Bravo.playAttack(paddleFasterRed);
    Katsu.defendWith(whelmingGustwaveBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Katsu).toHaveLife(17);
  });
});
