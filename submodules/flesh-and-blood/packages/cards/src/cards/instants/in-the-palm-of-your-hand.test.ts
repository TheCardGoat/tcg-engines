import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { inThePalmOfYourHandRed } from "./in-the-palm-of-your-hand.ts";

// Printed: "Suspense / When this enters or leaves the arena, draw a card."
// One draw on the enter trigger, one on the suspense-exhaustion leave.
describe("In the Palm of Your Hand (SUP171) AAA", () => {
  it("happy: entering the arena draws a card", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [inThePalmOfYourHandRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(inThePalmOfYourHandRed);
    game.helpers.untilIdle();

    expectFabCard(Bravo, inThePalmOfYourHandRed).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveHandCount(1); // the enter draw
  });

  it("boundary: no second draw while it stays in the arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [inThePalmOfYourHandRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.play(inThePalmOfYourHandRed);
    game.helpers.untilIdle();
    game.helpers.untilIdle();

    expectFabCard(Bravo, inThePalmOfYourHandRed).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveHandCount(1);
  });

  it("timing: leaving the arena (suspense exhausted) draws again", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [inThePalmOfYourHandRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(inThePalmOfYourHandRed);
    game.helpers.untilIdle();
    // Cycle turns until suspense exhausts it (bounded), then assert the
    // leave draw: intellect refill to 4 plus the leave draw takes hand to 5.
    for (
      let i = 0;
      i < 4 && Bravo.zone("arena").includes(inThePalmOfYourHandRed.canonicalId);
      i++
    ) {
      Bravo.endTurn();
      game.helpers.untilIdle();
      Dash.endTurn();
      game.helpers.untilIdle();
    }
    expectFabCard(Bravo, inThePalmOfYourHandRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveHandCount(5);
  });
});
