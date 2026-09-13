import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer, searingShotRed, headShotYellow } from "../shared/test-recipients.ts";
import { quiverOfAbyssalDepths } from "./quiver-of-abyssal-depths.ts";

/**
 * Quiver of Abyssal Depths (OUT095) — Ranger Equipment Quiver.
 *
 * Printed: Instant - {r}{r}{r}, destroy this: Shuffle up to 3 arrows with
 * different names from your graveyard into your deck.
 */

describe("Quiver of Abyssal Depths (OUT095) AAA", () => {
  it("happy: destroy this and shuffle two differently named arrows into the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        // Quiver seats with other equipment; arsenal/quiver zone is quiver.
        weapon1: [deathDealer],
        weapon2: [quiverOfAbyssalDepths],
        graveyard: [searingShotRed, headShotYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(quiverOfAbyssalDepths);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });

    expectFabCard(Azalea, quiverOfAbyssalDepths).toBeIn("graveyard");
    expect(Azalea.zone("graveyard")).not.toContain(searingShotRed.canonicalId);
  });

  it("boundary: without {r}{r}{r} the Instant is unpayable", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        weapon2: [quiverOfAbyssalDepths],
        hand: [],
        graveyard: [searingShotRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(azalea).expectActivationRejected(quiverOfAbyssalDepths);
  });

  it("timing: with an empty graveyard this is still destroyed and shuffled", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        weapon2: [quiverOfAbyssalDepths],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    Azalea.activate(quiverOfAbyssalDepths);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });
    expectFabCard(Azalea, quiverOfAbyssalDepths).toBeIn("graveyard");
  });
});
