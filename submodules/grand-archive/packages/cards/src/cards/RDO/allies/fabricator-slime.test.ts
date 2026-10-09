import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { babySlime } from "../tokens/baby-slime.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { describe, expect, it } from "vitest";
import { fabricatorSlime } from "./fabricator-slime.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers rpELNyrSrM-a1 */
describe("Fabricator Slime Pride", () => {
  provePrideAlly({ card: fabricatorSlime, power: 1, pride: 3, reserveCost: 2 });
});

/** @covers rpELNyrSrM-a2 */
describe("Fabricator Slime obedience and entry", () => {
  for (const level of [2, 3])
    it(`keeps its entry buff but requires Pride for its activated ability, level=${level}`, () => {
      const base = enableAllTestElements(
        createClassBonusTestChampion(fabricatorSlime, true, "activation-discount"),
      );
      const champion = base;
      const lineage = Array.from({ length: level }, (_, index) => {
        const card = enableAllTestElements(lineageTestChampion("Fabricator", index + 1));
        const face = grandArchiveTestFace(card);
        return {
          ...card,
          layout: {
            kind: "single-faced" as const,
            face: { ...face, typeLine: grandArchiveTestFace(base).typeLine },
          },
        };
      });
      const game = GrandArchiveTestEngine.startFixture({
        definitions: [babySlime],
        playerOne: {
          champion,
          lineage,
          zones: {
            hand: [fabricatorSlime, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        source = p.card(fabricatorSlime);
      p.activate(source, {
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.counters.buff).toBe(1);
      advanceToMain(game, p.id, game.state.turn.number);
      if (level < 3) {
        const before = game.state;
        expect(() => p.activateAbility(source, "rpELNyrSrM-a3")).toThrow(/disobedient ally/i);
        expect(game.state).toEqual(before);
        expect(p.cards(babySlime)).toHaveLength(0);
      } else {
        p.activateAbility(source, "rpELNyrSrM-a3");
        passEffectsStack(game);
        expect(p.cards(babySlime, { zone: "field" })).toHaveLength(1);
      }
    });
});
