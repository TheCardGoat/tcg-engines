import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { lavasoulTiger } from "./lavasoul-tiger.ts";
import { sunQuanSealbearer } from "./sun-quan-sealbearer.ts";

function leveledClassChampion(card: typeof sunQuanSealbearer, matching: boolean, level: number) {
  const base = createClassBonusTestChampion(card, matching, "activation-discount");
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

/** @covers c5hgwip1ik-a1 */
describe("Sun Quan, Sealbearer — Level 1+ entry buff", () => {
  for (const level of [0, 1]) {
    it(`level ${level} ${level >= 1 ? "puts" : "does not put"} a buff counter`, () => {
      const { champion, lineage } = leveledClassChampion(sunQuanSealbearer, true, level);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          lineage,
          zones: {
            hand: [
              sunQuanSealbearer,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            field: [woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.activate(sunQuanSealbearer, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      player.pass();
      opponent.pass();
      const ally = player.card(woodlandSquirrels, { zone: "field" });
      const sunQuan = player.card(sunQuanSealbearer, { zone: "field" });
      if (level < 1) {
        passEffectsStack(game);
        expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(0);
        return;
      }
      expect(
        game.state.decision?.kind === "announce-triggered-ability" ||
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "c5hgwip1ik-a1",
          ),
      ).toBe(true);
      const before = game.state;
      expect(() =>
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [sunQuan.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [ally.objectId] },
      });
      expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(0);
      passEffectsStack(game);
      expect(game.state.objects[ally.objectId]!.counters.buff).toBe(1);
    });
  }
});

/** @covers c5hgwip1ik-a2 */
describe("Sun Quan, Sealbearer — Level 2+ lose Pride", () => {
  for (const level of [1, 2]) {
    it(`level ${level} ${level >= 2 ? "lets" : "blocks"} a buffed Pride 3 ally`, () => {
      const { champion, lineage } = leveledClassChampion(sunQuanSealbearer, true, level);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          lineage,
          zones: {
            hand: [
              sunQuanSealbearer,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            field: [lavasoulTiger],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const tiger = player.card(lavasoulTiger, { zone: "field" });
      const target = opponent.card(champion, { zone: "field" });
      player.activate(sunQuanSealbearer, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      player.pass();
      opponent.pass();
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [tiger.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[tiger.objectId]!.counters.buff).toBe(1);
      if (level < 2) {
        const before = game.state;
        expect(() => player.declareAttack(tiger, target)).toThrow(
          /disobedient|cannot declare an attack/i,
        );
        expect(game.state).toEqual(before);
        return;
      }
      player.declareAttack(tiger, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(6);
    });
  }

  it("does not strip Pride from an ally without a buff counter", () => {
    const { champion, lineage } = leveledClassChampion(sunQuanSealbearer, true, 2);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, lineage, zones: { field: [sunQuanSealbearer, lavasoulTiger] } },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.declareAttack(lavasoulTiger, game.player("player-two").card(champion)),
    ).toThrow(/disobedient|cannot declare an attack/i);
    expect(game.state).toEqual(before);
  });
});
