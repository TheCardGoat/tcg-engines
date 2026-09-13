import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { fletchARedTailRed } from "./fletch-a-red-tail.ts";

/**
 * Fletch a Red Tail, Red (AZL019) — Ranger Action.
 *
 * Printed: "Your next arrow attack this turn gains +4{p}. If it has an aim
 * counter, it gains 'Red cards have -1{d} while defending this.' Go again"
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution abilities), CR 6.2 (layer-continuous
 *     modify-numeric bound to the next Arrow attack), CR 8.2 (Arrow subtype;
 *     arrows play from arsenal while controlling a Bow), CR 8.3 (go again
 *     refunds the action point when the layer resolves), CR 2.9/CR 2.10
 *     (power/defense).
 *   behaviorConstraints:
 *     - The +4{p} applies only to the controller's next ARROW attack this
 *       turn; a non-arrow attack receives nothing.
 *     - While the boosted arrow attack has an aim counter, Red cards
 *       defending that attack have -1{d}.
 *     - Go again refunds the action point spent to play this.
 *   testImplications:
 *     - Searing Shot (Arrow, base 4) reads 8 after Fletch a Red Tail; Snatch
 *       (non-arrow) stays 4; a Red 2{d} block against the aimed arrow blocks
 *       for 1 while the rider applies; the go-again refund restores the AP.
 */

describe("Fletch a Red Tail (AZL019) AAA", () => {
  it("happy: the next arrow attack this turn gains +4{p} and go again refunds the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [fletchARedTailRed],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { faceDown: true } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(fletchARedTailRed);
    game.helpers.resolveUntilIdle();
    // Go again refunded the action point spent on Fletch a Red Tail.
    expectFabPlayer(Azalea).toHaveAP(1);

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    // Searing Shot base 4 + 4 from Fletch a Red Tail = 8.
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: a non-arrow attack played after Fletch a Red Tail gets no +4", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [fletchARedTailRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.play(fletchARedTailRed);
    game.helpers.resolveUntilIdle();

    Azalea.attackWith(snatchRed);
    // Snatch is not an Arrow: printed 4{p}, no boost.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: an aimed arrow attack makes Red defenders block for -1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [fletchARedTailRed],
        weapon1: [deathDealer],
        arsenal: [{ card: searingShotRed, state: { aimCounters: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.play(fletchARedTailRed);
    game.helpers.resolveUntilIdle();

    Azalea.attackWith(searingShotRed, { from: "arsenal" });
    game.advanceCombatTo("defend");
    // Aimed arrow: base 4 + 4 from the latch = 8.
    expectCombat(game).toHaveAttackPower(8);

    // Snatch is Red: its printed 2{d} is reduced to 1 while defending this.
    Dash.defendWith([snatchRed]);
    game.helpers.resolveRestOfCombat();
    // 8 attack vs 1 block = 7 damage.
    expectFabPlayer(Dash).toHaveLife(13);
  });
});
