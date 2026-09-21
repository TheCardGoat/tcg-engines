import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import {
  advanceToMain,
  passEffectsStack,
  declareResolvedAttack,
  advanceCombatToTrigger,
} from "./decisions.ts";
export function proveOnAttackRecover({
  card,
  abilityId,
  amount,
  attackCost,
  classRestricted = false,
  power = 3,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  amount: number;
  attackCost?: number;
  classRestricted?: boolean;
  power?: number;
}): void {
  for (const classBonus of classRestricted ? [false, true] : [false])
    for (const damage of [0, 1, amount + 2])
      it(`recovers ${amount} from ${damage} damage, class=${classBonus}`, () => {
        const champion = createClassBonusTestChampion(card, classBonus, "activation-discount"),
          attack = attackCost !== undefined;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: Array.from({ length: damage }, () => woodlandSquirrels),
              "main-deck": [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: attack ? [] : [card],
              hand: attack
                ? [card, ...Array.from({ length: attackCost }, () => woodlandSquirrels)]
                : [],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const q = game.player("player-one"),
          p = game.player("player-two"),
          id = p.card(champion).objectId;
        for (const attacker of q.cards(woodlandSquirrels, { zone: "field" })) {
          q.declareAttack(attacker, p.card(champion));
          game.resolveCombatWithoutRetaliation();
        }
        expect(game.state.objects[id]!.damage).toBe(damage);
        advanceToMain(game, p.id);
        if (attack) {
          p.activate(card, {
            attackAttackerId: id,
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, attackCost)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          declareResolvedAttack(game, id, q.card(champion).objectId, "Declare healing attack");
        } else p.declareAttack(card, q.card(champion));
        advanceCombatToTrigger(game, abilityId);
        expect(game.state.objects[id]!.damage).toBe(damage);
        passEffectsStack(game);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[id]!.damage).toBe(
          Math.max(0, damage - (!classRestricted || classBonus ? amount : 0)),
        );
        expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(attack ? power : 1);
      });
}
