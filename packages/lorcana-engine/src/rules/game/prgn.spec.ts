/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import {
  arthurKingVictorious,
  basilPracticedDetective,
  fixitFelixJrTrustyBuilder,
  kronkUnlicensedInvestigator,
  mickeyMouseFoodFightDefender,
  moanaDeterminedExplorer,
  mufasaRulerOfPrideRock,
  princeNaveenUkulelePlayer,
  sirEctorCastleLord,
  tukeNorthernMoose,
  whiteRabbitRoyalHerald,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Pseudorandom number generator", () => {
  it.skip("Shuffle should always yield same result", () => {
    let previousShuffle: string[] = [];
    const initialDeck = [
      mufasaRulerOfPrideRock,
      mickeyMouseFoodFightDefender,
      basilPracticedDetective,
      kronkUnlicensedInvestigator,
      sirEctorCastleLord,
      arthurKingVictorious,
      princeNaveenUkulelePlayer,
      tukeNorthernMoose,
      fixitFelixJrTrustyBuilder,
      moanaDeterminedExplorer,
      whiteRabbitRoyalHerald,
    ];
    for (let i = 0; i < 10; i++) {
      console.log(previousShuffle);
      const testStore = new TestStore({
        deck: [...initialDeck],
      });

      testStore.store.tableStore.shuffleDeck("player_one");

      const table = testStore.store.tableStore.getTable("player_one");

      if (!table) {
        throw new Error("Table not found");
      }

      const cards = table.zones.deck.cards.map((card) => card.lorcanitoCard.id);
      if (previousShuffle.length) {
        expect(cards).toEqual(previousShuffle);
      }

      previousShuffle = cards;
    }
  });
});
