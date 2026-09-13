import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { prism } from "../heroes/prism.ts";
import { dash } from "../heroes/dash.ts";
import { wartuneHeraldRed } from "../actions/wartune-herald.ts";
import { snatchRed } from "../actions/snatch.ts";
import { haloOfIllumination } from "./halo-of-illumination.ts";

/**
 * Halo of Illumination — Light Equipment - Head, d0 Spellvoid 2.
 *
 * Printed: "Instant - {r}, destroy this: Put a card from your hand into your
 * hero's soul. If it's Light, draw a card."
 */

describe("Halo of Illumination (BOL005) AAA", () => {
  it("happy: charge a Light card into the soul and draw a card", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        head: [haloOfIllumination],
        hand: [wartuneHeraldRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.activate(haloOfIllumination);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, haloOfIllumination).toBeIn("graveyard");
    expectFabCard(Prism, wartuneHeraldRed).toBeIn("soul");
    // Hand emptied by the soul move, then refilled by the Light draw.
    expect(Prism.zone("hand")).toHaveLength(1);
  });

  it("boundary: charging a non-Light card charges the soul but draws nothing", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        head: [haloOfIllumination],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.activate(haloOfIllumination);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, snatchRed).toBeIn("soul");
    expect(Prism.zone("hand")).toHaveLength(0);
  });
});
