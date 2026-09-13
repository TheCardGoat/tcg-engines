import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { oasisTradingPost } from "../domains/oasis-trading-post.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { proveFloatingMemory } from "../../../testing/floating-memory.ts";
import { navigateTheStreets } from "./navigate-the-streets.ts";

/** @covers 8jypwc8tuh-a2 */
describe("Navigate the Streets — Floating Memory", () => {
  proveFloatingMemory(navigateTheStreets);
});

/** @covers 8jypwc8tuh-a1 */
describe("Navigate the Streets — Glimpse one plus controlled domains", () => {
  for (const domains of [0, 1, 2]) {
    for (const deckSize of [2, 5]) {
      it(`glimpses with ${domains} domains and ${deckSize} deck cards`, () => {
        const champion = createClassBonusTestChampion(
          navigateTheStreets,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [
                woodlandSquirrels,
                ...Array.from({ length: domains }, () => oasisTradingPost),
              ],
              hand: [navigateTheStreets, woodlandSquirrels],
              "main-deck": Array.from({ length: deckSize }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion, zones: { field: [oasisTradingPost, oasisTradingPost] } },
        });
        const player = game.player("player-one");
        const deck = player.zone("main-deck");
        player.activate(navigateTheStreets, {
          reservePayment: [
            { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
          ],
        });
        expect(game.state.decision).toBeNull();
        expect(player.zone("main-deck")).toEqual(deck);
        passEffectsStack(game);
        const glimpse = game.state.decision;
        if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
        const count = Math.min(1 + domains, deckSize);
        const looked = deck.slice(0, count);
        expect(glimpse.playerId).toBe(player.id);
        expect(glimpse.cardIds).toEqual(looked.map((ref) => ref.objectId));
        const bottom = looked.slice(0, 1);
        const top = looked.slice(1).reverse();
        answerDecision(game, "resolve-glimpse", {
          kind: "reorder",
          top: top.map((ref) => ref.objectId),
          bottom: bottom.map((ref) => ref.objectId),
        });
        expect(player.zone("main-deck")).toEqual([...top, ...deck.slice(count), ...bottom]);
        expect(player.zone("hand")).toHaveLength(0);
        expect(player.cards(navigateTheStreets, { zone: "graveyard" })).toHaveLength(1);
      });
    }
  }
});
