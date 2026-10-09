import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";

export function proveBanishDraw(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  abilityId: string,
  memory: boolean,
) {
  const amount = memory ? 3 : 1;
  for (const ownTurn of [false, true])
    for (const matching of [false, true]) {
      for (const sizes of memory
        ? [
            [0, 4],
            [1, 4],
            [2, 4],
            [3, 4],
            [5, 4],
          ]
        : [
            [0, 0],
            [0, 2],
            [2, 0],
            [1, 1],
            [3, 3],
          ]) {
        const [size, otherSize] = sizes;
        it(`draws with decks=${sizes}, class=${matching}, own turn=${ownTurn}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: ownTurn ? "playerOne" : "playerTwo",
            playerOne: {
              champion,
              zones: {
                field: [card],
                hand: [woodlandSquirrels],
                memory: [woodlandSquirrels],
                "main-deck": Array.from({ length: size! }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [card],
                hand: [woodlandSquirrels],
                memory: [woodlandSquirrels],
                "main-deck": Array.from({ length: otherSize! }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card);
          const deck = p.zone("main-deck"),
            otherDeck = q.zone("main-deck"),
            hand = p.zone("hand"),
            otherHand = q.zone("hand"),
            mem = p.zone("memory"),
            otherMem = q.zone("memory");
          if (!ownTurn) q.pass();
          p.activateAbility(source, abilityId);
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
          expect(p.zone("hand")).toEqual(hand);
          expect(p.zone("memory")).toEqual(mem);
          expect(q.zone("hand")).toEqual(otherHand);
          expect(p.zone("main-deck")).toEqual(deck);
          expect(q.zone("main-deck")).toEqual(otherDeck);
          const before = game.state;
          expect(() => p.activateAbility(source, abilityId)).toThrow();
          expect(game.state).toEqual(before);
          passEffectsStack(game);
          const loseP = size! < amount,
            loseQ = !memory && otherSize === 0;
          if (loseP || loseQ) {
            expect(game.state.status).toBe("finished");
            expect(game.state.winnerIds).toEqual(loseP && loseQ ? [] : [loseP ? q.id : p.id]);
            for (const player of [p, q]) {
              expect(
                game.state.eventHistory.some(
                  (e) =>
                    e.type === "player-lost" && e.playerId === player.id && e.reason === "deck-out",
                ),
              ).toBe(player.id === p.id ? loseP : loseQ);
            }
          } else {
            expect(game.state.status).not.toBe("finished");
            expect(p.zone("main-deck")).toEqual(deck.slice(amount));
            expect(p.zone("hand")).toEqual(memory ? hand : [...hand, ...deck.slice(0, 1)]);
            expect(p.zone("memory")).toEqual(memory ? [...mem, ...deck.slice(0, 3)] : mem);
            expect(q.zone("main-deck")).toEqual(memory ? otherDeck : otherDeck.slice(1));
            expect(q.zone("hand")).toEqual(
              memory ? otherHand : [...otherHand, ...otherDeck.slice(0, 1)],
            );
            expect(q.zone("memory")).toEqual(otherMem);
            expect(q.cards(card, { zone: "field" })).toHaveLength(1);
          }
        });
      }
    }
}
