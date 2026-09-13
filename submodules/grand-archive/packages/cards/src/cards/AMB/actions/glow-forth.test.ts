import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { glowForth } from "./glow-forth.ts";

function championAt(level: number) {
  const base = createClassBonusTestChampion(glowForth, false, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("expected single face");
  const canonicalId = `${base.canonicalId}-lv${level}`;
  return {
    ...base,
    canonicalId,
    slug: `${base.slug}-lv${level}`,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...base.layout.face,
        id: grandArchiveDefaultFaceId(canonicalId),
        catalogId: canonicalId,
        stats: { ...base.layout.face.stats, level },
      },
    },
  };
}

function setup(animals: number, level: number) {
  const starter = championAt(0);
  return GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion: starter,
      lineage: Array.from({ length: level }, (_, index) => championAt(index + 1)),
      zones: {
        hand: [glowForth, ...Array.from({ length: 2 }, () => woodlandSquirrels)],
        field: [...Array.from({ length: animals }, () => woodlandSquirrels), automatedGardener],
        "main-deck": [woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: {
      champion: championAt(0),
      zones: { field: [woodlandSquirrels, automatedGardener] },
    },
  });
}

/** @covers 27jlb9h1a5-a1 */
describe("Glow Forth — Animal activation discount", () => {
  for (const animals of [0, 2]) {
    it(`costs ${Math.max(0, 2 - animals)} with ${animals} controlled Animals`, () => {
      const cost = Math.max(0, 2 - animals);
      const game = setup(animals, 0);
      const player = game.player("player-one");
      const payment = player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
      if (cost > 0) {
        const before = game.state;
        expect(() => player.activate(glowForth, { reservePayment: payment.slice(1) })).toThrow();
        expect(game.state).toEqual(before);
      }
      player.activate(glowForth, cost > 0 ? { reservePayment: payment } : undefined);
      expect(player.zone("memory")).toHaveLength(cost);
    });
  }
});

/** @covers 27jlb9h1a5-a2 */
describe("Glow Forth — buff each controlled ally", () => {
  it("buffs every controlled ally and leaves opposing allies unchanged", () => {
    const game = setup(1, 0);
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    player.activate(glowForth, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 1)
        .map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
    });
    passEffectsStack(game);
    for (const ally of [
      ...player.cards(woodlandSquirrels, { zone: "field" }),
      player.card(automatedGardener, { zone: "field" }),
    ]) {
      expect(game.state.objects[ally.objectId]!.counters.buff).toBe(1);
    }
    expect(
      game.state.objects[opponent.card(woodlandSquirrels, { zone: "field" }).objectId]!.counters
        .buff ?? 0,
    ).toBe(0);
    expect(
      game.state.objects[opponent.card(automatedGardener, { zone: "field" }).objectId]!.counters
        .buff ?? 0,
    ).toBe(0);
  });
});

/** @covers 27jlb9h1a5-a3 */
describe("Glow Forth — Level 4+ memory draw", () => {
  for (const level of [3, 4]) {
    it(`${level >= 4 ? "draws" : "does not draw"} into memory at level ${level}`, () => {
      const game = setup(2, level);
      const player = game.player("player-one");
      const deck = player.zone("main-deck");
      player.activate(glowForth);
      passEffectsStack(game);
      expect(player.zone("memory")).toEqual(level >= 4 ? [deck[0]] : []);
      expect(player.zone("main-deck")).toEqual(level >= 4 ? deck.slice(1) : deck);
    });
  }
});
