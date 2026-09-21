import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { condemnedTrinket } from "./condemned-trinket.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 21oy1nd4nw-a1 */
describe("Condemned Trinket — pays reserve, banishes itself and makes a graveyard omen", () => {
  for (const empty of [false, true])
    it(`resolves with graveyard empty=${empty}`, () => {
      const champion = createClassBonusTestChampion(condemnedTrinket, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [condemnedTrinket],
            hand: [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels, giantTortoise],
            graveyard: empty ? [] : [woodlandSquirrels, giantTortoise],
          },
        },
        playerTwo: { champion, zones: { graveyard: [woodlandSquirrels] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(condemnedTrinket);
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() =>
        p.activateAbility(source, "21oy1nd4nw-a1", { reservePayment: payment.slice(1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activateAbility(source, "21oy1nd4nw-a1", { reservePayment: payment });
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      expect(game.state.objects[source.objectId]!.counters.omen ?? 0).toBe(0);
      expect(p.zone("memory")).toHaveLength(3);
      passEffectsStack(game);
      if (!empty) {
        const state = game.state;
        for (const invalid of [
          p.card(giantTortoise, { zone: "hand" }),
          q.card(woodlandSquirrels),
          source,
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", [invalid.objectId])).toThrow();
          expect(game.state).toEqual(state);
        }
        const selected = p.card(woodlandSquirrels, { zone: "graveyard" });
        answerDecision(game, "resolve-effect-choice", [selected.objectId]);
        passEffectsStack(game);
        expect(game.state.objects[selected.objectId]!.zone).toBe("banishment");
        expect(game.state.objects[selected.objectId]!.counters.omen).toBe(1);
        expect(p.cards(giantTortoise, { zone: "graveyard" })).toHaveLength(1);
      }
      expect(game.state.decision).toBeNull();
      expect(game.state.stack).toHaveLength(0);
      expect(p.cards(giantTortoise, { zone: "hand" })).toHaveLength(1);
      expect(q.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
    });
});
