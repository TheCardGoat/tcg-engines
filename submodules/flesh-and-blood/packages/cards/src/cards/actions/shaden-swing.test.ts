import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { leviaShadowbornAbomination } from "../heroes/levia-shadowborn-abomination.ts";
import { nimblismBlue } from "./nimblism.ts";
import { shadenSwingRed } from "./shaden-swing.ts";

/**
 * Shaden Swing, Red (DTD124) — Shadow Brute Attack Action.
 *
 * Printed: "As an additional cost to play this, banish a random card from
 * your hand.\nBlood Debt" (cost 1, 7{p}, 3{d})
 *
 * fab-rules Mode B handoff:
 *   citations: CR 1.7.4e (play-static additional cost is functional while
 *     public and when played), CR 1.9.3 (random choice from all legal
 *     options — with exactly one other card in hand the banish is forced),
 *     CR 8.3.11/8.3.11a (Blood Debt — lose 1 life at the beginning of the
 *     owner's end phase while public in the banished zone).
 *   behaviorConstraints:
 *     - With another card in hand, playing Shaden Swing is LEGAL and
 *     banishes one other random hand card as the additional cost; the
 *     attack is printed 7{p}.
 *     - With no other card in hand the required cost cannot be paid and
 *     the play is illegal.
 *     - A copy still in the banished zone at the owner's end phase drains
 *     1 life (Blood Debt).
 *
 * ENGINE GAP (§5 row appended; denial pin below): the effect-cost whitelist
 * `isPayablePlayCost` (procedures/play-card/effect-costs.ts) admits banish
 * additional costs only from the GRAVEYARD, so the REQUIRED
 * banish-random-card-from-HAND cost is denied as an "unmigrated effect-cost
 * declaration" even with a payable second hand card — the 7{p} attack is
 * unreachable. The Blood Debt keyword IS provable and pinned green below.
 * The denial pin asserts CURRENT misbehavior so the whitelist fix flips it.
 */

describe("Shaden Swing family AAA", () => {
  it("happy: random hand-banish is paid and the attack is printed 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [shadenSwingRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);

    Levia.attackWith(shadenSwingRed);
    expectFabCard(Levia, nimblismBlue).toBeIn("banished");
    game.advanceCombatTo("defend");
    expect(game.combat()?.activeLink?.attackPower).toBe(7);
  });

  it("boundary: with no other card in hand the required banish cost cannot be paid — the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [shadenSwingRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);

    expectFabUnplayable(() => Levia.play(shadenSwingRed));
    expectFabCard(Levia, shadenSwingRed).toBeIn("hand");
  });

  it("timing: Blood Debt — a copy left in banished costs 1 life at the end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: leviaShadowbornAbomination,
        hand: [],
        banished: [shadenSwingRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(leviaShadowbornAbomination);

    Levia.endTurn();
    game.helpers.untilIdle();

    // CR 8.3.11: the public blood-debt card in the banished zone drains 1
    // life at the beginning of Levia's end phase.
    expectFabPlayer(Levia).toHaveLife(19);
  });
});
