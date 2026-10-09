import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { lineageTestChampion } from "./champion-lineage.ts";
import { grantTestChampionLevel } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";

/** A real source champion grants same-base-level permission; blank successors isolate its draw. */
export function proveSameLevelChampion(
  card: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">,
  lineage: string,
) {
  for (const destinationLevel of [2, 3, 4, 5])
    for (const extraLevel of [0, 2])
      for (const active of [false, true])
        for (const deckSize of [0, 1, 2, 4]) {
          it(`destination=${destinationLevel}, extra level=${extraLevel}, active=${active}, deck=${deckSize}`, () => {
            const starter = lineageTestChampion(lineage, 0);
            const source = extraLevel ? grantTestChampionLevel(card, extraLevel) : card;
            const destination = lineageTestChampion("Successor", destinationLevel);
            const game = GrandArchiveTestEngine.startFixture({
              phase: "materialize",
              playerOne: {
                champion: starter,
                lineage: [source, ...(active ? [] : [lineageTestChampion(lineage, 3)])],
                zones: {
                  "material-deck": [destination],
                  memory: Array.from({ length: destinationLevel }, () => woodlandSquirrels),
                  "main-deck": Array.from({ length: deckSize }, () => woodlandSquirrels),
                },
              },
              playerTwo: {
                champion: lineageTestChampion("Opponent", 0),
                zones: { "main-deck": [woodlandSquirrels] },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const hero = p.card(starter),
              deck = p.zone("main-deck"),
              memory = p.zone("memory"),
              opposingDeck = q.zone("main-deck");
            const legal = destinationLevel === 4 || (active && destinationLevel === 3);
            if (!legal) {
              const before = game.state;
              expect(() => p.materialize(destination)).toThrow();
              expect(game.state).toEqual(before);
              return;
            }
            p.materialize(destination);
            expect(p.zone("main-deck")).toEqual(deck);
            expect(p.zone("hand")).toHaveLength(0);
            expect(p.zone("memory")).toHaveLength(0);
            for (const cost of memory)
              expect(game.state.objects[cost.objectId]!.zone).toBe("banishment");
            p.pass();
            q.pass();
            expect(game.state.objects[hero.objectId]!.activeDefinitionId).toBe(
              destination.canonicalId,
            );
            const draws = active && destinationLevel === 3;
            expect(
              game.state.stack.filter((item) => item.kind === "triggered-ability"),
            ).toHaveLength(draws ? 1 : 0);
            expect(p.zone("main-deck")).toEqual(deck);
            passEffectsStack(game);
            for (let i = 0; i < deck.length; i++)
              expect(game.state.objects[deck[i]!.objectId]!.zone).toBe(
                draws && i < 2 ? "hand" : "main-deck",
              );
            expect(q.zone("main-deck")).toEqual(opposingDeck);
            expect(game.state.winnerIds).toEqual(draws && deckSize < 2 ? [q.id] : []);
            expect(game.state.decision).toBeNull();
          });
        }
}
