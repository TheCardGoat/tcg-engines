import { describe } from "vitest";
import { stabilizingCapacitance } from "./stabilizing-capacitance.ts";

import { proveClassLevelDrawBonus } from "../../../testing/class-level-draw-bonus.ts";
/** @covers c4sy8u49sk-a2 */
describe("stabilizingCapacitance class and level draw bonus", () => {
  proveClassLevelDrawBonus(stabilizingCapacitance, 7, "capacitance");
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { deepSeaFractal } from "../../FTC/phantasias/deep-sea-fractal.ts";

/** @covers c4sy8u49sk-a1 */
describe("Stabilizing Capacitance — ordered memory exchange", () => {
  for (const matching of [false, true])
    for (const reserve of ["card", "reservable"] as const)
      for (const initialMemory of [0, 2])
        for (const deckSize of [0, 1, 4]) {
          const availableCount = initialMemory + Number(reserve === "card");
          for (const count of new Set([0, Math.min(1, availableCount), availableCount]))
            it(`class=${matching}, reserve=${reserve}, memory=${initialMemory}, deck=${deckSize}, returned=${count}`, () => {
              const champion = enableAllTestElements(
                createClassBonusTestChampion(
                  stabilizingCapacitance,
                  matching,
                  "activation-discount",
                ),
              );
              const game = GrandArchiveTestEngine.startFixture({
                playerOne: {
                  champion,
                  zones: {
                    hand: [stabilizingCapacitance, woodlandSquirrels, fireball],
                    field: [deepSeaFractal],
                    memory: [potionOfHealing, favorableWinds].slice(0, initialMemory),
                    "main-deck": [
                      potionOfHealing,
                      fireball,
                      favorableWinds,
                      woodlandSquirrels,
                    ].slice(0, deckSize),
                  },
                },
                playerTwo: {
                  champion,
                  zones: { memory: [fireball], "main-deck": [woodlandSquirrels] },
                },
              });
              const p = game.player("player-one"),
                q = game.player("player-two"),
                source = p.card(stabilizingCapacitance);
              const deck = p.zone("main-deck"),
                enemyMemory = q.zone("memory"),
                enemyDeck = q.zone("main-deck");
              p.activate(source, {
                reservePayment:
                  reserve === "card"
                    ? [
                        {
                          kind: "card",
                          cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId,
                        },
                      ]
                    : [{ kind: "reservable", objectId: p.card(deepSeaFractal).objectId }],
              });
              const memory = p.zone("memory"),
                hand = p.zone("hand"),
                selected = [...memory].reverse().slice(0, count);
              expect(p.zone("main-deck")).toEqual(deck);
              passEffectsStack(game);
              if (memory.length) {
                expect(game.state.decision).toMatchObject({
                  kind: "resolve-effect-choice",
                  playerId: p.id,
                });
                expect(p.zone("memory")).toEqual(memory);
                expect(p.zone("main-deck")).toEqual(deck);
                for (const ids of [
                  [q.card(fireball, { zone: "memory" }).objectId],
                  [p.card(fireball, { zone: "hand" }).objectId],
                  [source.objectId],
                  [memory[0]!.objectId, memory[0]!.objectId],
                ]) {
                  const before = game.state;
                  expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                  expect(game.state).toEqual(before);
                }
                answerDecision(
                  game,
                  "resolve-effect-choice",
                  selected.map((c) => c.objectId),
                );
                passEffectsStack(game);
              }
              const combined = [...deck, ...selected],
                drawn = combined.slice(0, count);
              expect(p.zone("main-deck")).toEqual(combined.slice(count));
              expect(p.zone("memory")).toEqual([
                ...memory.filter((c) => !selected.includes(c)),
                ...drawn,
              ]);
              expect(p.zone("hand")).toEqual(hand);
              expect(q.zone("memory")).toEqual(enemyMemory);
              expect(q.zone("main-deck")).toEqual(enemyDeck);
              expect(game.state.objects[source.objectId]?.zone).toBe("graveyard");
              expect(game.state.decision).toBeNull();
              expect(game.state.winnerIds).toEqual([]);
            });
        }
});
