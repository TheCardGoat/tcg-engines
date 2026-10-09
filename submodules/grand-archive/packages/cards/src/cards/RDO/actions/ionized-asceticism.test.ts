import { describe } from "vitest";
import { ionizedAsceticism } from "./ionized-asceticism.ts";
import { proveNamedEfficiency } from "../../../testing/named-efficiency.ts";
/** @covers u2Peefob8w-a1 */
describe("Rai Bonus Efficiency", () => proveNamedEfficiency(ionizedAsceticism, "Rai", 15, false));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers u2Peefob8w-a2 */
describe("Ionized Asceticism — clears own hand and memory, draws seven, reduces level until next turn", () => {
  for (const named of [false, true])
    for (const level of [0, 9, 10, 11, 15])
      for (const memory of [0, 2])
        it(`Rai=${named}, level=${level}, old memory=${memory}`, () => {
          const champion = enableAllTestElements(
            grantTestChampionLevel(lineageTestChampion(named ? "Rai" : "Other", 0), level),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              preserveMainDeckOrder: true,
              zones: {
                hand: [ionizedAsceticism, ...Array.from({ length: 18 }, () => woodlandSquirrels)],
                memory: Array.from({ length: memory }, () => woodlandSquirrels),
                "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
                field: [woodlandSquirrels],
                graveyard: [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: [woodlandSquirrels],
                memory: [woodlandSquirrels],
                field: [woodlandSquirrels],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            foe = q.card(champion),
            old = p
              .cards(woodlandSquirrels)
              .filter((c) => ["hand", "memory"].includes(game.state.objects[c.objectId]!.zone)),
            deck = p.zone("main-deck"),
            otherHand = q.zone("hand"),
            otherMemory = q.zone("memory");
          const lv = (id: typeof hero.objectId) =>
            deriveGrandArchiveNumericProperty(game.state.objects[id]!, "level", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          const cost = named ? Math.max(0, 15 - level) : 15;
          p.activate(ionizedAsceticism, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, cost)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          expect(lv(hero.objectId)).toBe(level);
          expect(p.zone("banishment")).toHaveLength(0);
          expect(p.zone("main-deck")).toEqual(deck);
          passEffectsStack(game);
          for (const card of old)
            expect(game.state.objects[card.objectId]!.zone).toBe("banishment");
          expect(p.zone("banishment")).toHaveLength(18 + memory);
          expect(p.zone("memory")).toHaveLength(0);
          expect(p.zone("hand").map((c) => c.objectId)).toEqual(
            deck.slice(0, 7).map((c) => c.objectId),
          );
          expect(p.zone("main-deck")).toHaveLength(1);
          expect(p.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
          expect(p.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
          expect(game.state.objects[p.card(ionizedAsceticism).objectId]!.zone).toBe("graveyard");
          expect(q.zone("hand")).toEqual(otherHand);
          expect(q.zone("memory")).toEqual(otherMemory);
          expect(lv(foe.objectId)).toBe(level);
          expect(lv(hero.objectId)).toBe(level - 10);
          advanceToMain(game, q.id);
          expect(lv(hero.objectId)).toBe(level - 10);
          for (let i = 0; i < 64 && game.state.turn.playerId !== p.id; i++) {
            const w = game.waitState();
            if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
            game.player(w.playerId).pass();
          }
          expect(game.state.turn.playerId).toBe(p.id);
          expect(lv(hero.objectId)).toBe(level);
          expect(lv(foe.objectId)).toBe(level);
        });
});
