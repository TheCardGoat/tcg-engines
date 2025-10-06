/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import {
  madamMimSnake,
  pinocchioStarAttraction,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import { magicBroomIlluminaryKeeper } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Madam Mim - Snake", () => {
  describe("**JUST YOU WAIT** When you play this character, banish her or return another chosen character of yours to your hand.", () => {
    it("skipping the effect banishes her", () => {
      const testStore = new TestStore({
        inkwell: madamMimSnake.cost,
        hand: [madamMimSnake],
        play: [pinocchioStarAttraction],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", madamMimSnake.id);
      const target = testStore.getByZoneAndId(
        "play",
        pinocchioStarAttraction.id,
      );

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ skip: true });

      expect(target.zone).toEqual("play");
      expect(cardUnderTest.zone).toEqual("discard");
      expect(testStore.stackLayers).toHaveLength(0);
    });

    it("return another chosen character of yours to your hand.", () => {
      const testStore = new TestStore({
        inkwell: madamMimSnake.cost,
        hand: [madamMimSnake],
        play: [pinocchioStarAttraction],
      });

      const cardUnderTest = testStore.getByZoneAndId("hand", madamMimSnake.id);
      const target = testStore.getByZoneAndId(
        "play",
        pinocchioStarAttraction.id,
      );

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toEqual("hand");
      expect(cardUnderTest.zone).toEqual("play");
      expect(testStore.stackLayers).toHaveLength(0);
    });
  });
});

describe("Regression", () => {
  test("skipping the effect banishes her", async () => {
    const testEngine = new TestEngine({
      play: [magicBroomIlluminaryKeeper],
      inkwell: madamMimSnake.cost,
      hand: [madamMimSnake],
    });

    await testEngine.playCard(madamMimSnake);

    await testEngine.skipTopOfStack();
    await testEngine.skipTopOfStack();

    expect(testEngine.stackLayers).toHaveLength(0);
    expect(testEngine.getCardModel(madamMimSnake).zone).toEqual("discard");
  });
});
