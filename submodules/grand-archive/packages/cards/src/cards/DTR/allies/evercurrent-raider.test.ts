import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { evercurrentRaider } from "./evercurrent-raider.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 0r7j97g2zh-a2 */
describe("Evercurrent Raider — Ephemerate 2", () => {
  for (const ephemerate of [false, true])
    it(`pays two reserve and leaves for ${ephemerate ? "banishment" : "graveyard"}`, () => {
      const champion = createClassBonusTestChampion(
        evercurrentRaider,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              ...(ephemerate ? [] : [evercurrentRaider]),
              woodlandSquirrels,
              woodlandSquirrels,
            ],
            graveyard: ephemerate ? [evercurrentRaider] : [],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const card = p.card(evercurrentRaider);
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const method = ephemerate ? "ephemerate" : undefined;
      const before = game.state;
      expect(() =>
        p.activate(card, { activationMethod: method, reservePayment: payment.slice(1) }),
      ).toThrow();
      expect(game.state).toEqual(before);
      if (ephemerate) {
        expect(() => p.activate(card, { reservePayment: payment })).toThrow();
        expect(game.state).toEqual(before);
      }
      p.activate(card, { activationMethod: method, reservePayment: payment });
      expect(p.zone("memory")).toHaveLength(2);
      passEffectsStack(game);
      expect(game.state.objects[card.objectId]!.zone).toBe("field");
      expect(game.state.objects[card.objectId]!.states.has("ephemeral")).toBe(ephemerate);
      advanceToMain(game, q.id);
      for (const attacker of q.cards(woodlandSquirrels, { zone: "field" })) {
        q.declareAttack(attacker, card);
        game.resolveCombatWithoutRetaliation();
      }
      expect(game.state.objects[card.objectId]!.zone).toBe(ephemerate ? "banishment" : "graveyard");
    });
});
