import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveDrawCardResolution } from "../../../testing/draw-card-resolution.ts";
import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { indolentLeisure } from "./indolent-leisure.ts";

function championAt(classBonus: boolean, level: number) {
  const base = createClassBonusTestChampion(indolentLeisure, classBonus, "activation-discount");
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

/** @covers 29bvfw3te2-a1 */
describe("Indolent Leisure — Draw a card", () => {
  proveDrawCardResolution({ card: indolentLeisure });
});

/** @covers 29bvfw3te2-a2 */
describe("Indolent Leisure — Class Bonus Level 3+ memory draw", () => {
  for (const [classBonus, level] of [
    [true, 3],
    [true, 2],
    [false, 3],
  ] as const) {
    it(`${classBonus && level >= 3 ? "draws" : "does not draw"} into memory when class=${classBonus} level=${level}`, () => {
      const starter = championAt(classBonus, 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          lineage: Array.from({ length: level }, (_, index) => championAt(classBonus, index + 1)),
          zones: {
            hand: [indolentLeisure, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion: championAt(false, 0) },
      });
      const player = game.player("player-one");
      const deck = player.zone("main-deck");
      player.activate(indolentLeisure, {
        reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
          kind: "card" as const,
          cardId: card.objectId,
        })),
      });
      passEffectsStack(game);
      expect(player.zone("hand")).toEqual([deck[0]]);
      expect(player.zone("memory")).toHaveLength(classBonus && level >= 3 ? 4 : 3);
      if (classBonus && level >= 3) expect(player.zone("memory")).toContainEqual(deck[1]);
    });
  }
});
