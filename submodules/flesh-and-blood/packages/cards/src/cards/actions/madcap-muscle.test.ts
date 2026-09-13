import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { aggressivePounceRed } from "./aggressive-pounce.ts";
import { nimblismBlue } from "./nimblism.ts";
import { madcapMuscleRed } from "./madcap-muscle.ts";

/**
 * Madcap Muscle (DYN019) — Brute Action - Attack, cost 3, 6{p}, 3{d}.
 *
 * Printed: "As an additional cost to play Madcap Muscle, discard a random
 * card. If the discarded card has 6 or more {p}, Madcap Muscle has +3{p}."
 *
 * Seat exactly one other hand card so the random cost is forced (CR 1.9.3).
 */

describe("Madcap Muscle (DYN019) AAA", () => {
  it("happy: discarding a 6+{p} card as the additional cost grants +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [madcapMuscleRed, aggressivePounceRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.attackWith(madcapMuscleRed);
    expectCombat(game).toHaveAttackPower(9);
    expectFabCard(Rhinar, aggressivePounceRed).toBeIn("graveyard");
  });

  it("boundary: discarding a card with less than 6{p} grants no bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [madcapMuscleRed, nimblismBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(rhinar).attackWith(madcapMuscleRed);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: cannot be played with no card to discard", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [madcapMuscleRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(rhinar).attackWith(madcapMuscleRed)).toThrow();
  });
});
