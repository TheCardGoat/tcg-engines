import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { vengefulGust } from "./vengeful-gust.ts";

function championAtLevel(level: number) {
  const base = createClassBonusTestChampion(vengefulGust, true, "activation-discount");
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

/** @covers q4dvnn3zp1-a1 */
describe("Vengeful Gust — suppress", () => {
  it("temporarily banishes an opposing ally and returns it at the next end phase", () => {
    const champion = championAtLevel(0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [vengefulGust, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: { field: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const target = opponent.card(woodlandSquirrels, { zone: "field" });
    const before = game.state;
    expect(() =>
      player.activate(vengefulGust, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        targets: { "target-1": [opponent.card(champion, { zone: "field" }).objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    player.activate(vengefulGust, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(opponent.cards(woodlandSquirrels, { zone: "banishment" })).toEqual([target]);
    for (let step = 0; step < 64; step++) {
      if (game.state.stack.some((item) => item.kind === "triggered-ability")) break;
      const wait = game.waitState();
      if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
      game.player(wait.playerId).pass();
    }
    expect(game.state.turn.phase).toBe("end");
    passEffectsStack(game);
    expect(opponent.cards(woodlandSquirrels, { zone: "field" })).toEqual([target]);
  });
});

/** @covers q4dvnn3zp1-a2 */
describe("Vengeful Gust — re-entry after suppress", () => {
  it("makes the suppressed ally deal four to its champion on re-entry only at level 3+", () => {
    for (const level of [2, 3] as const) {
      const starter = championAtLevel(0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: Array.from({ length: level }, (_, index) => championAtLevel(index + 1)),
          zones: {
            hand: [vengefulGust, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: starter,
          zones: { field: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const target = opponent.card(woodlandSquirrels, { zone: "field" });
      player.activate(vengefulGust, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      for (let step = 0; step < 64; step++) {
        if (game.state.stack.some((item) => item.kind === "triggered-ability")) break;
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      passEffectsStack(game);
      const opposingChampion = opponent.card(starter, { zone: "field" });
      expect(opponent.cards(woodlandSquirrels, { zone: "field" })).toEqual([target]);
      expect(game.state.objects[opposingChampion.objectId]!.damage).toBe(level >= 3 ? 4 : 0);
    }
  });
});
