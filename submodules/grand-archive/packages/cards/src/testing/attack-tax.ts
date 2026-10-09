import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToRecollection } from "./aging-potion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveAttackTax(card: Card, abilityId: string, tax: number) {
  for (const matching of [false, true])
    for (const copies of [1, 2])
      it(`charges each declaration until this turn ends: class=${matching}, copies=${copies}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [...Array.from({ length: copies }, () => card), woodlandSquirrels],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels, woodlandSquirrels],
              hand: Array.from({ length: copies * tax * 2 }, () => woodlandSquirrels),
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          sources = p.cards(card, { zone: "field" }),
          hero = p.card(champion);
        const rejected = () => {
          const before = game.state;
          expect(() => p.activateAbility(sources[0]!, abilityId)).toThrow();
          expect(game.state).toEqual(before);
        };
        rejected();
        advanceToRecollection(game, p.id);
        rejected();
        advanceToMain(game, q.id);
        q.pass();
        rejected();
        advanceToRecollection(game, q.id);
        for (const source of sources) {
          const wait = game.waitState();
          if (wait.kind === "opportunity" && wait.playerId === q.id) q.pass();
          p.activateAbility(source, abilityId);
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
          passEffectsStack(game);
        }
        advanceToMain(game, q.id);
        const total = tax * copies;
        const startingHand = q.zone("hand").length,
          startingMemory = q.zone("memory").length;
        const attackers = q.cards(woodlandSquirrels, { zone: "field" });
        for (const [index, attacker] of attackers.entries()) {
          const pay = (n: number) =>
            q
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          const before = game.state;
          expect(() =>
            q.declareAttack(attacker, hero, { reservePayment: pay(total - 1) }),
          ).toThrow();
          expect(game.state).toEqual(before);
          q.declareAttack(attacker, hero, { reservePayment: pay(total) });
          expect(q.zone("memory")).toHaveLength(startingMemory + total * (index + 1));
          expect(q.zone("hand")).toHaveLength(startingHand - total * (index + 1));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[hero.objectId]!.damage).toBe(index + 1);
        }
        advanceToMain(game, p.id);
        const ownHand = p.zone("hand"),
          ownMemory = p.zone("memory");
        p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), q.card(champion));
        game.resolveCombatWithoutRetaliation();
        expect(p.zone("hand")).toEqual(ownHand);
        expect(p.zone("memory")).toEqual(ownMemory);
        advanceToMain(game, q.id);
        const nextHand = q.zone("hand"),
          nextMemory = q.zone("memory");
        q.declareAttack(attackers[0]!, hero);
        game.resolveCombatWithoutRetaliation();
        expect(q.zone("hand")).toEqual(nextHand);
        expect(q.zone("memory")).toEqual(nextMemory);
        expect(game.state.objects[hero.objectId]!.damage).toBe(3);
      });
}
