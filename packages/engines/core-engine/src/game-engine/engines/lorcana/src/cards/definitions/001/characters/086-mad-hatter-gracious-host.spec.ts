/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  madHatterGraciousHost,
  magicBroomBucketBrigade,
  mauriceWorldFamousInventor,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";

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
