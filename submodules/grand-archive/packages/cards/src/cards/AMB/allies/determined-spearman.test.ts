import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { determinedSpearman } from "./determined-spearman.ts";

function leveledClassChampion(level: number) {
  const base = createClassBonusTestChampion(determinedSpearman, false, "activation-discount");
  if (base.layout.kind !== "single-faced") throw new Error("Expected a single-faced champion.");
  const baseFace = requireSingleFace(base);
  const lineage = Array.from({ length: level }, (_, index) => {
    const lv = index + 1;
    return {
      ...base,
      canonicalId: `${base.canonicalId}-lv${lv}`,
      slug: `${base.slug}-lv${lv}`,
      layout: {
        kind: "single-faced" as const,
        face: {
          ...baseFace,
          id: grandArchiveDefaultFaceId(`${base.canonicalId}-lv${lv}`),
          stats: { ...baseFace.stats, level: lv },
        },
      },
    };
  });
  return { champion: base, lineage };
}

/** @covers c8z5ntioqs-a1 */
describe("Determined Spearman — Equestrian activation discount", () => {
  for (const horse of [false, true]) {
    it(`${horse ? "costs 2" : "costs 3"} with a Horse ally=${horse}`, () => {
      const champion = createClassBonusTestChampion(
        determinedSpearman,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [determinedSpearman, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            field: horse ? [galesMare] : [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [galesMare] } },
      });
      const player = game.player("player-one");
      const payments = player.cards(woodlandSquirrels, { zone: "hand" });
      const cost = horse ? 2 : 3;
      const before = game.state;
      expect(() =>
        player.activate(determinedSpearman, {
          reservePayment: payments
            .slice(0, cost - 1)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activate(determinedSpearman, {
        reservePayment: payments
          .slice(0, cost)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      expect(player.zone("memory")).toHaveLength(cost);
    });
  }
});

/** @covers c8z5ntioqs-a2 */
describe("Determined Spearman — Level 1+ life", () => {
  for (const level of [0, 1]) {
    it(`level ${level} ${level >= 1 ? "survives" : "dies to"} 2 damage`, () => {
      const { champion, lineage } = leveledClassChampion(level);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: { champion, lineage, zones: { field: [determinedSpearman] } },
        playerTwo: { champion, zones: { field: [automatedGardener] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      opponent.declareAttack(automatedGardener, determinedSpearman);
      game.resolveCombatWithoutRetaliation();
      expect(player.cards(determinedSpearman, { zone: "field" })).toHaveLength(level >= 1 ? 1 : 0);
    });
  }
});
