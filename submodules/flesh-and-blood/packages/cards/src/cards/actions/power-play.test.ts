import { describe, expect, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { powerPlayRed } from "./power-play.ts";

/**
 * Power Play (SUP186) — Guardian Action - Attack, cost 3, 3{p}, 3{d}.
 * Printed: "If this was played from arsenal, it gets +5{p}."
 */

describe("Power Play (SUP186) AAA", () => {
  it("happy: played from arsenal this gets +5{p} (8 total)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arsenal: [powerPlayRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(powerPlayRed, { from: "arsenal" });
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: played from hand this stays printed 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [powerPlayRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).playAttack(powerPlayRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: 0{r} cannot pay the printed cost even from arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arsenal: [powerPlayRed],
        resourcePoints: 0,
        actionPoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(bravo).playAttack(powerPlayRed, { from: "arsenal" })).toThrow();
  });
});
