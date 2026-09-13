import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { verdance } from "../heroes/verdance.ts";
import { dash } from "../heroes/dash.ts";
import { earthloreSurgeRed } from "../actions/earthlore-surge.ts";
import { snatchRed } from "../actions/snatch.ts";
import { plumeOfEvergrowth } from "./plume-of-evergrowth.ts";

/**
 * Plume of Evergrowth (BRI005) — Earth Head d0.
 * Printed: "Instant - {r}{r}{r}, destroy Plume of Evergrowth: Return target
 * Earth action card or Earth instant card from your graveyard to your hand."
 */

describe("Plume of Evergrowth (BRI005) AAA", () => {
  it("happy: pays {r}{r}{r}, destroys this, and returns an Earth action from the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        head: [plumeOfEvergrowth],
        graveyard: [earthloreSurgeRed],
        hand: [],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdance);

    Verdance.activate(plumeOfEvergrowth);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: earthloreSurgeRed.canonicalId });

    expectFabCard(Verdance, plumeOfEvergrowth).toBeIn("graveyard");
    expectFabPlayer(Verdance).toHaveResourceCount(0);
    expectFabPlayer(Verdance).toHaveHandCount(1);
    expect(Verdance.zone("hand")).toContain(earthloreSurgeRed.canonicalId);
    expect(Verdance.zone("graveyard")).not.toContain(earthloreSurgeRed.canonicalId);
  });

  it("boundary: a graveyard without an Earth action or Earth instant cannot pay the effect", () => {
    const game = FabTestEngine.start(
      {
        hero: verdance,
        head: [plumeOfEvergrowth],
        graveyard: [snatchRed],
        hand: [],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Verdance = game.as(verdance);

    Verdance.expectActivationRejected(plumeOfEvergrowth);
    expectFabCard(Verdance, plumeOfEvergrowth).toBeIn("head");
    expect(Verdance.zone("graveyard")).toContain(snatchRed.canonicalId);
  });
});
