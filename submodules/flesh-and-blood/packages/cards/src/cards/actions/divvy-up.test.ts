import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { scurvStowaway } from "../heroes/scurv-stowaway.ts";
import { treasureIsland } from "../macros/treasure-island.ts";
import { chartACourseYellow } from "./chart-a-course.ts";
import { divvyUpBlue } from "./divvy-up.ts";

/**
 * Divvy Up (SEA144) — Pirate Action.
 *
 * Printed:
 *   Remove half the gold counters from Treasure Island, rounded up. If you
 *   are a Thief, instead remove all of them.
 *   Create Gold tokens equal to the number of gold counters removed this way.
 *
 * Macro fixture `state.goldCounters` is dropped (macros seat as ids only), so
 * Chart a Course places the counters via a public play.
 */

function putGoldCounters(
  game: FabTestEngine,
  hero: ReturnType<FabTestEngine["as"]>,
  copies: number,
) {
  for (let i = 0; i < copies; i += 1) {
    hero.play(chartACourseYellow);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });
  }
}

describe("Divvy Up (SEA144) AAA", () => {
  it("happy: a non-Thief removes half the gold counters, rounded up, as Gold tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        macros: [treasureIsland],
        hand: [chartACourseYellow, chartACourseYellow, chartACourseYellow, divvyUpBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    putGoldCounters(game, Gravy, 3);
    expectFabCard(Gravy, treasureIsland).toHaveCounters(3, "gold");

    Gravy.play(divvyUpBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Gravy, treasureIsland).toHaveCounters(1, "gold");
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 2);
    expectFabCard(Gravy, divvyUpBlue).toBeIn("graveyard");
  });

  it("boundary: with no gold counters on Treasure Island, no Gold tokens are created", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        macros: [treasureIsland],
        hand: [divvyUpBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(divvyUpBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Gravy, treasureIsland).toHaveCounters(0, "gold");
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 0);
  });

  it("timing: a Thief instead removes all gold counters as Gold tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: scurvStowaway,
        macros: [treasureIsland],
        hand: [chartACourseYellow, chartACourseYellow, chartACourseYellow, divvyUpBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Scurv = game.as(scurvStowaway);

    putGoldCounters(game, Scurv, 3);
    expectFabCard(Scurv, treasureIsland).toHaveCounters(3, "gold");

    Scurv.play(divvyUpBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Scurv, treasureIsland).toHaveCounters(0, "gold");
    expectFabPlayer(Scurv).toHaveTokenCount("gold", 3);
    expectFabPlayer(Scurv).toHaveAP(0);
  });
});
