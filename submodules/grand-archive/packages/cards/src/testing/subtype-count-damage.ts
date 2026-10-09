import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import { imperialCountermeasure } from "../cards/RDO/actions/imperial-countermeasure.ts";
type Card = GrandArchiveCard<GrandArchiveAbilityDefinition, "card">;

export function proveSubtypeCountDamage(
  source: Card,
  cost: number,
  sample: Card,
  fields: readonly { label: string; cards: readonly Card[] }[],
  formula: "fractals-plus-one" | "level-plus-two-elysians",
) {
  for (const matching of [false, true])
    for (const level of [0, 3])
      for (const support of fields)
        for (const targetKind of [
          "own-champion",
          "own-ally",
          "opposing-champion",
          "opposing-ally",
        ] as const)
          for (const prevented of [false, true])
            it(`class=${matching}, level=${level}, supports=${support.label}, target=${targetKind}, prevention=${prevented}`, () => {
              const champion = enableAllTestElements(
                grantTestChampionLevel(
                  createClassBonusTestChampion(source, matching, "activation-discount"),
                  level,
                ),
              );
              const game = GrandArchiveTestEngine.startFixture({
                playerOne: {
                  champion,
                  zones: {
                    hand: [
                      source,
                      sample,
                      imperialCountermeasure,
                      ...Array.from({ length: 8 }, () => woodlandSquirrels),
                    ],
                    field: [giantTortoise, trainingSword, ...support.cards],
                    memory: [sample],
                    graveyard: [sample],
                    banishment: [sample],
                    "main-deck": [woodlandSquirrels],
                  },
                },
                playerTwo: { champion, zones: { field: [giantTortoise, sample, sample, sample] } },
              });
              const p = game.player("player-one"),
                q = game.player("player-two");
              const sourceRef = p.card(source, { zone: "hand" });
              const owner = targetKind.startsWith("own") ? p : q;
              const target = owner.card(targetKind.endsWith("champion") ? champion : giantTortoise);
              const pay = (n: number) =>
                p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, n)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
              if (prevented) {
                p.activate(imperialCountermeasure, {
                  reservePayment: pay(1),
                  targets: { "target-1": [target.objectId] },
                });
                passEffectsStack(game);
              }
              const before = game.state;
              for (const targets of [
                [],
                [target.objectId, target.objectId],
                [p.card(trainingSword).objectId],
                [p.card(sample, { zone: "hand" }).objectId],
                [sourceRef.objectId],
              ]) {
                expect(() =>
                  p.activate(sourceRef, {
                    reservePayment: pay(cost),
                    targets: { "target-1": targets },
                  }),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              for (const wrong of [cost - 1, cost + 1]) {
                expect(() =>
                  p.activate(sourceRef, {
                    reservePayment: pay(wrong),
                    targets: { "target-1": [target.objectId] },
                  }),
                ).toThrow();
                expect(game.state).toEqual(before);
              }
              p.activate(sourceRef, {
                reservePayment: pay(cost),
                targets: { "target-1": [target.objectId] },
              });
              expect(game.state.objects[target.objectId]?.damage).toBe(0);
              passEffectsStack(game);
              const printed =
                formula === "fractals-plus-one"
                  ? support.cards.length + 1
                  : level + 2 * support.cards.length;
              const damage = Math.max(0, printed - (prevented ? 4 : 0));
              const events = game.state.eventHistory.filter(
                (e) => e.type === "damage-marked" && e.sourceId === sourceRef.objectId,
              );
              expect(events).toHaveLength(damage ? 1 : 0);
              for (const event of events)
                if (event.type === "damage-marked") {
                  expect(event.amount).toBe(damage);
                  expect(event.objectId).toBe(target.objectId);
                }
              expect(p.card(source, { zone: "graveyard" })).toEqual(sourceRef);
              expect(p.zone("memory")).toHaveLength(1 + cost + (prevented ? 2 : 0));
              expect(game.state.decision).toBeNull();
              expect(game.state.stack).toHaveLength(0);
              expect(game.state.winnerIds).toEqual([]);
            });
}
