/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dragonFire } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { letItGo } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { galeWindSpirit } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
