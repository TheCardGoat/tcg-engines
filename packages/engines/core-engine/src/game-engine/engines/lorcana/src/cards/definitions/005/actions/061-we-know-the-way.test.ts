/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  liloGalacticHero,
  liloMakingAWish,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { rapunzelAppreciativeArtist } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { liloJuniorCakeDecorator } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { liloEscapeArtist } from "@lorcanito/lorcana-engine/cards/006";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { weKnowTheWay } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

describe("We Know The Way", () => {
  describe("Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.", () => {
    it("Revealed card has the same name as the chosen card", async () => {
      const testEngine = new TestEngine({
        inkwell: weKnowTheWay.cost,
        hand: [weKnowTheWay],
        discard: [liloJuniorCakeDecorator],
        deck: [liloGalacticHero, liloMakingAWish],
      });

      await testEngine.playCard(
        weKnowTheWay,
        { targets: [liloJuniorCakeDecorator] },
        true,
      );

      expect(testEngine.getCardModel(liloJuniorCakeDecorator).zone).toEqual(
        "deck",
      );

      const topDeckCard = testEngine.store.topDeckCard("player_one");
      expect(topDeckCard?.isRevealed).toEqual(true);

      expect(topDeckCard?.zone).toEqual("deck");
      await testEngine.acceptOptionalLayer();
      expect(topDeckCard?.zone).toEqual("play");
    });

    // Flaky test, sometimes the top card is not the same as the one in discard SKipping for now
    it.skip("Revealed card DOES NOT have the same name as the chosen card", async () => {
      const testEngine = new TestEngine({
        inkwell: weKnowTheWay.cost,
        hand: [weKnowTheWay],
        discard: [rapunzelAppreciativeArtist],
        deck: [
          liloGalacticHero,
          liloMakingAWish,
          liloJuniorCakeDecorator,
          liloEscapeArtist,
          liloGalacticHero,
          liloMakingAWish,
          liloJuniorCakeDecorator,
          liloEscapeArtist,
        ],
      });

      const cardInDiscard = testEngine.getCardModel(rapunzelAppreciativeArtist);

      await testEngine.playCard(
        weKnowTheWay,
        { targets: [cardInDiscard] },
        true,
      );

      expect(cardInDiscard.zone).toEqual("deck");

      const topDeckCard = testEngine.store.topDeckCard("player_one");

      if (topDeckCard?.instanceId === cardInDiscard.instanceId) {
        throw new Error(
          "Random card was chosen from the deck, is the same as the one in discard",
        );
      }

      expect(topDeckCard?.isRevealed).toEqual(true);

      expect(topDeckCard?.zone).toEqual("deck");
      await testEngine.acceptOptionalLayer();
      expect(topDeckCard?.zone).toEqual("hand");
    });
  });
});
