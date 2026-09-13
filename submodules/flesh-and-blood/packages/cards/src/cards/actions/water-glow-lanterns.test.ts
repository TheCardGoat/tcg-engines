import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prismSculptorOfArcLight } from "../heroes/prism-sculptor-of-arc-light.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { waterGlowLanternsRed } from "./water-glow-lanterns.ts";

/**
 * Water Glow Lanterns (DYN230) — Illusionist Action, cost 0, 2{d}, go again.
 *
 * Printed: "Reveal the top card of your deck. If it's red, create a Spectral
 * Shield token. Go again"
 */

describe("Water Glow Lanterns (DYN230) AAA", () => {
  it("happy: revealing a red top card creates a Spectral Shield and go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: prismSculptorOfArcLight,
        hand: [waterGlowLanternsRed],
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismSculptorOfArcLight);

    Prism.play(waterGlowLanternsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1);
    expectFabCard(Prism, waterGlowLanternsRed).toBeIn("graveyard");
    expectFabPlayer(Prism).toHaveAP(1);
  });

  it("boundary: a non-red reveal creates no Spectral Shield", () => {
    const game = FabTestEngine.start(
      {
        hero: prismSculptorOfArcLight,
        hand: [waterGlowLanternsRed],
        actionPoints: 1,
        deck: 6,
        deckTop: [brutalAssaultBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismSculptorOfArcLight);

    Prism.play(waterGlowLanternsRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });
});
