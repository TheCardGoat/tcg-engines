import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { descendentGustwaveBlue } from "../actions/descendent-gustwave.ts";
import { surgingStrikeRed } from "../actions/surging-strike.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "../actions/snatch.ts";
import { visitTheFloatingDojoBlue } from "./visit-the-floating-dojo.ts";

/**
 * Visit the Floating Dojo (OUT055) — Ninja Instant, cost 0, Katsu specialization.
 *
 * Printed: Put a Surging Strike and a card with combo from your graveyard on
 * the top and/or bottom of your deck.
 */

describe("Visit the Floating Dojo (OUT055) AAA", () => {
  it("happy: puts Surging Strike and a combo card from the graveyard onto the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [visitTheFloatingDojoBlue],
        graveyard: [surgingStrikeRed, descendentGustwaveBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.must.playInstant(visitTheFloatingDojoBlue);
    game.passBoth();
    Katsu.choose("option-0");
    Katsu.target(Katsu.cardsIn("graveyard", surgingStrikeRed)[0]!);
    Katsu.choose("option-0");
    Katsu.target(Katsu.cardsIn("graveyard", descendentGustwaveBlue)[0]!);
    game.helpers.resolveUntilIdle();

    expectFabCard(Katsu, visitTheFloatingDojoBlue).toBeIn("graveyard");
    expect(Katsu.cardsIn("deck", surgingStrikeRed)).toHaveLength(1);
    expect(Katsu.cardsIn("deck", descendentGustwaveBlue)).toHaveLength(1);
  });

  it("boundary: with no Surging Strike in graveyard the instant stays on the stack", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [visitTheFloatingDojoBlue],
        graveyard: [descendentGustwaveBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.must.playInstant(visitTheFloatingDojoBlue);

    expect(Katsu.zone("graveyard")).toContain(descendentGustwaveBlue.canonicalId);
  });

  it("timing: Surging Strike without a combo card in graveyard does not complete the printed pair", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [visitTheFloatingDojoBlue],
        graveyard: [surgingStrikeRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.must.playInstant(visitTheFloatingDojoBlue);
    game.passBoth();
    Katsu.choose("option-0");

    // Singleton Surging Strike is determined (CR 1.8.6c) onto the deck; Snatch
    // has no combo so the printed pair does not complete.
    expect(Katsu.cardsIn("deck", surgingStrikeRed)).toHaveLength(1);
    expectFabCard(Katsu, snatchRed).toBeIn("graveyard");
  });
});
