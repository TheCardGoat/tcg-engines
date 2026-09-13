import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { viserai } from "../heroes/viserai.ts";
import { runicReapingRed } from "./runic-reaping.ts";
import { runicReavingRed } from "./runic-reaving.ts";

/**
 * Runic Reaping, Red (DYN185) — Runeblade Action, cost 1, pitch 1.
 * Printed: 'The next Runeblade attack action card you play this turn gains
 * "When this hits, create 3 Runechant tokens".\nIf an attack card was pitched
 * to play Runic Reaping, the next Runeblade attack action card you play this
 * turn gains +1{p}.\nGo again'
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability), CR 1.14.2d/1.14.3 ("this way"
 *     pitch bindings), CR 8.6.3 (Runechant tokens).
 *   behaviorConstraints:
 *     - a2 floats a "next Runeblade attack action card this turn" latch that
 *       grants a hit-triggered create-token rider.
 *     - a3's +1{p} latch is gated on an attack action card having been pitched
 *       to pay for Runic Reaping itself (play-finalize binding).
 *     - Go again refunds the action point at resolution.
 */

describe("runicReaping family AAA", () => {
  it("happy: pitching an attack action gives the next Runeblade attack +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [runicReapingRed, snatchRed, runicReavingRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.must.pitch(snatchRed).play(runicReapingRed);
    game.helpers.resolveUntilIdle();
    Viserai.playAttack(runicReavingRed, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: paying with banked resources does not give the next Runeblade attack +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [runicReapingRed, runicReavingRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(runicReapingRed);
    game.helpers.resolveUntilIdle();
    Viserai.playAttack(runicReavingRed, { optionals: "decline" });

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: blocks for its printed 2{d} from the defending side", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [runicReapingRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(runicReapingRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(18);
  });
});
