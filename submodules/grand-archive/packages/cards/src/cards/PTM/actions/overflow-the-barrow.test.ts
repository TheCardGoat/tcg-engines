import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { overflowTheBarrow } from "./overflow-the-barrow.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers OiyjVzW7Av-a1 */
describe("Overflow the Barrow — own empty graveyard discount", () => {
  for (const matching of [false, true])
    for (const graveyard of [0, 1, 2])
      for (const opposing of [0, 2])
        it(`class=${matching}, own graveyard=${graveyard}, opposing graveyard=${opposing}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(overflowTheBarrow, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [overflowTheBarrow, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
                memory: [woodlandSquirrels],
                field: [woodlandSquirrels],
                banishment: [woodlandSquirrels],
                graveyard: Array.from({ length: graveyard }, () => woodlandSquirrels),
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: {
              champion,
              zones: { graveyard: Array.from({ length: opposing }, () => woodlandSquirrels) },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(overflowTheBarrow),
            cost = graveyard === 0 ? 1 : 3;
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state,
            deck = p.zone("main-deck"),
            opponentGrave = q.zone("graveyard");
          expect(() => p.activate(source, { reservePayment: pay(cost - 1) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(source, { reservePayment: pay(cost) });
          expect(p.zone("memory")).toHaveLength(1 + cost);
          expect(p.zone("graveyard")).toHaveLength(graveyard);
          passEffectsStack(game);
          expect(p.zone("graveyard")).toHaveLength(graveyard + 1);
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(p.zone("main-deck")).toEqual(deck);
          expect(q.zone("graveyard")).toEqual(opponentGrave);
        });
});

import { aliceDistortedQueen } from "../champions/alice-distorted-queen.ts";
import { phantasmagoria } from "../masteries/phantasmagoria.ts";
import { remnantOfWill } from "./remnant-of-will.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain } from "../../../testing/decisions.ts";

/** @covers OiyjVzW7Av-a2 */
describe("Overflow the Barrow — haunt is increased before mill", () => {
  for (const mastery of [false, true])
    for (const extraHaunt of [false, true])
      for (const deckSize of [3, 6, 12])
        it(`mastery=${mastery}, prior Remnant=${extraHaunt}, deck=${deckSize}`, () => {
          const starter = enableAllTestElements(lineageTestChampion("Alice", 0)),
            alice = enableAllTestElements(aliceDistortedQueen);
          const game = GrandArchiveTestEngine.startFixture({
            definitions: [phantasmagoria],
            phase: "materialize",
            playerOne: {
              champion: starter,
              zones: {
                "material-deck": mastery ? [alice] : [],
                memory: [woodlandSquirrels],
                hand: [
                  overflowTheBarrow,
                  overflowTheBarrow,
                  ...(extraHaunt ? [remnantOfWill] : []),
                  ...Array.from({ length: 8 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: deckSize }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion: starter,
              zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          if (mastery) {
            p.materialize(alice);
            passEffectsStack(game);
          } else p.execute({ move: "skip-materialization" });
          advanceToMain(game, p.id);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (extraHaunt) {
            p.activate(remnantOfWill, { reservePayment: pay(1) });
            passEffectsStack(game);
          }
          let haunt = mastery ? (extraHaunt ? 4 : 2) : 0;
          expect(game.state.players[p.id]!.mastery?.counters["named:haunt"] ?? 0).toBe(haunt);
          const otherDeck = q.zone("main-deck");
          for (const source of p.cards(overflowTheBarrow, { zone: "hand" })) {
            const beforeDeck = p.zone("main-deck"),
              beforeGrave = p.zone("graveyard"),
              cost = beforeGrave.length === 0 ? 1 : 3;
            p.activate(source, { reservePayment: pay(cost) });
            expect(game.state.players[p.id]!.mastery?.counters["named:haunt"] ?? 0).toBe(haunt);
            expect(p.zone("main-deck")).toEqual(beforeDeck);
            passEffectsStack(game);
            if (mastery) haunt++;
            expect(game.state.players[p.id]!.mastery?.counters["named:haunt"] ?? 0).toBe(haunt);
            const count = Math.min(beforeDeck.length, haunt);
            expect(p.zone("main-deck")).toEqual(beforeDeck.slice(count));
            expect(p.zone("graveyard")).toHaveLength(beforeGrave.length + count + 1);
            for (const ref of beforeDeck.slice(0, count))
              expect(p.zone("graveyard")).toContainEqual(ref);
            expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
            expect(game.state.objects[p.card(starter).objectId]!.counters["named:haunt"] ?? 0).toBe(
              0,
            );
            expect(game.state.players[q.id]!.mastery).toBeUndefined();
            expect(q.zone("main-deck")).toEqual(otherDeck);
          }
        });
});
