import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { magicGoldenFlower } from "../../001/items/169-magic-golden-flower";
import { grandPabbieOldestAndWisest } from "./150-grand-pabbie-oldest-and-wisest";

const damagedAlly = createMockCharacter({
  id: "grand-pabbie-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  willpower: 5,
});

describe("Grand Pabbie - Oldest and Wisest", () => {
  describe("ANCIENT INSIGHT - Whenever you remove 1 or more damage from one of your characters, gain 2 lore.", () => {
    it("gains 2 lore when you heal one of your characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [grandPabbieOldestAndWisest, { card: damagedAlly, damage: 3 }, magicGoldenFlower],
        deck: 2,
      });

      const allyId = testEngine.findCardInstanceId(damagedAlly, "play");
      const flowerId = testEngine.findCardInstanceId(magicGoldenFlower, "play");

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().activateAbility(flowerId, {
          abilityIndex: 0,
          targets: [allyId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(damagedAlly)).toBe(0);
    });

    it("does not gain lore if no damage is actually removed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [grandPabbieOldestAndWisest, damagedAlly, magicGoldenFlower],
        deck: 2,
      });

      const allyId = testEngine.findCardInstanceId(damagedAlly, "play");
      const flowerId = testEngine.findCardInstanceId(magicGoldenFlower, "play");

      expect(
        testEngine.asPlayerOne().activateAbility(flowerId, {
          abilityIndex: 0,
          targets: [allyId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });
  });
});
