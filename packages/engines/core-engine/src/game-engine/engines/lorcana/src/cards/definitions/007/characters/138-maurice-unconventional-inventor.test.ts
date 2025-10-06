/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import {
  diabloSpitefulRaven,
  mauricesMachine,
  mauriceUnconventionalInventor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Maurice - Unconventional Inventor", () => {
  describe("HOW ON EARTH DID THAT HAPPEN? When you play this character, you may banish chosen item of yours to draw a card. If the banished item is named Maurice's Machine, you may also banish chosen character with 2 {S} or less.", () => {
    it("Choosing Maurice's Machine", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: mauriceUnconventionalInventor.cost,
          play: [mauricesMachine],
          hand: [mauriceUnconventionalInventor],
          deck: 5,
        },
        { play: [diabloSpitefulRaven] },
      );

      await testEngine.playCard(
        mauriceUnconventionalInventor,
        {
          targets: [mauricesMachine],
          acceptOptionalLayer: true,
        },
        true,
      );

      expect(testEngine.getCardModel(mauricesMachine).zone).toEqual("discard");
      expect(testEngine.getZonesCardCount().hand).toEqual(1);

      await testEngine.resolveTopOfStack({ targets: [diabloSpitefulRaven] });
      expect(testEngine.getCardModel(diabloSpitefulRaven).zone).toEqual(
        "discard",
      );
    });

    it("NOT choosing Maurice's Machine", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: mauriceUnconventionalInventor.cost,
          play: [pawpsicle],
          hand: [mauriceUnconventionalInventor],
          deck: 5,
        },
        { play: [diabloSpitefulRaven] },
      );

      await testEngine.playCard(
        mauriceUnconventionalInventor,
        {
          targets: [pawpsicle],
          acceptOptionalLayer: true,
        },
        true,
      );

      expect(testEngine.getCardModel(pawpsicle).zone).toEqual("discard");
      expect(testEngine.getZonesCardCount().hand).toEqual(1);

      console.log(JSON.stringify(testEngine.stackLayers));
      expect(testEngine.stackLayers).toHaveLength(0);
    });
  });
});
