/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  goofyKnightForADay,
  madamMimFox,
  madamMimSnake,
  merlinShapeshifter,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Merlin - Shapeshifter", () => {
  describe("**BATTLE OF WITS** Whenever one of your other characters is returned to your hand from play, this character gets +1 {L} this turn.", () => {
    it("Effect only active until end of turn", () => {
      const testStore = new TestStore(
        {
          inkwell: madamMimFox.cost,
          hand: [madamMimFox],
          play: [merlinShapeshifter, goofyKnightForADay],
        },
        { deck: 1 },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        merlinShapeshifter.id,
      );
      const otherCard = testStore.getByZoneAndId("play", goofyKnightForADay.id);
      const bounce = testStore.getByZoneAndId("hand", madamMimFox.id);

      expect(cardUnderTest.lore).toEqual(merlinShapeshifter.lore);

      bounce.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [otherCard] });

      expect(otherCard.zone).toEqual("hand");
      expect(cardUnderTest.lore).toEqual(merlinShapeshifter.lore + 1);

      testStore.passTurn();

      expect(cardUnderTest.lore).toEqual(merlinShapeshifter.lore);
    });

    it("accumulates previous effects", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: madamMimFox.cost + madamMimSnake.cost + madamMimFox.cost,
          hand: [madamMimFox],
          play: [merlinShapeshifter, madamMimSnake],
        },
        { deck: 1 },
      );

      await testEngine.playCard(madamMimFox);
      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({ targets: [madamMimSnake] }, true);

      expect(testEngine.getCardModel(madamMimSnake).zone).toEqual("hand");

      // expect(testEngine.getCardModel(merlinShapeshifter).lore).toEqual(
      //   merlinShapeshifter.lore,
      // );
      // await testEngine.resolveOptionalAbility();
      expect(testEngine.getCardModel(merlinShapeshifter).lore).toEqual(
        merlinShapeshifter.lore + 1,
      );

      await testEngine.playCard(madamMimSnake);
      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({ targets: [madamMimFox] }, true);

      expect(testEngine.getCardModel(madamMimFox).zone).toEqual("hand");
      // await testEngine.resolveOptionalAbility();
      expect(testEngine.getCardModel(merlinShapeshifter).lore).toEqual(
        merlinShapeshifter.lore + 2,
      );

      await testEngine.playCard(madamMimFox);
      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({ targets: [madamMimSnake] }, true);

      expect(testEngine.getCardModel(madamMimSnake).zone).toEqual("hand");
      // await testEngine.resolveOptionalAbility();
      expect(testEngine.getCardModel(merlinShapeshifter).lore).toEqual(
        merlinShapeshifter.lore + 3,
      );
    });
  });
});
