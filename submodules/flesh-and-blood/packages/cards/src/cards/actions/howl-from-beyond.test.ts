import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { scaldingRainRed } from "./scalding-rain.ts";
import { howlFromBeyondRed } from "./howl-from-beyond.ts";

/**
 * Howl from Beyond, Red (CHN022) — Shadow Action.
 *
 * Printed: "You may play Howl from Beyond from your banished zone.
 * The next attack action card you play this turn gains +3{p}.
 * Go again
 * Blood Debt"
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability generates its effect when the
 *     card-layer resolves), CR 6.2 (layer-continuous modify-numeric bound
 *     to the next matching attack), CR 8.3.11/8.3.11a (Blood Debt — lose 1
 *     at the beginning of the owner's end phase while public in the
 *     banished zone), CR 8.3.5 (Go again action-point refund), CR 2.9
 *     (power).
 *   behaviorConstraints:
 *     - The static play permission allows playing the card from the
 *       controller's banished zone (normal action timing and costs apply).
 *     - The +3{p} latches onto the controller's NEXT attack ACTION card
 *       played THIS TURN; other plays in between neither receive nor
 *       consume it, and the first matching attack consumes it.
 *   testImplications:
 *     - After Howl from banished resolves (refunding its action point via
 *       Go again), Snatch reads 4+3 = 7{p}; a non-attack action played in
 *       between does not consume the latch; the second attack action reads
 *       its base 4{p}.
 */

describe("Howl from Beyond (CHN022) AAA", () => {
  it("happy: played from banished, Go again refunds, the next attack action gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [snatchRed],
        banished: [howlFromBeyondRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    // The static permission plays the howl straight from the banished zone.
    Chane.play(howlFromBeyondRed, { from: "banished" });
    game.helpers.resolveUntilIdle();
    // Go again refunds the spent action point when the card-layer resolves.
    expectFabPlayer(Chane).toHaveAP(2);

    Chane.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    // Snatch base 4 + 3 from Howl from Beyond = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a non-attack action played in between neither receives nor consumes the +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [scaldingRainRed, snatchRed],
        banished: [howlFromBeyondRed],
        resourcePoints: 3,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(howlFromBeyondRed, { from: "banished" });
    game.helpers.resolveUntilIdle();

    // Scalding Rain is a non-attack action: it gets nothing and leaves the
    // pending modifier armed.
    Chane.play(scaldingRainRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(16);

    Chane.must.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    // The latch waited for an attack action card: 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("timing: the modifier is consumed by the first matching attack action", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [snatchRed, snatchRed],
        banished: [howlFromBeyondRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const snatches = Chane.cardsIn("hand", snatchRed);

    Chane.play(howlFromBeyondRed, { from: "banished" });
    game.helpers.resolveUntilIdle();

    Chane.must.playAttack(snatches[0]!);
    game.advanceCombatTo("defend");
    // First matching attack action: 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline" });

    Chane.must.playAttack(snatches[1]!);
    game.advanceCombatTo("defend");
    // "Your NEXT ..." was consumed: the second Snatch is its base 4.
    expectCombat(game).toHaveAttackPower(4);
  });
});
