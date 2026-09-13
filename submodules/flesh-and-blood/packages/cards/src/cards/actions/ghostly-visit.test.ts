import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { ghostlyVisitRed } from "./ghostly-visit.ts";

/**
 * Ghostly Visit, Red (CHN021) — Shadow Attack Action.
 *
 * Printed: "You may play Ghostly Visit from your banished zone.\nBlood Debt"
 * (cost 1, 4{p}, 3{d})
 *
 * fab-rules Mode B handoff:
 *   citations: CR 1.7.4e (Ghostly Visit is the CR's own play-static
 *     example — the play permission is functional while public and when
 *     played), CR 5.4.4 (a static permission adds banished as a legal play
 *     zone; normal timing and costs still apply), CR 8.3.11/8.3.11a (Blood
 *     Debt — while this is public in your banished zone at the beginning of
 *     your end phase, lose 1 life).
 *   behaviorConstraints:
 *     - The permission only EXTENDS playability: from banished the card is
 *       playable at its normal cost; from hand it stays ordinarily playable.
 *     - A copy still in the banished zone at the owner's end phase drains
 *       1 life (Blood Debt); the played copy leaves banished and lands in
 *       the graveyard like any attack.
 *   testImplications:
 *     - Banished copy: attackWith from "banished" reads 4{p}, hits for 4,
 *       and the card ends in the graveyard.
 *     - Hand copy: ordinary hand play still legal at 4{p}.
 *     - Unplayed banished copy: endTurn costs Chane 1 life.
 */

describe("Ghostly Visit (CHN021) AAA", () => {
  it("happy: the permission plays the card straight from the banished zone at printed 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [ghostlyVisitRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.attackWith(ghostlyVisitRed, { from: "banished" });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Chane, ghostlyVisitRed).toBeIn("graveyard");
  });

  it("boundary: the permission only extends playability — the hand copy is still an ordinary legal play", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [ghostlyVisitRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.attackWith(ghostlyVisitRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Chane, ghostlyVisitRed).toBeIn("graveyard");
  });

  it("timing: Blood Debt — a copy left in banished costs 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [], banished: [ghostlyVisitRed], life: 20, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.endTurn();
    game.helpers.untilIdle();

    // CR 8.3.11: the public blood-debt card in the banished zone drains 1
    // life at the beginning of Chane's end phase.
    expectFabPlayer(Chane).toHaveLife(19);
  });
});
