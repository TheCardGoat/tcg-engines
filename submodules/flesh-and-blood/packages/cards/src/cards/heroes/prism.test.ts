import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { prism } from "./prism.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Prism (MON002) — Light Illusionist Hero — Young — 20hp.
 *
 * Printed: "Once per Turn Instant - {r}{r}, banish a card from your soul:
 * Create a Spectral Shield token."
 *
 * Signature weapon: Luminaris (MON003).
 *
 * Pattern mirrors prism-sculptor-of-arc-light.test.ts (adult MST019 twin).
 */

const hero = prism;
const opponentHero = dash;

describe("prism (MON002) AAA", () => {
  it("core mechanic: pays {r}{r} and banishes a soul card to create a Spectral Shield", () => {
    const game = FabTestEngine.start(
      {
        hero,
        resourcePoints: 2, // cost {r}{r}
        soul: [nimblismBlue], // banish cost
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Prism = game.as(hero);

    Prism.activate(hero);
    game.passBoth();

    expectFabPlayer(Prism).toHaveResourceCount(0);
    expectFabCard(Prism, nimblismBlue).toBeIn("banished");
    expectFabToken(game, "spectral-shield").toHaveCount(1).toBeIn("arena");
    // An Instant activation consumes no action point.
    expectFabPlayer(Prism).toHaveAP(1);
  });

  it("boundary: without a soul card the activation is illegal", () => {
    const game = FabTestEngine.start(
      { hero, resourcePoints: 2, hand: [snatchRed], deck: 6 },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Prism = game.as(hero);

    Prism.expectActivationRejected(hero);
    expectFabToken(game, "spectral-shield").toHaveCount(0);
  });

  it("boundary: once per turn — a second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero,
        resourcePoints: 4,
        soul: [nimblismBlue, snatchRed],
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Prism = game.as(hero);

    Prism.activate(hero);
    Prism.target(nimblismBlue); // choose which soul card to banish
    game.passBoth();
    expectFabToken(game, "spectral-shield").toHaveCount(1);

    Prism.expectActivationRejected(hero);
    expectFabToken(game, "spectral-shield").toHaveCount(1);
  });
});
