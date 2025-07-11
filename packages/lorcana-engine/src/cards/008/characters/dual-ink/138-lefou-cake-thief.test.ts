/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { luckyDime } from "@lorcanito/lorcana-engine/cards/003/items/items";
import { lefouCakeThief } from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
