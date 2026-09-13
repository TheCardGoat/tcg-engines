import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { promisingRecruit } from "./promising-recruit.ts";

function leveledClassChampion(level: number) {
  const base = createClassBonusTestChampion(promisingRecruit, false, "activation-discount");
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

function passToEnd(game: GrandArchiveTestEngine): void {
  for (let step = 0; game.state.turn.phase !== "end" && step < 32; step++) {
    const wait = game.waitState();
    if (wait.kind === "materialization-choice")
      game.player(wait.playerId).execute({ move: "skip-materialization" });
    else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
    else throw new Error(`Unexpected ${wait.kind}`);
  }
  expect(game.state.turn.phase).toBe("end");
}

/** @covers h57rcfw46q-a1 */
describe("Promising Recruit — Level 2+ end-phase buff", () => {
  for (const level of [1, 2]) {
    it(`level ${level} ${level >= 2 ? "puts" : "does not put"} a buff counter`, () => {
      const { champion, lineage } = leveledClassChampion(level);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          lineage,
          zones: {
            field: [promisingRecruit],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const recruit = player.card(promisingRecruit, { zone: "field" });
      passToEnd(game);
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "h57rcfw46q-a1",
        ),
      ).toBe(level >= 2);
      expect(game.state.objects[recruit.objectId]!.counters.buff ?? 0).toBe(0);
      passEffectsStack(game);
      expect(game.state.objects[recruit.objectId]!.counters.buff ?? 0).toBe(level >= 2 ? 1 : 0);
    });
  }
});
