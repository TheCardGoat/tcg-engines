import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { enchantedFete } from "./enchanted-fete.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers s190ox288c-a1 */
describe("Enchanted Fete", () => {
  for (const damage of [0, 2, 5]) {
    it(`recovers only its controller's champion from ${damage} damage and draws into memory`, () => {
      const champion = createClassBonusTestChampion(enchantedFete, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            hand: [enchantedFete, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            field: [giantTortoise],
            memory: [giantTortoise],
            "main-deck": [giantTortoise, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: Array.from({ length: damage + 1 }, () => woodlandSquirrels),
            "main-deck": [woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const hero = p.card(champion),
        ally = p.card(giantTortoise, { zone: "field" });
      const attackers = q.cards(woodlandSquirrels, { zone: "field" });
      for (const attacker of attackers.slice(0, damage)) {
        q.declareAttack(attacker, hero);
        game.resolveCombatWithoutRetaliation();
      }
      q.declareAttack(attackers[damage]!, ally);
      game.resolveCombatWithoutRetaliation();
      q.pass();
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() => p.activate(enchantedFete, { reservePayment: payment.slice(1) })).toThrow();
      expect(game.state).toEqual(before);
      const deck = p.zone("main-deck"),
        otherDeck = q.zone("main-deck");
      p.activate(enchantedFete, { reservePayment: payment });
      const memory = p.zone("memory");
      expect(memory).toHaveLength(5);
      expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
      expect(p.zone("main-deck")).toEqual(deck);
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(Math.max(0, damage - 3));
      expect(game.state.objects[ally.objectId]!.damage).toBe(1);
      expect(p.zone("memory")).toEqual([...memory, deck[0]]);
      expect(p.zone("main-deck")).toEqual(deck.slice(1));
      expect(p.zone("hand")).toHaveLength(0);
      expect(p.cards(enchantedFete, { zone: "graveyard" })).toHaveLength(1);
      expect(q.zone("main-deck")).toEqual(otherDeck);
      expect(q.zone("memory")).toHaveLength(0);
      expect(game.state.stack).toHaveLength(0);
    });
  }
});
