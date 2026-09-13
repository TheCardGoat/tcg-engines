import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import {
  advanceCombatToTrigger,
  answerDecision,
  passEffectsStack,
} from "../../../testing/decisions.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";
import { intricateLongbow } from "../weapons/intricate-longbow.ts";
import { steelHalberd } from "../../P24/weapons/steel-halberd.ts";
import { seafletchedSerpent } from "./seafletched-serpent.ts";

function leveledClassChampion(matching: boolean, level: number) {
  const base = createClassBonusTestChampion(seafletchedSerpent, matching, "activation-discount");
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

/** @covers h0g7nndc4s-a1 */
describe("Seafletched Serpent — Pride 2", () => {
  provePrideAlly({ card: seafletchedSerpent, pride: 2, power: 3 });
});

/** @covers h0g7nndc4s-a2 */
describe("Seafletched Serpent — Class Bonus On Hit load", () => {
  for (const classBonus of [false, true]) {
    for (const load of [false, true]) {
      it(`Class Bonus=${classBonus}, choose to load=${load}`, () => {
        const { champion, lineage } = leveledClassChampion(classBonus, 2);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            lineage,
            zones: { field: [seafletchedSerpent, intricateLongbow, steelHalberd] },
          },
          playerTwo: { champion, zones: { field: [intricateLongbow] } },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const serpent = player.card(seafletchedSerpent, { zone: "field" });
        const bow = player.card(intricateLongbow, { zone: "field" });
        player.declareAttack(serpent, opponent.card(champion, { zone: "field" }));
        if (!classBonus) {
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[serpent.objectId]!.zone).toBe("field");
          return;
        }
        advanceCombatToTrigger(game, "h0g7nndc4s-a2");
        if (game.state.decision?.kind === "announce-triggered-ability") {
          const before = game.state;
          expect(() =>
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-weapon": [player.card(steelHalberd, { zone: "field" }).objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-weapon": [bow.objectId] },
          });
        }
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", load);
          passEffectsStack(game);
        }
        if (game.state.combat) game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[serpent.objectId]!.zone).toBe(load ? "loaded" : "field");
        if (load) expect(game.state.objects[serpent.objectId]!.hostId).toBe(bow.objectId);
      });
    }
  }
});
