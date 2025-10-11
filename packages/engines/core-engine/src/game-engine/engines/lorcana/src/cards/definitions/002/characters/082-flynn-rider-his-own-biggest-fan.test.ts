import { describe, expect, it } from "bun:test";
import { flynnRiderHisOwnBiggestFan } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Flynn Rider - His Own Biggest Fan", () => {
  it("Shift", () => {
    const testStore = new TestStore({
      play: [flynnRiderHisOwnBiggestFan],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      flynnRiderHisOwnBiggestFan.id,
    );

    expect(cardUnderTest.hasShift()).toEqual(true);
  });

  it("Evasive", () => {
    const testStore = new TestStore({
      play: [flynnRiderHisOwnBiggestFan],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      flynnRiderHisOwnBiggestFan.id,
    );

    expect(cardUnderTest.hasEvasive).toEqual(true);
  });

  describe("**ONE LAST, BIG SCORE** This character gets -1 {L} for each card in your opponents' hands.", () => {
    it("Zero cards in opponent's hand", () => {
      const testStore = new TestStore(
        {
          play: [flynnRiderHisOwnBiggestFan],
        },
        {
          hand: [],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        flynnRiderHisOwnBiggestFan.id,
      );

      expect(cardUnderTest.lore).toEqual(4);
    });

    it("One card in opponent's hand", () => {
      const testStore = new TestStore(
        {
          play: [flynnRiderHisOwnBiggestFan],
        },
        {
          hand: 1,
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        flynnRiderHisOwnBiggestFan.id,
      );

      expect(cardUnderTest.lore).toEqual(3);
    });

    it("Two cards in opponent's hand", () => {
      const testStore = new TestStore(
        {
          play: [flynnRiderHisOwnBiggestFan],
        },
        {
          hand: 2,
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        flynnRiderHisOwnBiggestFan.id,
      );

      expect(cardUnderTest.lore).toEqual(2);
    });

    it("Four cards in opponent's hand", () => {
      const testStore = new TestStore(
        {
          play: [flynnRiderHisOwnBiggestFan],
        },
        {
          hand: 4,
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        flynnRiderHisOwnBiggestFan.id,
      );

      expect(cardUnderTest.lore).toEqual(0);
    });
  });
});
