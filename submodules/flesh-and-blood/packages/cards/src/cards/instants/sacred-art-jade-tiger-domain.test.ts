import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { homageToAncestorsBlue } from "./homage-to-ancestors.ts";
import { zen } from "../heroes/zen.ts";
import { sacredArtJadeTigerDomainBlue } from "./sacred-art-jade-tiger-domain.ts";

/**
 * Sacred Art: Jade Tiger Domain (MST053) — Mystic Ninja Instant, cost 3.
 * Printed: choose 1 (or 3); first mode creates 2 Crouching Tigers in hand.
 */

describe("Sacred Art: Jade Tiger Domain (MST053) AAA", () => {
  it("happy: choosing the create mode puts 2 Crouching Tigers in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [sacredArtJadeTigerDomainBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(sacredArtJadeTigerDomainBlue, { modeIndexes: [0] });
    game.helpers.resolveUntilIdle();

    expect(Zen.zone("hand").filter((id) => id === "token:crouching-tiger")).toHaveLength(2);
    expectFabCard(Zen, sacredArtJadeTigerDomainBlue).toBeIn("graveyard");
  });

  it("boundary: with unpayable resources the cast is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [sacredArtJadeTigerDomainBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    expect(() => Zen.play(sacredArtJadeTigerDomainBlue, { modeIndexes: [0] })).toThrow();
    expectFabPlayer(Zen).toHaveTokenCount("crouching-tiger", 0);
  });

  it("timing: after another blue this turn, all three modes may be chosen", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [homageToAncestorsBlue, sacredArtJadeTigerDomainBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();
    Zen.play(sacredArtJadeTigerDomainBlue, { modeIndexes: [0] });
    game.helpers.resolveUntilIdle();

    expect(Zen.zone("hand").filter((id) => id === "token:crouching-tiger")).toHaveLength(2);
  });
});
