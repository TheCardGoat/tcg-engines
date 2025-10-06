/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";
import {
  megaraPullingTheStrings,
  mickeyMouseTrueFriend,
  motherGoethelSelfishManipulator,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mother Gothel - Selfish Manipulator", () => {
  describe("**SKIP THE DRAMA, STAY WITH MAMA** While this character is exerted, opposing character can't quest.", () => {
    it("Opposing character CANNOT quest when she's exerted", () => {
      const testStore = new TestStore(
        {
          play: [megaraPullingTheStrings, mickeyMouseTrueFriend],
        },
        {
          play: [motherGoethelSelfishManipulator],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId(
        "play",
        motherGoethelSelfishManipulator.id,
        "player_two",
      );
      const target = testStore.getByZoneAndId(
        "play",
        megaraPullingTheStrings.id,
      );
      const anotherTarget = testStore.getByZoneAndId(
        "play",
        mickeyMouseTrueFriend.id,
      );

      cardUnderTest.updateCardMeta({ exerted: true });

      [target, anotherTarget].forEach((char) => {
        expect(char.hasQuestRestriction).toBe(true);
      });

      expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
      target.quest();
      expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
      anotherTarget.quest();
      expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
    });

    it("Opposing character CAN quest when she's NOT exerted", () => {
      const testStore = new TestStore(
        {
          play: [megaraPullingTheStrings],
        },
        {
          play: [motherGoethelSelfishManipulator],
        },
      );

      const target = testStore.getByZoneAndId(
        "play",
        megaraPullingTheStrings.id,
      );

      expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
      target.quest();
      expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(1);
    });
  });
});
