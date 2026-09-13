import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { barnacleYellow } from "./barnacle.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { scrubTheDeckBlue } from "./scrub-the-deck.ts";

/**
 * Scrub the Deck (SEA147) — Pirate Action.
 *
 * Printed:
 *   Destroy the top card of target hero's deck. If it's yellow, create a Gold token.
 *   Go again
 */

describe("Scrub the Deck (SEA147) AAA", () => {
  it("happy: destroying a yellow top card creates a Gold token", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [scrubTheDeckBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [barnacleYellow],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(scrubTheDeckBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Gravy, barnacleYellow).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 1);
  });

  it("boundary: destroying a non-yellow top card creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [scrubTheDeckBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(scrubTheDeckBlue);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Gravy, snatchRed).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 0);
  });

  it("timing: go again refunds the play AP after the destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [scrubTheDeckBlue],
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(scrubTheDeckBlue);
    expectFabPlayer(Gravy).toHaveAP(0);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Gravy).toHaveAP(1);
    expectFabCard(Gravy, scrubTheDeckBlue).toBeIn("graveyard");
    expectFabCard(Gravy, snatchRed).toBeIn("graveyard");
  });
});
