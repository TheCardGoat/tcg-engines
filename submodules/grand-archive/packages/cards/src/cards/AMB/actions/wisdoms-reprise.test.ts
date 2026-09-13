import type { GrandArchiveGlimpseAnswer } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { harvestHerbs } from "../../ALC/actions/harvest-herbs.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { wisdomsReprise } from "./wisdoms-reprise.ts";

function championAtLevel(level: number) {
  const base = createClassBonusTestChampion(wisdomsReprise, false, "activation-discount");
  const face = base.layout.kind === "single-faced" ? base.layout.face : base.layout.defaultFace;
  const canonicalId = `${base.canonicalId}-lv${level}`;
  return {
    ...base,
    canonicalId,
    slug: canonicalId,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...face,
        id: grandArchiveDefaultFaceId(canonicalId),
        catalogId: canonicalId,
        cost: { kind: "memory" as const, amount: level },
        stats: { level, life: 20 },
      },
    },
  };
}

function fixture(level: number) {
  const starter = championAtLevel(0);
  const lineage = Array.from({ length: level }, (_, index) => championAtLevel(index + 1));
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: starter,
      lineage,
      zones: {
        hand: [wisdomsReprise, woodlandSquirrels],
        "main-deck": [woodlandSquirrels, reposition, harvestHerbs, woodlandSquirrels],
      },
    },
    playerTwo: { champion: starter, zones: { "main-deck": [woodlandSquirrels] } },
  });
  return { game, starter };
}

/** @covers lvmj48fn9p-a1 */
describe("Wisdom's Reprise — Glimpse 3", () => {
  it("reorders three looked-at cards before any draw", () => {
    const { game } = fixture(0);
    const player = game.player("player-one");
    const deck = player.zone("main-deck");
    player.activate(wisdomsReprise, {
      reservePayment: [
        { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
      ],
    });
    expect(player.zone("main-deck")).toEqual(deck);
    passEffectsStack(game);
    const glimpse = game.state.decision;
    if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse 3");
    expect(glimpse.cardIds).toEqual(deck.slice(0, 3).map((card) => card.objectId));
    const bottom = deck.slice(0, 3).reverse();
    answerDecision(game, "resolve-glimpse", {
      kind: "reorder",
      top: [],
      bottom: bottom.map((card) => card.objectId),
    } satisfies GrandArchiveGlimpseAnswer);
    passEffectsStack(game);
    expect(player.zone("main-deck")).toEqual([...deck.slice(3), ...bottom]);
    expect(player.zone("memory")).toHaveLength(1);
  });
});

/** @covers lvmj48fn9p-a2 */
describe("Wisdom's Reprise — Level 3+ memory draw", () => {
  it("draws one card into memory only when the champion is level 3 or higher", () => {
    for (const level of [2, 3] as const) {
      const { game } = fixture(level);
      const player = game.player("player-one");
      const deck = player.zone("main-deck");
      player.activate(wisdomsReprise, {
        reservePayment: [
          { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      });
      passEffectsStack(game);
      const glimpse = game.state.decision;
      if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse 3");
      answerDecision(game, "resolve-glimpse", {
        kind: "reorder",
        top: glimpse.cardIds,
        bottom: [],
      } satisfies GrandArchiveGlimpseAnswer);
      passEffectsStack(game);
      if (level >= 3) {
        expect(player.zone("memory")).toContainEqual(deck[0]);
        expect(player.zone("memory")).toHaveLength(2);
        expect(player.zone("main-deck")).toEqual(deck.slice(1));
      } else {
        expect(player.zone("memory")).toHaveLength(1);
        expect(player.zone("main-deck")).toEqual(deck);
      }
      expect(player.zone("hand")).toHaveLength(0);
    }
  });
});
