import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { fealty } from "../tokens/fealty.ts";
import { huntSEndRed } from "./hunt-s-end.ts";

/**
 * Hunt's End (HNT101) — Draconic Warrior Attack Reaction, cost 0, 3{d}.
 *
 * Printed: "Play this only if you control 3 or more Fealty tokens.
 * Target dagger attack gets +4{p}."
 */

describe("Hunt's End (HNT101) AAA", () => {
  it("happy: with 3 Fealty a dagger attack gets +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        arena: [fealty, fealty, fealty],
        hand: [huntSEndRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.must.playReaction(huntSEndRed);
    game.passBoth();

    // 1 + 4 (3 Fealty) — this link's Draconic reaction also turns on Obsidian
    // Fire Vein's printed "+1{p} and go again".
    expectCombat(game).toHaveAttackPower(6);
    expectFabCard(Fang, huntSEndRed).toBeIn("graveyard");
  });

  it("boundary: 2 Fealty cannot play this", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        arena: [fealty, fealty],
        hand: [huntSEndRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    expect(() => Fang.must.playReaction(huntSEndRed)).toThrow(/play condition is not satisfied/);
    expectFabCard(Fang, huntSEndRed).toBeIn("hand");
  });

  it("boundary: 0 Fealty cannot play this", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        weapon1: [obsidianFireVein],
        hand: [huntSEndRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.must.activate(obsidianFireVein);
    game.advanceCombatTo("reaction");
    expect(() => Fang.must.playReaction(huntSEndRed)).toThrow(/play condition is not satisfied/);
    expectFabCard(Fang, huntSEndRed).toBeIn("hand");
  });
});
