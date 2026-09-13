import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { shiningMarchador } from "./shining-marchador.ts";

/** @covers lnl94ijbi1-a1 */
describe("Shining Marchador — On Enter pay for a buff counter", () => {
  for (const accept of [false, true]) {
    it(`${accept ? "pays (2) and buffs" : "declines payment and does not buff"}`, () => {
      const champion = createClassBonusTestChampion(shiningMarchador, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [shiningMarchador, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.activate(shiningMarchador, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      player.pass();
      opponent.pass();
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "lnl94ijbi1-a1",
        ),
      ).toBe(true);
      const ally = player.card(shiningMarchador, { zone: "field" });
      expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(0);
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", accept);
      if (accept) {
        const payment = player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
        const before = game.state;
        expect(() =>
          answerDecision(game, "resolve-effect-payment", { reservePayment: payment.slice(0, 1) }),
        ).toThrow();
        expect(game.state).toEqual(before);
        answerDecision(game, "resolve-effect-payment", { reservePayment: payment });
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [ally.objectId] },
        });
      }
      passEffectsStack(game);
      expect(game.state.objects[ally.objectId]!.counters.buff ?? 0).toBe(accept ? 1 : 0);
      player.declareAttack(ally, opponent.card(champion, { zone: "field" }));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[opponent.card(champion, { zone: "field" }).objectId]!.damage).toBe(
        accept ? 2 : 1,
      );
    });
  }
});
