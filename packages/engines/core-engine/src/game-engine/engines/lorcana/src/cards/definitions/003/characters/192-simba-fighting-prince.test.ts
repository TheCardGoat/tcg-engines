/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  liloGalacticHero,
  liloMakingAWish,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { simbaFightingPrince } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Simba - Fighting Prince", () => {
  describe("**SUBMIT OR FIGHT** When you play this character and whenever this character banishes another character in a challenge during your turn, choose one:· You may draw 2 cards, then choose and discard 2 cards.· You may deal 2 damage to chosen character.", () => {
    it("On play", () => {
      const testStore = new TestStore({
        inkwell: simbaFightingPrince.cost,
        hand: [simbaFightingPrince, liloMakingAWish, liloGalacticHero],
        deck: 2,
      });

      const cardUnderTest = testStore.getCard(simbaFightingPrince);
      const discardCard = testStore.getCard(liloGalacticHero);
      const discardAnotherCard = testStore.getCard(liloMakingAWish);

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ mode: "1" }, true);
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({
        targets: [discardCard, discardAnotherCard],
      });

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({ hand: 2, deck: 0, play: 1, discard: 2 }),
      );
    });
  });
});
