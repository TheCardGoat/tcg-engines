import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { homageToAncestorsBlue } from "./homage-to-ancestors.ts";
import { sacredArtImmortalLunarShrineBlue } from "./sacred-art-immortal-lunar-shrine.ts";

/**
 * Sacred Art: Immortal Lunar Shrine (MST032) — Mystic Illusionist Instant, cost 3.
 * Printed: choose 1 (or 3); first mode creates 2 Spectral Shield tokens.
 */

describe("Sacred Art: Immortal Lunar Shrine (MST032) AAA", () => {
  it("happy: choosing the create mode mints 2 Spectral Shields", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [sacredArtImmortalLunarShrineBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(sacredArtImmortalLunarShrineBlue, { modeIndexes: [0] });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Enigma).toHaveTokenCount("spectral-shield", 2);
    expectFabCard(Enigma, sacredArtImmortalLunarShrineBlue).toBeIn("graveyard");
  });

  it("boundary: with unpayable resources the cast is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [sacredArtImmortalLunarShrineBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    expect(() => Enigma.play(sacredArtImmortalLunarShrineBlue, { modeIndexes: [0] })).toThrow();
    expectFabPlayer(Enigma).toHaveTokenCount("spectral-shield", 0);
  });

  it("timing: after another blue this turn, all three modes may be chosen", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [homageToAncestorsBlue, sacredArtImmortalLunarShrineBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();
    Enigma.play(sacredArtImmortalLunarShrineBlue, { modeIndexes: [0] });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Enigma).toHaveTokenCount("spectral-shield", 2);
  });
});
