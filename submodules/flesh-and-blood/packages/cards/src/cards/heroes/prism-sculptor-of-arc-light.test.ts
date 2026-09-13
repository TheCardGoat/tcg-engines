import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { prismSculptorOfArcLight } from "./prism-sculptor-of-arc-light.ts";

/**
 * Prism, Sculptor of Arc Light (MON001) — Light Illusionist Hero.
 *
 * Printed: Once per Turn Instant - {r}{r}, banish a card from Prism's soul:
 * Create a Spectral Shield token.
 */

describe("Prism Sculptor of Arc Light (MON001) AAA", () => {
  it("happy: paying {r}{r} and banishing from soul creates a Spectral Shield", () => {
    const game = FabTestEngine.start(
      {
        hero: prismSculptorOfArcLight,
        soul: [brutalAssaultBlue],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismSculptorOfArcLight);

    Prism.activate(prismSculptorOfArcLight);
    game.passBoth();

    expectFabCard(Prism, brutalAssaultBlue).toBeIn("banished");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("spectral-shield", 0);
  });

  it("boundary: cannot activate with an empty soul", () => {
    const game = FabTestEngine.start(
      {
        hero: prismSculptorOfArcLight,
        soul: [],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismSculptorOfArcLight);

    Prism.expectActivationRejected(prismSculptorOfArcLight);
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });

  it("boundary: once per turn — a second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: prismSculptorOfArcLight,
        soul: [brutalAssaultBlue, brutalAssaultBlue],
        hand: [],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismSculptorOfArcLight);

    Prism.activate(prismSculptorOfArcLight);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1);

    Prism.expectActivationRejected(prismSculptorOfArcLight);
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1);
  });
});
