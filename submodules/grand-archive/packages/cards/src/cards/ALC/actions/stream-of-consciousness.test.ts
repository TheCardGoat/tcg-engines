import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { streamOfConsciousness } from "./stream-of-consciousness.ts";

/** @covers wa4x7e22tk-a1 */
/** @covers wa4x7e22tk-a2 */
describe("Stream of Consciousness — restricted Glimpse then unconditional draw", () => {
  for (const classBonus of [false, true]) {
    for (const startingMemory of [1, 2]) {
      it(`Class Bonus=${classBonus}, memory after payment=${startingMemory + 2}`, () => {
        const champion = createClassBonusTestChampion(
          streamOfConsciousness,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [streamOfConsciousness, woodlandSquirrels, woodlandSquirrels],
              memory: Array.from({ length: startingMemory }, () => woodlandSquirrels),
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const deck = player.zone("main-deck");
        const payments = player.cards(woodlandSquirrels, { zone: "hand" });
        player.activate(streamOfConsciousness, {
          reservePayment: payments.map((card) => ({ kind: "card", cardId: card.objectId })),
        });
        expect(player.zone("memory")).toHaveLength(startingMemory + 2);
        passEffectsStack(game);

        const shouldGlimpse = classBonus && startingMemory + 2 >= 4;
        if (shouldGlimpse) {
          const glimpse = game.state.decision;
          if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected restricted Glimpse");
          expect(glimpse.playerId).toBe(player.id);
          expect(glimpse.cardIds).toEqual(deck.slice(0, 3).map((card) => card.objectId));
          answerDecision(game, "resolve-glimpse", {
            kind: "reorder",
            top: glimpse.cardIds,
            bottom: [],
          });
          passEffectsStack(game);
        } else {
          expect(game.state.decision).toBeNull();
        }

        expect(player.zone("memory")).toHaveLength(startingMemory + 3);
        expect(player.zone("main-deck")).toEqual(deck.slice(1));
        expect(player.cards(streamOfConsciousness, { zone: "graveyard" })).toHaveLength(1);
      });
    }
  }
});
