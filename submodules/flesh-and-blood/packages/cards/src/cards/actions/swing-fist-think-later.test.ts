import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "../heroes/rhinar.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { swingFistThinkLaterRed } from "./swing-fist-think-later.ts";

/**
 * Swing Fist, Think Later, Red (CRU019) — Brute Attack Action.
 *
 * Printed: "As an additional cost to play Swing Fist, Think Later, discard a
 * random card.\nGo again" (cost 1, 4{p}, 3{d})
 *
 * fab-rules Mode B handoff:
 *   citations: CR 1.7.4e (a play-static additional cost is functional while
 *     public and when played), CR 1.9.3 (a random choice is made from all
 *     legal options — with exactly one other card in hand the discard is
 *     forced, cf. the Reckless Swing random-discard example), CR 1.4.2
 *     (Go again — refund 1 action point at chain-link closure).
 *   behaviorConstraints:
 *     - The random discard is a REQUIRED additional cost: with another card
 *       in hand, playing Swing Fist discards one other card at random; with
 *       no other card in hand the play is illegal (cost cannot be paid).
 *     - The attack itself is printed 4{p}; Go again refunds the action point
 *       spent to play it when the chain link closes.
 *   testImplications:
 *     - Two-card hand: the lone other card is discarded (forced random),
 *       the attack reads 4{p}, and the hit deals 4.
 *     - Solo hand: play is rejected (required additional cost unpayable).
 *     - Timing: AP returns to its pre-play value once combat resolves.
 */

describe("Swing Fist, Think Later (CRU019) AAA", () => {
  it("happy: with one other card in hand the forced random discard removes it and the attack lands at 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [swingFistThinkLaterRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    // Exactly one discard candidate: the "random" pick is forced (CR 1.9.3).
    Rhinar.attackWith(swingFistThinkLaterRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Rhinar, nimblismBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Rhinar, swingFistThinkLaterRed).toBeIn("graveyard");
  });

  it("boundary: with no other card in hand the required random-discard cost cannot be paid — the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [swingFistThinkLaterRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    expect(() => Rhinar.must.playAttack(swingFistThinkLaterRed)).toThrow();
    expectFabCard(Rhinar, swingFistThinkLaterRed).toBeIn("hand");
  });

  it("timing: Go again refunds the action point once the chain link resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [swingFistThinkLaterRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    expectFabPlayer(Rhinar).toHaveAP(1);
    Rhinar.attackWith(swingFistThinkLaterRed);
    game.helpers.resolveRestOfCombat();

    // The play spent the action point; Go again refunds it at link closure.
    expectFabPlayer(Rhinar).toHaveAP(1);
  });
});
