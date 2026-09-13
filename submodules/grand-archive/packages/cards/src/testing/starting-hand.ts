import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "./champion-lineage.ts";

export function proveStartingHand(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>): void {
  for (const deckSize of [7, 9]) {
    it(`draws exactly seven of ${deckSize} cards through the starting champion's entry`, () => {
      const game = GrandArchiveTestEngine.startFixture({
        pregame: "resolve",
        playerOne: {
          champion: card,
          zones: { "main-deck": Array.from({ length: deckSize }, () => woodlandSquirrels) },
        },
        playerTwo: {
          champion: lineageTestChampion("Opponent", 0),
          zones: { "main-deck": [woodlandSquirrels] },
        },
      });
      const player = game.player("player-one");
      expect(player.zone("hand")).toHaveLength(7);
      expect(player.zone("main-deck")).toHaveLength(deckSize - 7);
      expect(game.player("player-two").zone("hand")).toHaveLength(0);
      expect(player.cards(card, { zone: "field" })).toHaveLength(1);
      expect(game.state.stack).toHaveLength(0);
    });
  }
}
