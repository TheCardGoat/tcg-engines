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
import { slapHappyRed } from "./slap-happy.ts";

/**
 * Slap Happy (HVY180) — Instant.
 *
 * Printed: The next time you would be dealt damage this turn, prevent 2 of that damage. If you do, create an Vigor token.
 */

describe("Slap Happy (HVY180) AAA", () => {
  it("happy: the shield prevents 2 of the incoming 4-power swing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: oldhim,
        hand: [slapHappyRed],
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
    Seat.play(slapHappyRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Seat).toHaveTokenCount("vigor", 1);

    expectFabPlayer(Seat).toHaveLife(18); // 20 - (4 - 2)
    expectFabCard(Seat, slapHappyRed).toBeIn("graveyard");
  });
});
