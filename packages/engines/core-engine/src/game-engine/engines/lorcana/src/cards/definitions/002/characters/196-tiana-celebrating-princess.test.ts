/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { grabYourSword } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { tianaCelebratingPrincess } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tiana- Celebrating Princess", () => {
  it("Resist 2", () => {
    const testStore = new TestStore({
      play: [tianaCelebratingPrincess],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      tianaCelebratingPrincess.id,
    );

    expect(cardUnderTest.hasResist).toEqual(true);
  });

  describe("**WHAT YOU GIVE IS WHAT YOU GET** While this character is exerted and you have no cards in your hand, opponents can’t play actions.", () => {
    it("Exerted, No Cards in Hand", () => {
      const testStore = new TestStore(
        { hand: [grabYourSword], inkwell: grabYourSword.cost },
        {
          play: [tianaCelebratingPrincess],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        tianaCelebratingPrincess.id,
        "player_two",
      );
      cardUnderTest.updateCardMeta({ exerted: true });

      const actionCard = testStore.getByZoneAndId("hand", grabYourSword.id);
      actionCard.playFromHand();

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          discard: 0,
          hand: 1,
        }),
      );
    });

    it("Exerted, With Cards in Hand", () => {
      const testStore = new TestStore(
        { hand: [grabYourSword], inkwell: grabYourSword.cost },
        {
          play: [tianaCelebratingPrincess],
          hand: 1,
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        tianaCelebratingPrincess.id,
        "player_two",
      );
      cardUnderTest.updateCardMeta({ exerted: true });

      const actionCard = testStore.getByZoneAndId("hand", grabYourSword.id);
      actionCard.playFromHand();

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          discard: 1,
          hand: 0,
        }),
      );
    });

    it("Ready, No Cards in Hand", () => {
      const testStore = new TestStore(
        { hand: [grabYourSword], inkwell: grabYourSword.cost },
        {
          play: [tianaCelebratingPrincess],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        tianaCelebratingPrincess.id,
        "player_two",
      );
      cardUnderTest.updateCardMeta({ exerted: false });

      const actionCard = testStore.getByZoneAndId("hand", grabYourSword.id);
      actionCard.playFromHand();

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          discard: 1,
          hand: 0,
        }),
      );
    });

    it("Ready, With Cards in Hand", () => {
      const testStore = new TestStore(
        { hand: [grabYourSword], inkwell: grabYourSword.cost },
        {
          play: [tianaCelebratingPrincess],
          hand: 1,
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        tianaCelebratingPrincess.id,
        "player_two",
      );
      cardUnderTest.updateCardMeta({ exerted: false });

      const actionCard = testStore.getByZoneAndId("hand", grabYourSword.id);
      actionCard.playFromHand();

      expect(testStore.getZonesCardCount()).toEqual(
        expect.objectContaining({
          discard: 1,
          hand: 0,
        }),
      );
    });
  });
});
