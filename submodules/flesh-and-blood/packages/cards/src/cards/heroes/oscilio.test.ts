import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { oscilio } from "./oscilio.ts";
import { volzarTheLightningRod } from "../weapons/volzar-the-lightning-rod.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Oscilio (OSC001) — Elemental Wizard Hero — Young — 18hp.
 *
 * Printed: "Once per Turn Instant - Discard an instant: Draw a card.
 * Essence of Lightning"
 *
 * Signature weapon: Volzar, the Lightning Rod (OSC002).
 */

const opponentHero = dash;

describe("oscilio (OSC001) AAA", () => {
  it("core mechanic: discard an instant and draw a card", () => {
    // The seeded deck top is snatch — drawing it proves the draw leg.
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [sigilOfSolaceRed], deck: [snatchRed] },
      { hero: opponentHero, deck: 6 },
    );
    const Oscilio = game.as(oscilio);

    Oscilio.activate(oscilio);
    Oscilio.target(sigilOfSolaceRed);

    // The Instant was discarded and one card was drawn.
    expectFabCard(Oscilio, sigilOfSolaceRed).toBeIn("graveyard");
    expectFabCard(Oscilio, snatchRed).toBeIn("hand");
    expectFabPlayer(Oscilio).toHaveHandCount(1);
  });

  it("boundary: once per turn — a second activation is illegal", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [sigilOfSolaceRed, sigilOfSolaceRed], deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Oscilio = game.as(oscilio);

    Oscilio.activate(oscilio);
    Oscilio.target(Oscilio.cardsIn("hand", sigilOfSolaceRed)[0]!);

    Oscilio.expectActivationRejected(oscilio);
  });

  it("boundary: the discard cost requires an Instant — non-Instant hand rejects", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [snatchRed], deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Oscilio = game.as(oscilio);

    expectFabUnplayable(() => Oscilio.activate(oscilio), /discard is unavailable/i);
    expectFabPlayer(Oscilio).toHaveHandCount(1);
  });

  it("signature weapon: Volzar (OSC002) activates its once-per-turn Amp for {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        weapon1: [volzarTheLightningRod],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Oscilio = game.as(oscilio);

    // {r} paid for the once-per-turn Amp activation (X counts Lightning cards
    // played this turn — zero here).
    Oscilio.activate(volzarTheLightningRod);
    expectFabPlayer(Oscilio).toHaveResourceCount(0);
    Oscilio.expectActivationRejected(volzarTheLightningRod);
  });
});
