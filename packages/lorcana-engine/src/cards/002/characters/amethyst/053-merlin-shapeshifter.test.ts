/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  goofyKnightForADay,
  madamMimFox,
  madamMimSnake,
  merlinShapeshifter,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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

    it("accumulates previous effects", () => {
      const testStore = new TestStore(
        {
          inkwell: madamMimFox.cost + madamMimSnake.cost + madamMimFox.cost,
          hand: [madamMimFox],
          play: [merlinShapeshifter, madamMimSnake],
        },
        { deck: 1 },
      );

      const snake = testStore.getByZoneAndId("play", madamMimSnake.id);
      const fox = testStore.getByZoneAndId("hand", madamMimFox.id);
      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        merlinShapeshifter.id,
      );

      fox.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [snake] }, true);

      expect(snake.zone).toEqual("hand");
      expect(cardUnderTest.lore).toEqual(merlinShapeshifter.lore + 1);

      snake.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [fox] }, true);

      expect(fox.zone).toEqual("hand");
      expect(cardUnderTest.lore).toEqual(merlinShapeshifter.lore + 2);

      fox.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [snake] });

      expect(snake.zone).toEqual("hand");
      expect(cardUnderTest.lore).toEqual(merlinShapeshifter.lore + 3);
    });
  });
});
