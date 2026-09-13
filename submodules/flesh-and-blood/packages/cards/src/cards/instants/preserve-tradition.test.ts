import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { preserveTraditionBlue } from "./preserve-tradition.ts";

/**
 * Preserve Tradition Blue (ENG027) — Mystic Instant. Legendary.
 *
 * Printed: Put target action card from your graveyard on the bottom of
 * your deck.
 * If you've played another blue card this turn, transcend.
 */

describe("Preserve Tradition (ENG027) AAA", () => {
  it("happy: bottoms a GY action and, after another blue, transcends to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [nimblismBlue, preserveTraditionBlue],
        graveyard: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(nimblismBlue); // the other blue card this turn
    game.helpers.resolveUntilIdle();

    Enigma.play(preserveTraditionBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: snatchRed.canonicalId });

    expect(Enigma.zone("deck")[0]).toBe(snatchRed.canonicalId); // bottomed
    expectFabCard(Enigma, preserveTraditionBlue).toBeIn("hand"); // transcended
  });

  it("boundary: as the first blue card it resolves to the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [preserveTraditionBlue],
        graveyard: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(preserveTraditionBlue);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: snatchRed.canonicalId });

    expect(Enigma.zone("deck")[0]).toBe(snatchRed.canonicalId);
    expectFabCard(Enigma, preserveTraditionBlue).toBeIn("graveyard");
  });
});
