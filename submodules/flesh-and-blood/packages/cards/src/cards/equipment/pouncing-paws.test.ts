import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { pouncingPaws } from "./pouncing-paws.ts";

/**
 * Pouncing Paws (TCC082) — Ninja Legs battleworn.
 *
 * Printed:
 *   Instant - Destroy this: Create a Crouching Tiger in your banished zone.
 *   You may play it this turn.
 */

describe("Pouncing Paws (TCC082) AAA", () => {
  it("happy: destroy this and create a Crouching Tiger in banished", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [pouncingPaws], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(pouncingPaws);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Bravo, pouncingPaws).toBeIn("graveyard");
    expect(Bravo.zone("banished")).toContain("token:crouching-tiger");
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: cannot activate when it is not equipped", () => {
    const game = FabTestEngine.start(
      { hero: bravo, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );

    expect(() => game.as(bravo).activate(pouncingPaws)).toThrow();
  });

  it("timing: you may play the created Crouching Tiger from banished this turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [pouncingPaws], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(pouncingPaws);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });
    Bravo.attackWith("token:crouching-tiger", { from: "banished" });

    expectCombat(game).toBeOpen();
    expect(Bravo.zone("banished")).not.toContain("token:crouching-tiger");
    expectFabCard(Bravo, pouncingPaws).toBeIn("graveyard");
  });
});
