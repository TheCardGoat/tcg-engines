import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { barnacleYellow } from "./barnacle.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { scrubTheDeckBlue } from "./scrub-the-deck.ts";

/**
 * Scrub the Deck (SEA147) — Pirate Action.
 *
 * Printed:
 *   Destroy the top card of target hero's deck. If it's yellow, create a Gold token.
 *   Go again
 *
 * The target hero is declared when the card is played (CR 1.8.5); the deck
 * top is a non-target subject scoped to that hero (CR 1.8.5c) — never the
 * caster's own deck unless the caster declares themselves.
 */

describe("Scrub the Deck (SEA147) AAA", () => {
  it("happy: destroying the target hero's yellow top card creates a Gold token", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [scrubTheDeckBlue],
        actionPoints: 1,
        deckTop: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [barnacleYellow], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.play(scrubTheDeckBlue, { target: Dash.id });
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Dash, barnacleYellow).toBeIn("graveyard");
    expect(Dash.zone("deck")).not.toContain(barnacleYellow.canonicalId);
    expect(Gravy.zone("deck")).toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 1);
  });

  it("boundary: a non-yellow top card creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [scrubTheDeckBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.play(scrubTheDeckBlue, { target: Dash.id });
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 0);
  });

  it("target: the caster may declare themselves and scrub their own top", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [scrubTheDeckBlue],
        actionPoints: 1,
        deckTop: [barnacleYellow],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.play(scrubTheDeckBlue, { target: Gravy.id });
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Gravy, barnacleYellow).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveTokenCount("gold", 1);
  });

  it("timing: go again refunds the play AP after the destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [scrubTheDeckBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);
    const Dash = game.as(dash);

    Gravy.play(scrubTheDeckBlue, { target: Dash.id });
    expectFabPlayer(Gravy).toHaveAP(0);
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Gravy).toHaveAP(1);
    expectFabCard(Gravy, scrubTheDeckBlue).toBeIn("graveyard");
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
  });
});
