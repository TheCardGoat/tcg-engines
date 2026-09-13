import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { seedsOfAgonyYellow } from "../actions/seeds-of-agony.ts";
import { chane } from "../heroes/chane.ts";
import { eclipseBlue } from "./eclipse.ts";

/**
 * Eclipse (MON190) — Shadow Instant, Chane specialization.
 * Printed: Play only if you have played 6 or more cards with blood debt this
 * turn. If you have, you may play Eclipse from your banished zone.
 * Create an Ursur, the Soul Reaper token.
 */

const sixSeeds = [
  seedsOfAgonyYellow,
  seedsOfAgonyYellow,
  seedsOfAgonyYellow,
  seedsOfAgonyYellow,
  seedsOfAgonyYellow,
  seedsOfAgonyYellow,
];

describe("Eclipse (MON190) AAA", () => {
  it("happy: after 6 blood-debt plays this turn, creates Ursur", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [...sixSeeds, eclipseBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    for (const seed of sixSeeds) {
      Chane.play(seed);
      game.helpers.resolveUntilIdle();
    }
    Chane.play(eclipseBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Chane).toHaveTokenCount("ursur-the-soul-reaper", 1);
    expectFabCard(Chane, eclipseBlue).toBeIn("graveyard");
  });

  it("boundary: without 6 blood-debt cards played this turn, the cast is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [eclipseBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    expectFabUnplayable(() => Chane.play(eclipseBlue), /play condition is not satisfied/);
    expectFabCard(Chane, eclipseBlue).toBeIn("hand");
    expectFabPlayer(Chane).toHaveTokenCount("ursur-the-soul-reaper", 0);
  });

  it("boundary: specialization is deckbuilding-only — Dash can still play it when the printed condition is met", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [eclipseBlue, ...sixSeeds],
        actionPoints: 1,
        deck: 6,
      },
      { hero: chane, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    for (const seed of sixSeeds) {
      Dash.play(seed);
      game.helpers.resolveUntilIdle();
    }
    Dash.play(eclipseBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveTokenCount("ursur-the-soul-reaper", 1);
  });
});
