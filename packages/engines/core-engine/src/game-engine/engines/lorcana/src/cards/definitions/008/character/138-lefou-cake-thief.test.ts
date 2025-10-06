/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { luckyDime } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items";
import { lefouCakeThief } from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("LeFou - Cake Thief", () => {
  it(" ALL FOR ME {E}, banish one of your items – Chosen opponent loses 1 lore and you gain 1 lore.", async () => {
    const testEngine = new TestEngine(
      {
        play: [lefouCakeThief, luckyDime],
        lore: 5,
      },
      {
        lore: 5,
      },
    );

    const cardUnderTest = testEngine.getCardModel(lefouCakeThief);
    const target = testEngine.getCardModel(luckyDime);

    await testEngine.activateCard(cardUnderTest, {
      costs: [target],
    });

    expect(target.zone).toBe("discard");
    expect(cardUnderTest.ready).toBe(false);
    expect(testEngine.getLoreForPlayer("player_one")).toEqual(6);
    expect(testEngine.getLoreForPlayer("player_two")).toEqual(4);
  });
});
