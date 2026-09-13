import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { lexi } from "../heroes/lexi.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../weapons/death-dealer.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { weaveLightningRed } from "./weave-lightning.ts";
import { buzzBoltRed } from "./buzz-bolt.ts";

/**
 * Buzz Bolt (ELE047) — printed:
 * "Lightning Fusion
 * If Buzz Bolt was fused, whenever an attack hits a hero this turn, it deals
 * 1 damage to them."
 *
 * Mode B (fab-rules): CR 8.3.17 fusion is an optional additional cost —
 * reveal a Lightning card from hand; the rider schedules at play resolution
 * only when fused (CR 8.3.17c "was fused"); the window is every attack
 * hitting a hero THIS TURN (multi-fire, turn-scoped) and the ping is dealt
 * by the attacking object to the hit hero. Arrows fire only from arsenal
 * with a bow (CR 8.2.6a).
 *
 * Turn scoping (W3-FIX4 2026-08-18, plan §5 defect row): the module now
 * authors the engine-supported multi-fire shape `policy: { kind: "windowed",
 * duration: "this-turn", matching: "every" }` (golden: AIO004 heavy-industry
 * power plant), so the rider re-fires on EVERY hitting attack this turn and
 * expires at turn end. The timing test asserts both boundaries directly.
 */

describe("Buzz Bolt (ELE047) AAA", () => {
  it("happy: fused from arsenal — the hit deals 5 plus the delayed 1 (life 14)", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [buzzBoltRed],
        hand: [weaveLightningRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    // Lightning Fusion paid by revealing a Lightning card (stays in hand).
    Lexi.attackWith(buzzBoltRed, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveLightningRed],
    });
    game.closeCombat();

    // 5{p} attack damage + 1 delayed hit damage (CR 9.x triggered order).
    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Lexi, weaveLightningRed).toBeIn("hand");
  });

  it("boundary: unfused, the bolt hits for its printed 5 only", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [buzzBoltRed],
        hand: [weaveLightningRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    // Declining the optional fusion cost leaves the rider unregistered.
    Lexi.attackWith(buzzBoltRed, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("timing: the extra 1 lands at the hit, not at play time — then re-fires on a second hit and expires at turn end", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [deathDealer],
        arsenal: [buzzBoltRed],
        hand: [
          weaveLightningRed,
          heartOfFyendalBlue,
          heartOfFyendalBlue,
          brutalAssaultBlue,
          brutalAssaultBlue,
        ],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 4,
      },
      { hero: dash, hand: [], life: 20, deck: 4 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    // The delay itself: at the reaction step no damage has been dealt.
    Lexi.attackWith(buzzBoltRed, {
      from: "arsenal",
      fuse: true,
      fuseCards: [weaveLightningRed],
    });
    game.advanceCombatTo("reaction");
    expectFabPlayer(Dash).toHaveLife(20);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(14);

    // Printed "whenever ... this turn" re-fires on the second hitting
    // attack: 4{p} + 1 = 5 more damage (life 9).
    Lexi.attackWith(brutalAssaultBlue, { pitch: [heartOfFyendalBlue] });
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(9);

    // Turn boundary: the "this turn" window has expired — a next-turn hit
    // deals the plain printed 4 with no ping (life 5).
    Lexi.endTurn();
    Dash.endTurn();
    game.helpers.untilIdle();
    Lexi.attackWith(brutalAssaultBlue, { pitch: [heartOfFyendalBlue] });
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(5);
  });
});
