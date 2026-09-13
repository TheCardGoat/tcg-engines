import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { treasureIsland } from "../macros/treasure-island.ts";
import { chartACourseRed } from "./chart-a-course.ts";

/**
 * Chart a Course (SEA173) — Pirate Action.
 *
 * Printed:
 *   Your first attack this turn gets +3{p}.
 *   You may put a gold counter on Treasure Island.
 *   Go again
 */

describe("chart-a-course family AAA", () => {
  it("happy: the first attack this turn gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [chartACourseRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(chartACourseRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Gravy.attackWith(snatchRed);

    // Snatch base 4 + 3 = 7.
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: the second attack this turn does not get +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [chartACourseRed, snatchRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(chartACourseRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Gravy.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();

    Gravy.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the play AP and may put a gold counter on Treasure Island", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        macros: [treasureIsland],
        hand: [chartACourseRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(chartACourseRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: treasureIsland.canonicalId,
    });

    expectFabPlayer(Gravy).toHaveAP(1);
    expectFabCard(Gravy, treasureIsland).toHaveCounters(1, "gold");
  });
});
