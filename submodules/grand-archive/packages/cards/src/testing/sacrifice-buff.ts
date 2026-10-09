import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveSacrificeBuff(
  card: Card,
  abilityId: string,
  cost: number,
  recoveryId: string,
) {
  for (const matching of [false, true])
    for (const own of [false, true])
      for (const bounce of [false, true])
        it(`sacrifices before buffing exactly one ally: class=${matching}, own=${own}, bounce=${bounce}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [card, woodlandSquirrels],
                hand: [reclaim, ...Array.from({ length: cost + 3 }, () => woodlandSquirrels)],
                graveyard: [woodlandSquirrels],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [card, woodlandSquirrels],
                hand: [reclaim, woodlandSquirrels, woodlandSquirrels],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card);
          const owner = own ? p : q,
            foe = own ? q : p;
          const target = owner.card(woodlandSquirrels, { zone: "field" }),
            other = foe.card(woodlandSquirrels, { zone: "field" });
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          for (const ids of [
            [],
            [target.objectId, target.objectId],
            [source.objectId],
            [p.card(champion).objectId],
            [p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId],
            [p.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
          ]) {
            const before = game.state;
            expect(() =>
              p.activateAbility(source, abilityId, {
                reservePayment: pay(cost),
                targets: { "target-1": ids },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          for (const n of [cost - 1, cost + 1]) {
            const before = game.state;
            expect(() =>
              p.activateAbility(source, abilityId, {
                reservePayment: pay(n),
                targets: { "target-1": [target.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activateAbility(source, abilityId, {
            reservePayment: pay(cost),
            targets: { "target-1": [target.objectId] },
          });
          expect(p.zone("memory")).toHaveLength(cost);
          expect(p.cards(card, { zone: "field" })).toHaveLength(0);
          if (card.definitionKind === "token-representation")
            expect(game.state.objects[source.objectId]).toBeUndefined();
          else expect(p.cards(card, { zone: "graveyard" })).toEqual([source]);
          expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(0);
          for (const repeated of [abilityId, recoveryId]) {
            const before = game.state;
            expect(() =>
              p.activateAbility(source, repeated, { targets: { "target-1": [target.objectId] } }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          if (bounce) {
            if (!own) p.pass();
            owner.activate(reclaim, {
              reservePayment: owner
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 2)
                .map((c) => ({ kind: "card", cardId: c.objectId })),
              targets: { "target-1": [target.objectId] },
            });
          }
          passEffectsStack(game);
          expect(game.state.objects[other.objectId]!.counters.buff ?? 0).toBe(0);
          expect(q.cards(card, { zone: "field" })).toHaveLength(1);
          if (bounce) {
            expect(game.state.objects[target.objectId]!.zone).toBe("hand");
            expect(game.state.objects[target.objectId]!.counters.buff ?? 0).toBe(0);
            expect(p.zone("memory")).toHaveLength(cost + (own ? 2 : 0));
            return;
          }
          expect(game.state.objects[target.objectId]!.counters.buff).toBe(1);
          for (const stat of ["power", "life"] as const)
            expect(
              deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, stat, {
                program: game.program,
                state: game.state,
                controllerId: owner.id,
                bindings: {},
              }),
            ).toBe(2);
          advanceToMain(game, owner.id);
          owner.declareAttack(target, foe.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[foe.card(champion).objectId]!.damage).toBe(2);
          advanceToMain(game, owner.id, game.state.turn.number);
          expect(game.state.objects[target.objectId]!.counters.buff).toBe(1);
        });
}
