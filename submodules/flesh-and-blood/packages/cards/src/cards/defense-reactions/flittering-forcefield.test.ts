import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { kano } from "../heroes/kano.ts";
import { flashBoltRed } from "../instants/flash-bolt.ts";
import { snatchRed } from "../actions/snatch.ts";
import { flitteringForcefieldRed } from "./flittering-forcefield.ts";

/**
 * Flittering Forcefield Red (OMN181) — Lightning Defense Reaction.
 *
 * Printed: While this is defending, if you've played an instant card this
 * chain link, this gets +1{d}.
 */

describe("Flittering Forcefield family AAA", () => {
  it("happy: an instant earlier in this chain link adds +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: kano,
        hand: [flitteringForcefieldRed, flashBoltRed],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Kano = game.as(kano);

    // Announce the attack; while it is on the stack Kano fires the instant
    // (same chain link), then defends with the reaction-step DR.
    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    // In the defender's reaction window: the instant first (same chain
    // link), then the forcefield defending after it.
    Kano.play(flashBoltRed, { target: Bravo.id });
    Kano.play(flitteringForcefieldRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kano).toHaveLife(20); // 4 - (3 + 1) full block
  });

  it("boundary: with no instant this link it blocks for its printed 3", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: kano,
        hand: [flitteringForcefieldRed],
        resourcePoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Kano = game.as(kano);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Bravo.pass();
    Kano.play(flitteringForcefieldRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kano).toHaveLife(19); // 20 - (4 - 3)
  });
});
