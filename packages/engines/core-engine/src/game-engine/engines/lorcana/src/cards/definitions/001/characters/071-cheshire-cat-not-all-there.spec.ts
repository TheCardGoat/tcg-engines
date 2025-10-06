/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  cheshireCat,
  teKaTheBurningOne,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

export const cheshireCatNotAllThereTestCase = async () => {
  const testEngine = new TestEngine(
    {
      play: [teKaTheBurningOne],
    },
    {
      play: [cheshireCat],
    },
  );

  const cardUnderTest = testEngine.getCardModel(cheshireCat);
  const attacker = testEngine.getCardModel(teKaTheBurningOne);

  expect(cardUnderTest.zone).toEqual("play");
  cardUnderTest.updateCardMeta({ exerted: true });

  await testEngine.challenge({
    attacker: attacker,
    defender: cardUnderTest,
  });

  expect(testEngine.getZonesCardCount("player_one")).toEqual(
    expect.objectContaining({ discard: 1, play: 0 }),
  );
  expect(testEngine.getZonesCardCount("player_two")).toEqual(
    expect.objectContaining({ discard: 1, play: 0 }),
  );
};

describe("Cheshire Cat - Not All There", () => {
  it("**Lose something?** When this character is challenged and banished, banish the challenging character.", () => {
    cheshireCatNotAllThereTestCase();
  });
});
