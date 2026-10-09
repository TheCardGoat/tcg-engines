import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { developMana } from "../cards/FTC/actions/develop-mana.ts";
import { elucidatePlans } from "../cards/RDO/actions/elucidate-plans.ts";

export function proveCounterRemovalDraw(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  counter: "level" | "preparation",
) {
  for (const matching of [false, true])
    for (const own of [false, true])
      for (const initial of [0, 2])
        for (const stacked of initial ? [false, true] : [false]) {
          it(`removes ${counter} only from target; class=${matching}, own=${own}, initial=${initial}, stacked=${stacked}`, () => {
            const champion = enableAllTestElements(
              grantTestChampionLevel(
                createClassBonusTestChampion(card, matching, "activation-discount"),
                3,
              ),
            );
            const setup = {
              champion,
              zones: {
                field: [woodlandSquirrels],
                hand: [
                  card,
                  card,
                  card,
                  developMana,
                  developMana,
                  elucidatePlans,
                  ...Array.from({ length: 12 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
              },
            };
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: own ? "playerOne" : "playerTwo",
              playerOne: setup,
              playerTwo: setup,
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              owner = own ? p : q;
            const target = owner.card(champion),
              other = (own ? q : p).card(champion);
            const pay = (player: typeof p, amount: number) =>
              player
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, amount)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            // Always seed the other counter type too, so it cannot satisfy this draw condition.
            for (const boost of [
              counter !== "level" || initial ? developMana : undefined,
              counter !== "level" || initial ? developMana : undefined,
              counter !== "preparation" || initial ? elucidatePlans : undefined,
            ]) {
              if (!boost) continue;
              owner.activate(owner.cards(boost, { zone: "hand" })[0]!, {
                reservePayment: pay(owner, boost === developMana ? 3 : 2),
              });
              passEffectsStack(game);
            }
            expect(game.state.objects[target.objectId]!.counters[counter] ?? 0).toBe(initial);
            const unrelatedCounter = counter === "level" ? "preparation" : "level";
            expect(game.state.objects[target.objectId]!.counters[unrelatedCounter]).toBe(2);
            if (!own) q.pass();
            const effects = p.cards(card, { zone: "hand" }),
              deck = p.zone("main-deck"),
              otherDeck = q.zone("main-deck"),
              otherCounters = game.state.objects[other.objectId]!.counters;
            const initialHand = p.zone("hand");
            for (const ids of [
              [],
              [p.card(woodlandSquirrels, { zone: "field" }).objectId],
              [effects[0]!.objectId],
              [target.objectId, target.objectId],
            ]) {
              const before = game.state;
              expect(() =>
                p.activate(effects[0]!, {
                  targets: { "target-1": ids },
                  reservePayment: pay(p, 1),
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            for (let index = 0; index < 3; index++) {
              if (!own && index > 0 && !stacked) q.pass();
              const beforeCounters = game.state.objects[target.objectId]!.counters[counter] ?? 0;
              p.activate(effects[index]!, {
                targets: { "target-1": [target.objectId] },
                reservePayment: pay(p, 1),
              });
              expect(game.state.objects[target.objectId]!.counters[counter] ?? 0).toBe(
                beforeCounters,
              );
              if (!stacked) {
                passEffectsStack(game);
                const removed = Math.min(initial, index + 1);
                expect(game.state.objects[target.objectId]!.counters[counter] ?? 0).toBe(
                  initial - removed,
                );
                expect(p.zone("main-deck")).toEqual(deck.slice(removed));
              }
            }
            passEffectsStack(game);
            expect(game.state.objects[target.objectId]!.counters[counter] ?? 0).toBe(0);
            expect(game.state.objects[target.objectId]!.counters[unrelatedCounter]).toBe(2);
            expect(p.zone("main-deck")).toEqual(deck.slice(initial));
            expect(p.zone("hand")).toHaveLength(initialHand.length - 6 + initial);
            expect(p.zone("hand").slice(-initial || p.zone("hand").length)).toEqual(
              deck.slice(0, initial),
            );
            expect(q.zone("main-deck")).toEqual(otherDeck);
            expect(game.state.objects[other.objectId]!.counters).toEqual(otherCounters);
            expect(
              deriveGrandArchiveNumericProperty(game.state.objects[target.objectId]!, "level", {
                program: game.program,
                state: game.state,
                controllerId: owner.id,
                bindings: {},
              }),
            ).toBe(counter === "level" ? 3 : 5);
          });
        }
}
