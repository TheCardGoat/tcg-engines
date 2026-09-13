import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { packHuntBlue } from "./pack-hunt.ts";
import { rollingThunderRed } from "./rolling-thunder.ts";

/**
 * Rolling Thunder (EVR004) — Brute Action, cost 1, go again.
 *
 * Printed: "Roll a 6 sided die. Your next Brute attack this turn gains +X{p},
 * where X the number rolled. Go again"
 */

describe("Rolling Thunder (EVR004) AAA", () => {
  it("happy: the next Brute attack this turn gains +X{p} equal to the d6", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [rollingThunderRed, packHuntBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(rollingThunderRed);
    game.helpers.resolveUntilIdle();
    Rhinar.attackWith(packHuntBlue);
    // Pack Hunt printed 4{p} + roll 1–6.
    const power = game.combat()?.activeLink?.attackPower ?? 0;
    expect(power).toBeGreaterThanOrEqual(5);
    expect(power).toBeLessThanOrEqual(10);
  });

  it("boundary: a non-Brute attack gets no +X{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [rollingThunderRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(rollingThunderRed);
    game.helpers.resolveUntilIdle();
    Rhinar.attackWith(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the action point spent to play Rolling Thunder", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [rollingThunderRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    expectFabPlayer(Rhinar).toHaveAP(1);
    Rhinar.play(rollingThunderRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Rhinar).toHaveAP(1);
  });
});
