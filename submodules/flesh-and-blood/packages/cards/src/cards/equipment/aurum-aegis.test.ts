import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { victorGoldmane } from "../heroes/victor-goldmane.ts";
import { bravo } from "../heroes/bravo.ts";
import { knickKnackBricABracRed } from "../actions/knick-knack-bric-a-brac.ts";
import { aurumAegis } from "./aurum-aegis.ts";

/**
 * Aurum Aegis (FAB180) — Victor Specialization Off-Hand, Temper.
 * Printed: "Victor Specialization / This counts as a Gold. / Temper"
 * "Counts as a Gold" is proven through play: Knick Knack Bric-a-brac's
 * destroy-a-Gold additional cost can destroy the aegis.
 */

describe("Aurum Aegis (FAB180) AAA", () => {
  it("happy: a destroy-a-Gold cost can destroy this as though it were a Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmane,
        weapon2: [aurumAegis],
        hand: [knickKnackBricABracRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmane);

    Victor.play(knickKnackBricABracRed, { modeIds: ["pay"], targetCard: aurumAegis });
    game.helpers.resolveUntilIdle();

    expectFabCard(Victor, aurumAegis).toBeIn("graveyard");
  });

  it("boundary: declining the cost leaves this seated in the off-hand", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmane,
        weapon2: [aurumAegis],
        hand: [knickKnackBricABracRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmane);

    Victor.play(knickKnackBricABracRed, { modeIds: ["decline"] });
    game.helpers.resolveUntilIdle();

    expectFabCard(Victor, aurumAegis).toBeIn("weapon2");
  });

  it("timing: destroyed as a Gold, the off-hand slot frees within the same turn", () => {
    const game = FabTestEngine.start(
      {
        hero: victorGoldmane,
        weapon2: [aurumAegis],
        hand: [knickKnackBricABracRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Victor = game.as(victorGoldmane);

    Victor.play(knickKnackBricABracRed, { modeIds: ["pay"], targetCard: aurumAegis });
    game.helpers.resolveUntilIdle();

    expect(Victor.zone("weapon2")).toHaveLength(0);
    expectFabCard(Victor, knickKnackBricABracRed).toBeIn("graveyard");
  });
});
