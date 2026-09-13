import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { pleiadesSuperstar } from "../heroes/pleiades-superstar.ts";
import { dash } from "../heroes/dash.ts";
import { tiaraOfSuspense } from "./tiara-of-suspense.ts";
import { tensionInTheAirBlue } from "../instants/tension-in-the-air.ts";
import { cheersBlue } from "../actions/cheers.ts";

/**
 * Tiara of Suspense (APS004) — Revered Guardian Equipment - Head, Guardwell.
 *
 * Printed: "Instant - Destroy this: Put a suspense counter on an aura of
 * suspense you control. Activate this only if you've been cheered this turn."
 */
describe("Tiara of Suspense (APS004) AAA", () => {
  it("happy: after the crowd cheers, destroying the tiara adds a suspense counter to an aura of suspense", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        head: [tiaraOfSuspense],
        arena: [tensionInTheAirBlue],
        hand: [cheersBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    // Playing Cheers enters the arena — the crowd cheers Pleiades this turn.
    Pleiades.play(cheersBlue);
    game.helpers.resolveUntilIdle();

    // Instant - destroy this: suspense counter on the aura of suspense.
    Pleiades.activate(tiaraOfSuspense);
    game.helpers.resolveUntilIdle();

    const [aura] = Pleiades.cardsIn("arena", tensionInTheAirBlue);
    // Tension in the Air enters with 2 suspense counters; the tiara adds one.
    expectFabCard(Pleiades, aura!).toHaveCounters(3, "suspense");
    expectFabCard(Pleiades, tiaraOfSuspense).toBeIn("graveyard");
  });

  it("boundary: without being cheered this turn the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        head: [tiaraOfSuspense],
        arena: [tensionInTheAirBlue],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    Pleiades.expectActivationRejected(tiaraOfSuspense);
    expectFabCard(Pleiades, tiaraOfSuspense).toBeIn("head");
  });
});
