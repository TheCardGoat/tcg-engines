import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { airshipEngineer } from "./airship-engineer.ts";
import { firetunedAutomaton } from "./firetuned-automaton.ts";

/** @covers lzjmwuir99-a1 */
describe("Firetuned Automaton — mandatory Fire discard before activation", () => {
  for (const classBonus of [false, true]) {
    for (const fireAvailable of [false, true]) {
      it(`Class Bonus=${classBonus}, another Fire card in hand=${fireAvailable}`, () => {
        const champion = createClassBonusTestChampion(
          firetunedAutomaton,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                firetunedAutomaton,
                woodlandSquirrels,
                woodlandSquirrels,
                woodlandSquirrels,
                ...(fireAvailable ? [airshipEngineer, airshipEngineer] : []),
              ],
              memory: [airshipEngineer],
              field: [airshipEngineer],
            },
          },
          playerTwo: { champion, zones: { hand: [airshipEngineer] } },
        });
        const player = game.player("player-one");
        const source = player.card(firetunedAutomaton);
        const squirrels = player.cards(woodlandSquirrels);
        const reservePayment = squirrels
          .slice(0, 2)
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const fireCards = player.cards(airshipEngineer, { zone: "hand" });
        for (const selection of [
          [],
          [source.objectId],
          [squirrels[2]!.objectId],
          [player.card(airshipEngineer, { zone: "memory" }).objectId],
          [player.card(airshipEngineer, { zone: "field" }).objectId],
          [game.player("player-two").card(airshipEngineer).objectId],
          ...(fireAvailable ? [fireCards.map((ref) => ref.objectId)] : []),
        ]) {
          const before = game.state;
          expect(() =>
            player.activate(source, { reservePayment, costSelections: [selection] }),
          ).toThrow();
          expect(game.state).toEqual(before);
        }
        if (!fireAvailable) return;
        const discard = fireCards[1]!;
        // One card cannot pay both reserve and the additional discard.
        const before = game.state;
        expect(() =>
          player.activate(source, {
            reservePayment: [reservePayment[0]!, { kind: "card", cardId: discard.objectId }],
            costSelections: [[discard.objectId]],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        player.activate(source, { reservePayment, costSelections: [[discard.objectId]] });
        expect(player.zone("graveyard")).toEqual([discard]);
        expect(player.zone("memory")).toHaveLength(3);
        expect(player.cards(firetunedAutomaton, { zone: "field" })).toHaveLength(0);
        expect(game.state.stack).toHaveLength(1);
        expect(player.cards(airshipEngineer, { zone: "hand" })).toEqual([fireCards[0]]);
        passEffectsStack(game);
        expect(player.cards(firetunedAutomaton, { zone: "field" })).toEqual([source]);
        expect(player.zone("graveyard")).toEqual([discard]);
        expect(game.state.stack).toHaveLength(0);
      });
    }
  }
});

/** @covers lzjmwuir99-a2 */
describe("Firetuned Automaton — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: firetunedAutomaton });
});
