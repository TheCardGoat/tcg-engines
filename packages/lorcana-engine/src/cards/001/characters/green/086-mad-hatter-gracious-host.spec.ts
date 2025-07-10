/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  madHatterGraciousHost,
  magicBroomBucketBrigade,
  mauriceWorldFamousInventor,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Mad Hatter - Gracious Host", () => {
  it("**TEA PARTY** Whenever this character is challenged, you may draw a card.", () => {
    const testStore = new TestStore(
      {
        play: [mauriceWorldFamousInventor],
      },
      {
        deck: [magicBroomBucketBrigade],
        play: [madHatterGraciousHost],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      madHatterGraciousHost.id,
      "player_two",
    );

    const attacker = testStore.getByZoneAndId(
      "play",
      mauriceWorldFamousInventor.id,
    );

    cardUnderTest.updateCardMeta({ exerted: true });
    attacker.challenge(cardUnderTest);

    testStore.changePlayer().resolveTopOfStack();

    expect(testStore.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({ hand: 0, deck: 0 }),
    );
    expect(testStore.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({ hand: 1, deck: 0 }),
    );
  });
});
