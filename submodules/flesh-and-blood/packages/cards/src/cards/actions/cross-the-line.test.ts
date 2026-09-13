import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { crossTheLineRed } from "./cross-the-line.ts";

/**
 * Cross the Line, Red (BOL013) — Light Warrior Attack Action.
 *
 * Printed: "As an additional cost to play Cross the Line, you may charge
 * your hero's soul." (cost 1, 5{p}, 3{d})
 *
 * fab-rules Mode B handoff:
 *   citations: CR 1.7.4e (a play-static additional cost is functional while
 *     public and when played), CR 8.5.29 (Charge — put a card from your hand
 *     into your hero's soul), CR 8.3.4 ("you may" — an optional additional
 *     cost; declining keeps the play legal).
 *   behaviorConstraints:
 *     - Paying the optional cost moves the chosen hand card into the soul as
 *       part of playing Cross the Line; declining leaves the soul untouched.
 *     - Either way the attack itself is unchanged: printed 5{p}.
 *     - With no other card in hand the charge cannot be paid, and because it
 *       is optional the play resolves uncharged (optional ≠ mandatory).
 *   testImplications:
 *     - Charge accepted: fodder lands in the soul, hit deals 5.
 *     - Charge declined: play legal, fodder stays in hand, hit deals 5.
 *     - Solo hand: optional cost unpayable auto-declines; hit still deals 5.
 */

describe("Cross the Line (BOL013) AAA", () => {
  it("happy: charging the soul moves the chosen hand card into the soul and the attack lands at 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.attackWith(crossTheLineRed, { charge: true, chargeCard: nimblismBlue });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Boltyn, crossTheLineRed).toBeIn("graveyard");
  });

  it("boundary: declining the optional charge is legal — fodder stays in hand, hit still deals 5", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // No charge option passed: the "you may" cost is declined.
    Boltyn.attackWith(crossTheLineRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Boltyn, nimblismBlue).toBeIn("hand");
    expect(Boltyn.zone("soul")).toHaveLength(0);
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("boundary: with no other card in hand the optional charge cannot be paid — the play resolves uncharged", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // The charge has no legal target; optional costs auto-decline rather
    // than blocking the play (CR 8.3.4 — "you may").
    Boltyn.attackWith(crossTheLineRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();

    expect(Boltyn.zone("soul")).toHaveLength(0);
    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Boltyn, crossTheLineRed).toBeIn("graveyard");
  });
});
