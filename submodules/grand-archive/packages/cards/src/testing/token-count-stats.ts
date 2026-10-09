import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { powercell } from "../cards/MRC/tokens/powercell.ts";
import { flowerbud } from "../cards/HVN/tokens/flowerbud.ts";
import { firetunedAutomaton } from "../cards/ALC/allies/firetuned-automaton.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveTokenCountStats(card: Card, weapon: boolean) {
  proveTokenEntryStats(card, weapon);
  for (const matching of [false, true])
    for (const count of [0, 1, 2, 3, 4, 6])
      for (const opposing of [0, 5])
        for (const remove of [false, true]) {
          it(`class=${matching}, own tokens=${count}, opposing tokens=${opposing}, remove during combat=${remove}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(card, matching, "activation-discount"),
            );
            const tokens = Array.from({ length: count }, (_, i) => (i % 2 ? flowerbud : powercell));
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [card, firetunedAutomaton, woodlandSquirrels, ...tokens],
                  hand: Array.from({ length: 8 }, () => woodlandSquirrels),
                },
              },
              playerTwo: {
                champion,
                zones: { field: Array.from({ length: opposing }, () => powercell) },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              source = p.card(card),
              hero = p.card(champion),
              foe = q.card(champion);
            const pay = (n: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            const bonus = (n: number) => (matching ? (weapon ? n : Math.min(n, 3)) : 0);
            const stat = (property: "power" | "life") =>
              deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, property, {
                program: game.program,
                state: game.state,
                controllerId: p.id,
                bindings: {},
              });
            expect(
              p.zone("field").filter((c) => game.state.objects[c.objectId]!.isToken),
            ).toHaveLength(count);
            expect(stat("power")).toBe(2 + bonus(count));
            if (!weapon) expect(stat("life")).toBe(2 + bonus(count));
            if (weapon) {
              const before = game.state;
              expect(() =>
                p.declareAttack(hero, foe, {
                  weaponIds: [source.objectId],
                  reservePayment: pay(1),
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
              p.declareAttack(hero, foe, { weaponIds: [source.objectId], reservePayment: pay(2) });
            } else p.declareAttack(source, foe);
            let remaining = count;
            if (remove)
              for (const cell of p.cards(powercell, { zone: "field" })) {
                p.activateAbility(cell, "qzzadf9q1v-a1", {
                  reservePayment: pay(1),
                  targets: { "target-1": [p.card(firetunedAutomaton).objectId] },
                });
                remaining--;
                expect(stat("power")).toBe(2 + bonus(remaining));
                if (!weapon) expect(stat("life")).toBe(2 + bonus(remaining));
                passEffectsStack(game);
              }
            game.resolveCombatWithoutRetaliation();
            expect(game.state.objects[foe.objectId]!.damage).toBe(2 + bonus(remaining));
            expect(stat("power")).toBe(2 + bonus(remaining));
            if (weapon) expect(game.state.objects[source.objectId]!.counters.durability).toBe(1);
            else expect(stat("life")).toBe(2 + bonus(remaining));
          });
        }
}

import { summonSentinels } from "../cards/ALC/actions/summon-sentinels.ts";
import { automatonDrone } from "../cards/ALC/tokens/automaton-drone.ts";
function proveTokenEntryStats(card: Card, weapon: boolean) {
  for (const matching of [false, true])
    for (const count of [0, 2, 3, 4])
      for (const opposing of [false, true]) {
        it(`summoned tokens update stats: class=${matching}, old tokens=${count}, opposing summoner=${opposing}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          );
          const hand = [summonSentinels, ...Array.from({ length: 6 }, () => woodlandSquirrels)];
          const deck = Array.from({ length: 8 }, () => woodlandSquirrels);
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: opposing ? "playerTwo" : "playerOne",
            definitions: [automatonDrone],
            playerOne: {
              champion,
              zones: {
                field: [card, ...Array.from({ length: count }, () => flowerbud)],
                hand: opposing ? [woodlandSquirrels, woodlandSquirrels] : hand,
                "main-deck": deck,
              },
            },
            playerTwo: { champion, zones: { hand: opposing ? hand : [], "main-deck": deck } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            actor = opposing ? q : p,
            source = p.card(card),
            foe = q.card(champion);
          const power = () =>
            deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "power", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          const expected = (n: number) => 2 + (matching ? (weapon ? n : Math.min(n, 3)) : 0);
          expect(power()).toBe(expected(count));
          actor.activate(summonSentinels, {
            reservePayment: actor
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 4)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          expect(power()).toBe(expected(count));
          passEffectsStack(game);
          const drones = actor.cards(automatonDrone, { zone: "field" });
          expect(drones).toHaveLength(2);
          for (const drone of drones)
            expect(game.state.objects[drone.objectId]).toMatchObject({
              isToken: true,
              controllerId: actor.id,
              counters: { buff: 1 },
            });
          const after = expected(count + (opposing ? 0 : 2));
          expect(power()).toBe(after);
          if (opposing) advanceToMain(game, p.id, game.state.turn.number);
          if (weapon)
            p.declareAttack(p.card(champion), foe, {
              weaponIds: [source.objectId],
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, 2)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            });
          else p.declareAttack(source, foe);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[foe.objectId]!.damage).toBe(after);
        });
      }
}
