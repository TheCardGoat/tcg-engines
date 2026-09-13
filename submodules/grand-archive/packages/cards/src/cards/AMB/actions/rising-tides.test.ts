import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { risingTides } from "./rising-tides.ts";

function championAtLevel(classBonus: boolean, level: number) {
  const base = createClassBonusTestChampion(risingTides, classBonus, "activation-discount");
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

/** @covers y6q4goxi8a-a1 */
describe("Rising Tides — Class Bonus Level 3+ memory draw", () => {
  it("draws into memory only with Class Bonus and a level 3 or higher champion", () => {
    for (const classBonus of [false, true]) {
      for (const level of [2, 3]) {
        const starter = championAtLevel(classBonus, 0);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion: starter,
            lineage: Array.from({ length: level }, (_, index) =>
              championAtLevel(classBonus, index + 1),
            ),
            zones: {
              hand: [risingTides, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: { champion: starter },
        });
        const player = game.player("player-one");
        const deck = player.zone("main-deck");
        player.activate(risingTides, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        });
        passEffectsStack(game);
        if (classBonus && level >= 3) {
          expect(player.zone("memory")).toContainEqual(deck[0]);
          expect(player.zone("main-deck")).toEqual([]);
        } else {
          expect(player.zone("memory")).toHaveLength(2);
          expect(player.zone("main-deck")).toEqual(deck);
        }
      }
    }
  });
});
