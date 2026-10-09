import { expect, it } from "vitest";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import type { GrandArchiveObjectId } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { enragedBoars } from "../cards/DOA/allies/enraged-boars.ts";
import { secondWind } from "../cards/DOA/actions/second-wind.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveTargetAttackReduction(
  card: Card,
  payment: "action" | "sacrifice" | "banish" | "preparation",
  abilityId?: string,
): void {
  for (const during of [false, true])
    for (const target of ["squirrel", "boar", "champion"])
      it(`reduces ${target} attacks before=${!during}, payment=${payment}`, () => {
        const champion = enableAllTestElements(
          grantTestChampionLevel(
            createClassBonusTestChampion(card, false, "activation-discount"),
            5,
          ),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                ...(payment === "action" || payment === "preparation" ? [card] : []),
                ...Array.from({ length: 5 }, () => woodlandSquirrels),
              ],
              field: [...(payment !== "action" ? [card] : []), trainingSword],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels, enragedBoars, trainingSword],
              hand: [secondWind, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(card, { zone: payment === "action" ? "hand" : "field" });
        const attacker = q.card(
          target === "champion" ? champion : target === "boar" ? enragedBoars : woodlandSquirrels,
          { zone: "field" },
        );
        const defender = p.card(champion);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const activate = (ids: GrandArchiveObjectId[], amount = 2) =>
          payment === "action"
            ? p.activate(source, { targets: { "target-1": ids }, reservePayment: pay(amount) })
            : p.activateAbility(source, abilityId!, { targets: { "target-1": ids } });
        if (payment === "preparation") {
          const before = game.state;
          expect(() => activate([attacker.objectId])).toThrow();
          expect(game.state).toEqual(before);
          p.activate(p.card(card, { zone: "hand" }), { reservePayment: pay(3) });
          passEffectsStack(game);
          expect(game.state.objects[defender.objectId]!.counters.preparation).toBe(1);
        }
        advanceToMain(game, "player-two");
        const attack = () =>
          q.declareAttack(
            attacker,
            defender,
            target === "champion" ? { weaponIds: [q.card(trainingSword).objectId] } : {},
          );
        if (during) attack();
        q.pass();
        const before = game.state;
        for (const ids of [
          [],
          [p.card(trainingSword).objectId],
          [attacker.objectId, attacker.objectId],
        ]) {
          expect(() => activate(ids)).toThrow();
          expect(game.state).toEqual(before);
        }
        if (payment === "action") {
          expect(() => activate([attacker.objectId], 1)).toThrow();
          expect(game.state).toEqual(before);
        }
        activate([attacker.objectId]);
        if (payment === "sacrifice" || payment === "banish")
          expect(game.state.objects[source.objectId]!.zone).toBe(
            payment === "sacrifice" ? "graveyard" : "banishment",
          );
        if (payment === "preparation") {
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
          expect(game.state.objects[defender.objectId]!.counters.preparation ?? 0).toBe(0);
        }
        if (payment !== "action") {
          const paidState = game.state;
          expect(() => activate([attacker.objectId])).toThrow();
          expect(game.state).toEqual(paidState);
        }
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        if (!during) attack();
        game.resolveCombatWithoutRetaliation();
        const reduced = target === "boar" ? 1 : 0;
        expect(game.state.objects[defender.objectId]!.damage).toBe(reduced);
        if (target !== "champion") {
          q.activate(secondWind, {
            targets: { "target-1": [attacker.objectId] },
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 3)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          attack();
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[defender.objectId]!.damage).toBe(2 * reduced);
        }
        const other = q.card(target === "squirrel" ? enragedBoars : woodlandSquirrels, {
          zone: "field",
        });
        q.declareAttack(other, defender);
        game.resolveCombatWithoutRetaliation();
        const otherDamage = target === "squirrel" ? 4 : 1;
        expect(game.state.objects[defender.objectId]!.damage).toBe(2 * reduced + otherDamage);
        advanceToMain(game, "player-two", game.state.turn.number);
        attack();
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[defender.objectId]!.damage).toBe(
          2 * reduced + otherDamage + (target === "boar" ? 4 : 1),
        );
      });
}
