import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { aesanProtector } from "./aesan-protector.ts";
import { giantTortoise } from "./giant-tortoise.ts";
import { woodlandSquirrels } from "./woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers heq49UQGvQ-a2 */
describe("Aesan Protector's mandatory own-ally return", () => {
  for (const self of [false, true])
    it(`can return ${self ? "itself" : "another own ally"} after entering`, () => {
      const champion = createClassBonusTestChampion(aesanProtector, false, "activation-discount"),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [aesanProtector, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
              field: [giantTortoise],
            },
          },
          playerTwo: { champion, zones: { field: [giantTortoise] } },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(aesanProtector),
        target = self ? source : p.card(giantTortoise);
      p.activate(source, {
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(game.state.decision?.kind).toBe("announce-triggered-ability");
      for (const illegal of [q.card(giantTortoise), p.card(champion)]) {
        const before = game.state;
        expect(() =>
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-1": [illegal.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.zone).toBe("hand");
      expect(p.zone("hand").map((c) => c.objectId)).toEqual([target.objectId]);
      expect(q.cards(giantTortoise, { zone: "field" })).toHaveLength(1);
      expect(game.state.objects[source.objectId]!.zone).toBe(self ? "hand" : "field");
      expect(p.zone("memory")).toHaveLength(4);
    });
});
