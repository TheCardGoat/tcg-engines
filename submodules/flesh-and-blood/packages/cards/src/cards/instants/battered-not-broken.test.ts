import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { oldhim } from "../heroes/oldhim.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { batteredNotBrokenRed } from "./battered-not-broken.ts";

/**
 * Battered Not Broken (HVY140) — Instant.
 *
 * Printed: The next time you would be dealt damage this turn, prevent 2 of that damage. If you do, create an Might token.
 */

describe("Battered Not Broken (HVY140) AAA", () => {
  it("happy: the shield prevents 2 of the incoming 4-power swing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: oldhim,
        hand: [batteredNotBrokenRed],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Seat = game.as(oldhim);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Seat.play(batteredNotBrokenRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Seat).toHaveTokenCount("might", 1);

    expectFabPlayer(Seat).toHaveLife(18); // 20 - (4 - 2)
    expectFabCard(Seat, batteredNotBrokenRed).toBeIn("graveyard");
  });
});
