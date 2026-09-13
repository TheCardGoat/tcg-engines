import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "./snatch.ts";
import { weeWreckingBallYellow } from "./wee-wrecking-ball.ts";

/**
 * Wee Wrecking Ball Yellow (SUP194) — Guardian Attack Action.
 *
 * Printed: If this has {p} greater than its base, it gets +1{p}.
 * Crush - When this deals 4 or more damage to a hero, they discard a card.
 */

describe("Short Shrift (SUP194) AAA", () => {
  it("happy: a 3-damage hit lands printed and arms nothing (Crush below threshold)", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [weeWreckingBallYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Bravo = game.as(bravo);

    Rhinar.playAttack(weeWreckingBallYellow);
    Bravo.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Bravo).toHaveLife(17); // 20 - 3
    expectFabCard(Bravo, snatchRed).toBeIn("hand"); // below threshold: no discard
  });
});
