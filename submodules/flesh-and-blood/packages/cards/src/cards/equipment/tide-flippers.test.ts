import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { nimbleStrikeBlue } from "../actions/nimble-strike.ts";
import { tideFlippers } from "./tide-flippers.ts";

/**
 * Tide Flippers (UPR159) — Ninja Legs d0 Arcane Barrier 1.
 *
 * Printed: Attack Reaction - Destroy Tide Flippers: Target attack action card
 * with 2 or less base {p} gains go again.
 *
 * KSU007 equipment Attack Reaction idiom: activate from the attacker's
 * reaction window and prove the go again refund by playing a follow-up
 * attack. The base-power filter rejects a printed 6{p} attacker.
 */

describe("Tide Flippers (UPR159) AAA", () => {
  it("happy: destroy the legs so a 2 base-power attack gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [tideFlippers],
        hand: [nimbleStrikeBlue, nimbleStrikeBlue],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(nimbleStrikeBlue);
    expectCombat(game).toHaveAttackPower(2);
    game.toReaction("attacker");
    Bravo.activate(tideFlippers);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, tideFlippers).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(38);
    expectFabPlayer(Bravo).toHaveAP(1);

    // The go again refund funds the follow-up attack.
    Bravo.playAttack(nimbleStrikeBlue);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("boundary: without the legs the same attack consumes the only AP", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimbleStrikeBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(nimbleStrikeBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(38);
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("timing: a 6 base-power attack is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [tideFlippers],
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 6,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(6);
    game.toReaction("attacker");
    Bravo.expectActivationRejected(tideFlippers);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(34);
    expectFabCard(Bravo, tideFlippers).toBeIn("legs");
  });
});
