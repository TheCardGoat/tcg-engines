import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";

import { plungeYellow } from "../actions/plunge.ts";
import { nimblismBlue } from "../actions/nimblism.ts";

import { schismOfChaosBlue } from "./schism-of-chaos.ts";

/**
 * Schism of Chaos (HNT000) — Chaos Resource - Gem, Legendary.
 *
 * Printed: "When this is pitched, each hero shuffles, then puts the top card
 * of their deck face-down into their arsenal."
 */

describe("Schism of Chaos (HNT000) AAA", () => {
  it("happy: pitching Schism puts the top card of each deck face-down into each arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [schismOfChaosBlue, plungeYellow],
        deckTop: [nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        deckTop: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);
    const Dash = game.as(dash);

    Arakni.must
      .pitch(schismOfChaosBlue) // costs 1{r}: Schism of Chaos is the only pitch
      .play(plungeYellow);
    game.passBoth();

    // Each hero's former top card sits in their arsenal (set face-down).
    expect(Arakni.zone("arsenal")).toHaveLength(1);
    expect(Dash.zone("arsenal")).toHaveLength(1);
    expect(Dash.zone("arsenal")).not.toContain(nimblismBlue.canonicalId); // hidden face-down
  });
});
