import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { lexi } from "../heroes/lexi.ts";
import { infectingShotRed as infectingShot } from "../actions/infecting-shot.ts";
import { brutalAssaultRed } from "../actions/brutal-assault.ts";
import { shiver } from "../weapons/shiver.ts";
import { fishFingers } from "./fish-fingers.ts";
import { boltNBoots } from "./bolt-n-boots.ts";

/**
 * Bolt 'n' Boots (PEN082) — Ranger Legs d1 Battleworn.
 *
 * Printed: Attack Reaction - {r}, destroy this: Target arrow attack with {p}
 * greater than its base gets go again.
 *
 * The power-greater-than-base filter is proven with a Fish Fingers +1{p}
 * latch on Infecting Shot (5 -> 6); the refund funds a second arrow.
 * Arrows can only be played from arsenal, so both shots sit face up there.
 * At base power, or on a buffed non-arrow, activation is rejected.
 */

describe("Bolt 'n' Boots (PEN082) AAA", () => {
  it("happy: a buffed arrow above base power gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        legs: [boltNBoots],
        arms: [fishFingers],
        weapon1: [shiver],
        arsenal: [
          { card: infectingShot, state: { faceDown: false } },
          { card: infectingShot, state: { faceDown: false } },
        ],
        hand: [],
        actionPoints: 1,
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.activate(fishFingers);
    game.helpers.resolveUntilIdle();

    Lexi.playAttack(infectingShot, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(6);
    game.toReaction("attacker");
    Lexi.activate(boltNBoots);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Lexi, boltNBoots).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(34);
    expectFabPlayer(Lexi).toHaveAP(1);

    // The go again refund funds a second, unbuffed arrow.
    Lexi.playAttack(infectingShot, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(29);
    expectFabPlayer(Lexi).toHaveAP(0);
  });

  it("boundary: an arrow at base power is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        legs: [boltNBoots],
        weapon1: [shiver],
        arsenal: [{ card: infectingShot, state: { faceDown: false } }],
        hand: [],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.playAttack(infectingShot, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
    game.toReaction("attacker");
    Lexi.expectActivationRejected(boltNBoots);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(35);
    expectFabCard(Lexi, boltNBoots).toBeIn("legs");
  });

  it("timing: a buffed non-arrow above base power is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        legs: [boltNBoots],
        arms: [fishFingers],
        weapon1: [shiver],
        hand: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 7,
        deck: 6,
      },
      { hero: dash, life: 40, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Lexi = game.as(lexi);
    const Dash = game.as(dash);

    Lexi.activate(fishFingers);
    game.helpers.resolveUntilIdle();

    Lexi.playAttack(brutalAssaultRed);
    expectCombat(game).toHaveAttackPower(7);
    game.toReaction("attacker");
    Lexi.expectActivationRejected(boltNBoots);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(33);
    expectFabCard(Lexi, boltNBoots).toBeIn("legs");
  });
});
