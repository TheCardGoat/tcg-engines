import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravoShowstopper } from "../heroes/bravo-showstopper.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { crushConfidenceRed } from "./crush-confidence.ts";

/**
 * Crush Confidence, Red (WTR063) — Guardian Action Attack, 7{p}.
 *
 * Printed: When this deals 4 or more damage to a hero, they lose all hero
 * card abilities until the end of their next turn.
 *
 * The strip is `rule-modification` restrict `lose-abilities` on attack-target
 * (Humble / BVO018). Bravo's hero activation is the observable ability.
 */

describe("Crush Confidence family AAA", () => {
  it("happy: dealing 4 or more damage strips the defending hero's abilities", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [crushConfidenceRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 20, resourcePoints: 2, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Showstopper = game.as(bravoShowstopper);
    const Bravo = game.as(bravo);

    Showstopper.playAttack(crushConfidenceRed);
    Bravo.defendWith();
    game.helpers.resolveRestOfCombat();
    Showstopper.endTurn();
    game.helpers.resolveUntilIdle();

    Bravo.expectActivationRejected(bravo);
  });

  it("boundary: less than 4 damage does not strip hero abilities", () => {
    const game = FabTestEngine.start(
      {
        hero: bravoShowstopper,
        hand: [crushConfidenceRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, life: 20, hand: [snatchRed, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Showstopper = game.as(bravoShowstopper);
    const Bravo = game.as(bravo);

    Showstopper.playAttack(crushConfidenceRed);
    Bravo.defendWith(snatchRed, snatchRed);
    game.helpers.resolveRestOfCombat();

    // 7{p} vs 4{d} = 3 damage (< 4) — crush does not fire.
    expectFabPlayer(Bravo).toHaveLife(17);
  });
});
