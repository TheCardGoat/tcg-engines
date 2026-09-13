import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer, searingShotRed } from "../shared/test-recipients.ts";
import { snatchRed } from "../actions/snatch.ts";
import { quiverOfRustlingLeaves } from "./quiver-of-rustling-leaves.ts";

/**
 * Quiver of Rustling Leaves (OUT096) — Ranger Equipment Quiver.
 *
 * Printed: Instant - {r}{r}{r}: Reveal the top card of your deck. If it's an
 * arrow, put it face up into your arsenal and destroy this.
 */

describe("Quiver of Rustling Leaves (OUT096) AAA", () => {
  it("happy: revealing an arrow loads it face-up into arsenal and destroys this", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        weapon2: [quiverOfRustlingLeaves],
        resourcePoints: 3,
        actionPoints: 1,
        deckTop: [searingShotRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(quiverOfRustlingLeaves);
    game.helpers.resolveUntilIdle();

    expectFabCard(Azalea, quiverOfRustlingLeaves).toBeIn("graveyard");
    expectFabCard(Azalea, searingShotRed).toBeIn("arsenal");
  });

  it("boundary: without {r}{r}{r} the Instant is unpayable", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        weapon2: [quiverOfRustlingLeaves],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [searingShotRed],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(azalea).expectActivationRejected(quiverOfRustlingLeaves);
  });

  it("timing: a non-arrow reveal leaves the quiver equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        weapon2: [quiverOfRustlingLeaves],
        resourcePoints: 3,
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);

    Azalea.activate(quiverOfRustlingLeaves);
    game.helpers.resolveUntilIdle();

    expectFabCard(Azalea, quiverOfRustlingLeaves).toBeIn("weapon2");
  });
});
