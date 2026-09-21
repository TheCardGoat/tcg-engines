import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";

/**
 * Shared acceptance contract for a printed starting-champion "On Enter: Draw
 * seven cards" trigger: resolving pre-game puts the champion onto the field
 * and moves the seven-card opening deck into its controller's hand.
 */
export function proveStartingChampionDraw({
  card,
  amount = 7,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  amount?: number;
}): void {
  it(`draws ${amount} cards for its controller when the champion enters through pre-game`, () => {
    const openingDeck = Array.from({ length: amount }, () => woodlandSquirrels);
    const game = GrandArchiveTestEngine.startFixture({
      pregame: "resolve",
      playerOne: {
        champion: card,
        zones: { "main-deck": openingDeck },
      },
      playerTwo: {
        champion: card,
        zones: { "main-deck": openingDeck },
      },
    });
    const player = game.player("player-one");

    expect(game.state.status).toBe("playing");
    expect(player.cards(woodlandSquirrels, { zone: "hand" })).toHaveLength(amount);
    expect(player.zone("main-deck")).toHaveLength(0);
    expect(player.card(card, { zone: "field" }).definitionId).toBe(card.canonicalId);
  });
}
