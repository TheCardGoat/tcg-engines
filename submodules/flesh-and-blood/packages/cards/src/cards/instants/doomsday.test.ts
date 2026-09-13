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
import { levia } from "../heroes/levia.ts";
import { doomsdayBlue } from "./doomsday.ts";

/**
 * Doomsday (MON189) — Shadow Instant, Levia specialization.
 * Printed: Play only if 6+ blood-debt cards are in your banished zone.
 * Create a Blasmophet, the Soul Harvester token.
 */

const sixBloodDebt = [
  seedsOfAgonyYellow,
  seedsOfAgonyYellow,
  seedsOfAgonyYellow,
  seedsOfAgonyYellow,
  seedsOfAgonyYellow,
  seedsOfAgonyYellow,
];

describe("Doomsday (MON189) AAA", () => {
  it("happy: with 6 blood-debt cards banished, creates Blasmophet", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [doomsdayBlue],
        banished: sixBloodDebt,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    Levia.play(doomsdayBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Levia).toHaveTokenCount("blasmophet-the-soul-harvester", 1);
    expectFabCard(Levia, doomsdayBlue).toBeIn("graveyard");
    expectFabPlayer(Levia).toHaveAP(1);
  });

  it("boundary: with fewer than 6 blood-debt cards banished, the cast is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [doomsdayBlue],
        banished: [seedsOfAgonyYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    expectFabUnplayable(() => Levia.play(doomsdayBlue), /play condition is not satisfied/);
    expectFabCard(Levia, doomsdayBlue).toBeIn("hand");
    expectFabPlayer(Levia).toHaveTokenCount("blasmophet-the-soul-harvester", 0);
  });

  it("boundary: specialization is deckbuilding-only — Dash can still play it when the printed condition is met", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [doomsdayBlue],
        banished: sixBloodDebt,
        actionPoints: 1,
        deck: 6,
      },
      { hero: levia, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(doomsdayBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveTokenCount("blasmophet-the-soul-harvester", 1);
  });
});
