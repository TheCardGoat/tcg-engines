/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { thisIsMyFamily } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import { pjPeteCaughtUpInTheMusic } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("P.J. Pete - Caught Up in the Music", () => {
  it("SHOUT OUT LOUD! Whenever you play a song, this character gets +2 {S} this turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: thisIsMyFamily.cost,
      play: [pjPeteCaughtUpInTheMusic],
      hand: [thisIsMyFamily],
    });

    const cardToPlay = testEngine.getCardModel(thisIsMyFamily);
    const cardUnderTest = testEngine.getCardModel(pjPeteCaughtUpInTheMusic);

    expect(cardUnderTest.strength).toBe(pjPeteCaughtUpInTheMusic.strength);

    await testEngine.playCard(cardToPlay);

    expect(testEngine.getPlayerLore()).toBe(1);
    expect(testEngine.getCardsByZone.length).toBe(1);

    expect(cardUnderTest.strength).toBe(pjPeteCaughtUpInTheMusic.strength + 2);

    await testEngine.passTurn();

    expect(cardUnderTest.strength).toBe(pjPeteCaughtUpInTheMusic.strength);
  });
});
