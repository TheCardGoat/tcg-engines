/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { letItGo } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { galeWindSpirit } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Gale - Wind Spirit", () => {
  describe("**RECURRING GUST** When this character is banished, return this card to your hand.", () => {
    it("Does not trigger on spell removal", () => {
      const testStore = new TestStore({
        inkwell: dragonFire.cost,
        hand: [dragonFire],
        play: [galeWindSpirit],
      });

      const cardUnderTest = testStore.getCard(galeWindSpirit);
      const banisher = testStore.getCard(dragonFire);

      banisher.playFromHand();
      testStore.resolveTopOfStack({ targets: [cardUnderTest] });

      expect(cardUnderTest.zone).toEqual("hand");
    });

    it("Does not trigger on inkwell removal", () => {
      const testStore = new TestStore({
        inkwell: dragonFire.cost,
        hand: [letItGo],
        play: [galeWindSpirit],
      });

      const cardUnderTest = testStore.getCard(galeWindSpirit);
      const banisher = testStore.getCard(letItGo);

      banisher.playFromHand();
      testStore.resolveTopOfStack({ targets: [cardUnderTest] });

      expect(cardUnderTest.zone).toEqual("inkwell");
    });

    it("Does triggers on removal", () => {
      const testStore = new TestStore(
        {
          play: [goofyKnightForADay],
        },
        {
          play: [galeWindSpirit],
        },
      );

      const cardUnderTest = testStore.getCard(galeWindSpirit);
      cardUnderTest.updateCardMeta({ exerted: true });
      const banisher = testStore.getCard(goofyKnightForADay);

      banisher.challenge(cardUnderTest);

      expect(cardUnderTest.zone).toEqual("hand");
    });
  });
});
