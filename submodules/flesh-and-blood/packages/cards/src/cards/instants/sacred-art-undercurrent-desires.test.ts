import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { homageToAncestorsBlue } from "./homage-to-ancestors.ts";
import { nuu } from "../heroes/nuu.ts";
import { sacredArtUndercurrentDesiresBlue } from "./sacred-art-undercurrent-desires.ts";

/**
 * Sacred Art: Undercurrent Desires (MST010) — Mystic Assassin Instant, cost 3.
 * Printed: choose 1 (or 3 if another blue this turn); first mode creates a
 * Fang Strike and Slither in hand.
 */

describe("Sacred Art: Undercurrent Desires (MST010) AAA", () => {
  it("happy: choosing the create mode puts Fang Strike and Slither in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [sacredArtUndercurrentDesiresBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.play(sacredArtUndercurrentDesiresBlue, { modeIndexes: [0] });
    game.helpers.resolveUntilIdle();

    expect(Nuu.zone("hand")).toContain("token:fang-strike");
    expect(Nuu.zone("hand")).toContain("token:slither");
    expectFabCard(Nuu, sacredArtUndercurrentDesiresBlue).toBeIn("graveyard");
  });

  it("boundary: with unpayable resources the cast is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [sacredArtUndercurrentDesiresBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    expect(() => Nuu.play(sacredArtUndercurrentDesiresBlue, { modeIndexes: [0] })).toThrow();
    expectFabCard(Nuu, sacredArtUndercurrentDesiresBlue).toBeIn("hand");
  });

  it("timing: after another blue this turn, all three modes may be chosen", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [homageToAncestorsBlue, sacredArtUndercurrentDesiresBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [homageToAncestorsBlue], graveyard: [homageToAncestorsBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();
    Nuu.play(sacredArtUndercurrentDesiresBlue, { modeIndexes: [0] });
    game.helpers.resolveUntilIdle();

    expect(Nuu.zone("hand")).toContain("token:fang-strike");
    expect(Nuu.zone("hand")).toContain("token:slither");
  });
});
