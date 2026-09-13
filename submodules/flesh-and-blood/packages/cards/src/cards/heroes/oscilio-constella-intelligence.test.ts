import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { oscilioConstellaIntelligence } from "./oscilio-constella-intelligence.ts";

/**
 * Oscilio, Constella Intelligence (ROS019) — Elemental Wizard Hero — 36hp.
 *
 * Printed: "Once per Turn Instant - Discard an instant: Draw a card.
 * Essence of Lightning"
 */

describe("Oscilio, Constella Intelligence (ROS019) AAA", () => {
  it("discards an instant and draws exactly one card", () => {
    const game = FabTestEngine.start(
      { hero: oscilioConstellaIntelligence, hand: [sigilOfSolaceRed], deck: [snatchRed] },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Oscilio = game.as(oscilioConstellaIntelligence);

    Oscilio.activate(oscilioConstellaIntelligence);
    Oscilio.target(sigilOfSolaceRed);
    game.passBoth(); // resolve the layer: discard + draw

    // The Instant was discarded; the deck top was drawn in its place.
    expectFabCard(Oscilio, sigilOfSolaceRed).toBeIn("graveyard");
    expectFabCard(Oscilio, snatchRed).toBeIn("hand");
    expectFabPlayer(Oscilio).toHaveHandCount(1);
  });

  it("boundary: the discard cost requires an Instant — non-Instant hand rejects", () => {
    const game = FabTestEngine.start(
      { hero: oscilioConstellaIntelligence, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
    );
    const Oscilio = game.as(oscilioConstellaIntelligence);

    expectFabUnplayable(
      () => Oscilio.activate(oscilioConstellaIntelligence),
      /discard is unavailable/i,
    );
    expectFabPlayer(Oscilio).toHaveHandCount(1);
  });

  it("boundary: once per turn — a second activation is illegal", () => {
    const game = FabTestEngine.start(
      { hero: oscilioConstellaIntelligence, hand: [sigilOfSolaceRed, sigilOfSolaceRed], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Oscilio = game.as(oscilioConstellaIntelligence);

    Oscilio.activate(oscilioConstellaIntelligence);
    Oscilio.target(Oscilio.cardsIn("hand", sigilOfSolaceRed)[0]!);

    Oscilio.expectActivationRejected(oscilioConstellaIntelligence);
  });
});
