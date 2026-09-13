import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { predatoryStreakRed } from "./predatory-streak.ts";

/**
 * Predatory Streak (DYN062) — Ninja Action, cost 0, go again.
 *
 * Printed: "Create 3 Crouching Tigers in your banished zone. You may play
 * them this turn. Go again"
 *
 */

describe("Predatory Streak (DYN062) AAA", () => {
  it("happy: creates 3 Crouching Tigers in banished", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [predatoryStreakRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(predatoryStreakRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Bravo.zone("banished").filter((card) => card === "token:crouching-tiger")).toHaveLength(
      3,
    );
  });

  it("boundary: cannot play without an action point", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [predatoryStreakRed], actionPoints: 0, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.play(predatoryStreakRed)).toThrow();
    expectFabCard(Bravo, predatoryStreakRed).toBeIn("hand");
  });

  it("timing: go again restores the action point after resolution", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [predatoryStreakRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(predatoryStreakRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Bravo).toHaveAP(1);
    expect(Bravo.zone("banished").filter((card) => card === "token:crouching-tiger")).toHaveLength(
      3,
    );
  });
});
