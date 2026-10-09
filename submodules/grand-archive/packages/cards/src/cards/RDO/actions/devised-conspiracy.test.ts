import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { devisedConspiracy } from "./devised-conspiracy.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { requireSingleFace } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { ominousShadow } from "../../EVP/tokens/ominous-shadow.ts";
import { shimmercloakAssassin } from "../../ALC/allies/shimmercloak-assassin.ts";
/** @covers dih0LPaigc-a1
 * @covers dih0LPaigc-a2
 */
describe("Devised Conspiracy — Tristan Prepare, next champion attack, and stolen-card permission", () => {
  for (const named of [false, true])
    for (const counters of [false, true])
      for (const prepare of [false, true])
        for (const championHit of [false, true])
          it(`Tristan=${named}, counters=${counters}, prepare=${prepare}, champion hit=${championHit}`, () => {
            const base = lineageTestChampion(named ? "Tristan" : "Other", 0),
              champion = {
                ...base,
                layout: {
                  kind: "single-faced" as const,
                  face: {
                    ...requireSingleFace(base),
                    elements: ["NORM", "UMBRA"] as const,
                    stats: { level: 0, life: 30, power: 1 },
                  },
                },
              };
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [ominousShadow, woodlandSquirrels],
                  hand: [
                    devisedConspiracy,
                    devisedConspiracy,
                    acceptedContract,
                    shimmercloakAssassin,
                    ...Array.from({ length: 14 }, () => woodlandSquirrels),
                  ],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                preserveMainDeckOrder: true,
                zones: {
                  field: [giantTortoise, ominousShadow],
                  "main-deck": [
                    shimmercloakAssassin,
                    shimmercloakAssassin,
                    woodlandSquirrels,
                    woodlandSquirrels,
                  ],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              hero = p.card(champion),
              foe = q.card(champion),
              target = championHit ? foe : q.card(giantTortoise),
              shadow = p.card(ominousShadow),
              source = p.cards(devisedConspiracy, { zone: "hand" })[0]!,
              deck = q.zone("main-deck");
            const pay = (n: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            if (counters) {
              p.activate(acceptedContract, { reservePayment: pay(5) });
              passEffectsStack(game);
            }
            const options = {
                reservePayment: pay(1),
                ...(prepare ? { prepareAbilityIndexes: [0] as const } : {}),
              },
              before = game.state;
            if (prepare && (!named || !counters)) {
              expect(() => p.activate(source, options)).toThrow();
              expect(game.state).toEqual(before);
              return;
            }
            expect(() => p.activate(source, { ...options, reservePayment: [] })).toThrow();
            expect(game.state).toEqual(before);
            p.activate(source, options);
            expect(game.state.stack.at(-1)?.activationStates.includes("prepared")).toBe(prepare);
            expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(
              (counters ? 3 : 0) - (prepare ? 2 : 0),
            );
            passEffectsStack(game);
            if (prepare) {
              const paid = game.state;
              expect(() =>
                p.activate(p.cards(devisedConspiracy, { zone: "hand" })[0]!, {
                  reservePayment: pay(1),
                  prepareAbilityIndexes: [0],
                }),
              ).toThrow();
              expect(game.state).toEqual(paid);
            }
            const ready = game.state;
            expect(() =>
              p.activate(p.card(shimmercloakAssassin, { zone: "hand" }), {
                reservePayment: pay(3),
              }),
            ).toThrow();
            expect(game.state).toEqual(ready);
            p.declareAttack(p.card(woodlandSquirrels, { zone: "field" }), target);
            game.resolveCombatWithoutRetaliation();
            passEffectsStack(game);
            expect(game.state.objects[target.objectId]!.damage).toBe(1);
            expect(q.zone("main-deck")).toEqual(deck);
            const unhit = game.state;
            expect(() => p.declareAttack(shadow, target)).toThrow();
            expect(game.state).toEqual(unhit);
            p.declareAttack(hero, target);
            game.resolveCombatWithoutRetaliation();
            passEffectsStack(game);
            expect(game.state.objects[target.objectId]!.damage).toBe(4);
            const steals = prepare && championHit;
            expect(q.zone("main-deck")).toEqual(steals ? deck.slice(1) : deck);
            p.declareAttack(shadow, target);
            game.resolveCombatWithoutRetaliation();
            passEffectsStack(game);
            expect(game.state.objects[target.objectId]!.damage).toBe(5);
            expect(q.zone("main-deck")).toEqual(steals ? deck.slice(2) : deck);
            if (steals) {
              for (const stolen of deck.slice(0, 2))
                expect(game.state.objects[stolen.objectId]).toMatchObject({
                  zone: "banishment",
                  facing: "face-down",
                  ownerId: q.id,
                });
              // Permission lasts while each card remains banished, beyond the granting ability's turn.
              advanceToMain(game, p.id, game.state.turn.number);
              for (const stolen of deck.slice(0, 2)) {
                p.execute({
                  move: "activate-card",
                  cardId: stolen.objectId,
                  reservePayment: pay(3),
                });
                passEffectsStack(game);
                expect(game.state.objects[stolen.objectId]).toMatchObject({
                  zone: "field",
                  ownerId: q.id,
                  controllerId: p.id,
                });
              }
              expect(q.cards(shimmercloakAssassin, { zone: "field" })).toHaveLength(2);
            } else advanceToMain(game, p.id, game.state.turn.number);
            const nextDeck = q.zone("main-deck"),
              damage = game.state.objects[foe.objectId]!.damage;
            p.declareAttack(hero, foe);
            game.resolveCombatWithoutRetaliation();
            passEffectsStack(game);
            expect(game.state.objects[foe.objectId]!.damage).toBe(damage + 1);
            expect(q.zone("main-deck")).toEqual(nextDeck);
          });
});

import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { plantedExplosive } from "../../P26/actions/planted-explosive.ts";
import { rivetingWinds } from "../../PRD/actions/riveting-winds.ts";
/** @covers dih0LPaigc-a1
 * @covers dih0LPaigc-a2
 */
describe("Devised Conspiracy — exact Prepare payment, next attack only, and unused expiry", () => {
  for (const prepare of [false, true])
    for (const expired of [false, true])
      it(`prepared=${prepare}, wait until next turn=${expired}`, () => {
        const base = enableAllTestElements(lineageTestChampion("Tristan", 0)),
          champion = {
            ...base,
            layout: {
              kind: "single-faced" as const,
              face: { ...requireSingleFace(base), stats: { level: 0, life: 30, power: 1 } },
            },
          };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                devisedConspiracy,
                acceptedContract,
                plantedExplosive,
                rivetingWinds,
                ...Array.from({ length: 12 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [giantTortoise],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          foe = q.card(champion),
          pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        p.activate(acceptedContract, { reservePayment: pay(5) });
        passEffectsStack(game);
        p.activate(plantedExplosive, {
          reservePayment: pay(2),
          prepareAbilityIndexes: [0],
          targets: { "target-1": [q.card(giantTortoise).objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(2);
        p.activate(devisedConspiracy, {
          reservePayment: pay(1),
          ...(prepare ? { prepareAbilityIndexes: [0] as const } : {}),
        });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.counters.preparation ?? 0).toBe(prepare ? 0 : 2);
        if (expired) advanceToMain(game, p.id, game.state.turn.number);
        const deck = q.zone("main-deck"),
          first = expired ? 1 : 3,
          steals = prepare && !expired;
        p.declareAttack(hero, foe);
        game.resolveCombatWithoutRetaliation();
        passEffectsStack(game);
        expect(game.state.objects[foe.objectId]!.damage).toBe(first);
        expect(q.zone("main-deck")).toHaveLength(deck.length - (steals ? 1 : 0));
        p.activate(rivetingWinds, { reservePayment: pay(4) });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.states.has("rested")).toBe(false);
        p.declareAttack(hero, foe);
        game.resolveCombatWithoutRetaliation();
        passEffectsStack(game);
        expect(game.state.objects[foe.objectId]!.damage).toBe(first + 1);
        expect(q.zone("main-deck")).toHaveLength(deck.length - (steals ? 2 : 0));
      });
});
