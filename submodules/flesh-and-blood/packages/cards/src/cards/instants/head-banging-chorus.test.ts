import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { chokeslamBlue } from "../actions/chokeslam.ts";
import { snagBlue } from "../instants/snag.ts";
import { headBangingChorusYellow } from "./head-banging-chorus.ts";

/**
 * Head Banging Chorus (IAR256) — Revered Guardian Instant - Aura, Suspense.
 * Printed: "The first Guardian or Revered attack action card you play each
 * turn gets 'When this hits a hero, if you have no cards in hand, draw a
 * card.'"
 */
describe("Head Banging Chorus (IAR256) AAA", () => {
  it("happy: the Guardian attack hits with an empty hand and draws a card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headBangingChorusYellow, chokeslamBlue],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(headBangingChorusYellow);
    game.helpers.untilIdle();
    Bravo.playAttack(chokeslamBlue);
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toBeClosed();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
    // The granted on-hit trigger refilled the empty hand.
    expectFabPlayer(Bravo).toHaveHandCount(1);
  });

  it("boundary: with a card still in hand the granted on-hit draw does not fire", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [headBangingChorusYellow, chokeslamBlue, snagBlue],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(headBangingChorusYellow);
    game.helpers.untilIdle();
    Bravo.playAttack(chokeslamBlue);
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(14);
    // Snag is still in hand: no draw fired.
    expectFabPlayer(Bravo).toHaveHandCount(1);
  });
});
