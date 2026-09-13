import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { advanceToMain } from "../../../testing/decisions.ts";
import { royalBear } from "./royal-bear.ts";

function leveledClassChampion(matching: boolean, level: number) {
  const base = createClassBonusTestChampion(royalBear, matching, "activation-discount");
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

/** @covers 51l757wvez-a1 */
describe("Royal Bear — Pride 2", () => {
  provePrideAlly({ card: royalBear, pride: 2, power: 2 });
});

/** @covers 51l757wvez-a2 */
describe("Royal Bear — Class Bonus power and life", () => {
  for (const classBonus of [false, true]) {
    it(`Class Bonus=${classBonus} attacks for ${classBonus ? 3 : 2} and has ${classBonus ? 4 : 3} life`, () => {
      const { champion, lineage } = leveledClassChampion(classBonus, 2);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          lineage,
          zones: { field: [royalBear], "main-deck": [woodlandSquirrels] },
        },
        playerTwo: {
          champion,
          zones: {
            field: [automatedGardener, woodlandSquirrels],
            "main-deck": [woodlandSquirrels],
          },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const target = opponent.card(champion, { zone: "field" });
      player.declareAttack(royalBear, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(classBonus ? 3 : 2);
      advanceToMain(game, opponent.id);
      opponent.declareAttack(automatedGardener, royalBear);
      game.resolveCombatWithoutRetaliation();
      expect(player.cards(royalBear, { zone: "field" })).toHaveLength(1);
      const wait = game.waitState();
      if (wait.kind === "opportunity" && wait.playerId !== opponent.id)
        game.player(wait.playerId).pass();
      opponent.declareAttack(woodlandSquirrels, royalBear);
      game.resolveCombatWithoutRetaliation();
      expect(player.cards(royalBear, { zone: "field" })).toHaveLength(classBonus ? 1 : 0);
    });
  }
});
