/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mrSmeeBumblingMate } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { montereyJackGoodheartedRanger } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { kakamoraBandOfPirates } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Kakamora - Band of Pirates", () => {
  it("should not have challenger if you don't have another pirate", async () => {
    const testStore = new TestStore(
      {
        inkwell: kakamoraBandOfPirates.cost,
        play: [kakamoraBandOfPirates],
        hand: [],
      },
      { play: [montereyJackGoodheartedRanger] },
    );
    const bigDummyCardToChallenge = testStore.getCard(
      montereyJackGoodheartedRanger,
    );
    bigDummyCardToChallenge.updateCardMeta({ exerted: true });
    const cardUndertest = testStore.getCard(kakamoraBandOfPirates);
    cardUndertest.challenge(bigDummyCardToChallenge);
    expect(bigDummyCardToChallenge.damage).toBe(kakamoraBandOfPirates.strength);
  });
  it("should have challenger if you have another pirate", async () => {
    const testStore = new TestStore(
      {
        inkwell: kakamoraBandOfPirates.cost,
        play: [kakamoraBandOfPirates, mrSmeeBumblingMate],
        hand: [],
      },
      { play: [montereyJackGoodheartedRanger] },
    );
    const bigDummyCardToChallenge = testStore.getCard(
      montereyJackGoodheartedRanger,
    );
    bigDummyCardToChallenge.updateCardMeta({ exerted: true });
    const cardUndertest = testStore.getCard(kakamoraBandOfPirates);
    cardUndertest.challenge(bigDummyCardToChallenge);
    expect(bigDummyCardToChallenge.damage).toBe(
      kakamoraBandOfPirates.strength + 3,
    );
  });
});
