import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { standStrong } from "./stand-strong.ts";
import { tensionInTheAirBlue } from "../instants/tension-in-the-air.ts";
import { auricShardsBlue } from "../instants/auric-shards.ts";

/**
 * Stand Strong (SLY010) — Guardian Equipment - Legs.
 *
 * Printed: "Action - {r}{r}{r}, destroy this: Create a Confidence token.
 * Activate this only if you control an aura of suspense. Go again / Blade Break"
 */
describe("Stand Strong (SLY010) AAA", () => {
  it("happy: destroying Stand Strong under an aura of suspense creates a Confidence token and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [standStrong],
        arena: [tensionInTheAirBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(standStrong);
    game.untilIdle();

    expectFabCard(Bravo, standStrong).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveTokenCount("confidence", 1);
    // Go again refunded the action point spent on the activation.
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
  });

  it("boundary: without any aura of suspense the activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [standStrong],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(standStrong);
    expectFabCard(Bravo, standStrong).toBeIn("legs");
  });

  it("boundary: an aura without the suspense ability does not license the activation", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [standStrong],
        // Auric Shards is an aura, but a Ward aura — no suspense.
        arena: [auricShardsBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(standStrong);
    expectFabCard(Bravo, standStrong).toBeIn("legs");
  });
});
