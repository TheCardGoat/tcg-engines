import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { treasureGuardianProtectorOfTheCave } from "./058-treasure-guardian-protector-of-the-cave";

const opponentDefender = createMockCharacter({
  id: "treasure-guardian-test-opponent-defender",
  name: "Opponent Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const testLocation = createMockLocation({
  id: "treasure-guardian-test-location",
  name: "Test Cave",
  cost: 2,
  moveCost: 1,
  lore: 1,
  willpower: 10,
});

describe("Treasure Guardian - Protector of the Cave", () => {
  describe("WHO DISTURBS MY SLUMBER? - This character can't challenge or quest unless it is at a location.", () => {
    it("cannot quest when not at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [treasureGuardianProtectorOfTheCave],
      });

      const guardianId = testEngine.findCardInstanceId(treasureGuardianProtectorOfTheCave, "play");

      const result = testEngine.asPlayerOne().quest(guardianId);
      expect(result).not.toBeSuccessfulCommand();
    });

    it("cannot challenge when not at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [treasureGuardianProtectorOfTheCave],
        },
        {
          play: [{ card: opponentDefender, exerted: true }],
        },
      );

      const guardianId = testEngine.findCardInstanceId(treasureGuardianProtectorOfTheCave, "play");
      const defenderId = testEngine.findCardInstanceId(opponentDefender, "play", "player_two");

      const result = testEngine.asPlayerOne().challenge(guardianId, defenderId);
      expect(result).not.toBeSuccessfulCommand();
    });

    it("can quest when at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [treasureGuardianProtectorOfTheCave, testLocation],
        inkwell: 1,
      });

      const guardianId = testEngine.findCardInstanceId(treasureGuardianProtectorOfTheCave, "play");
      const locationId = testEngine.findCardInstanceId(testLocation, "play");

      // Move guardian to the location
      expect(
        testEngine.asPlayerOne().moveCharacterToLocation(guardianId, locationId),
      ).toBeSuccessfulCommand();

      // Now the guardian should be able to quest
      const result = testEngine.asPlayerOne().quest(guardianId);
      expect(result).toBeSuccessfulCommand();
    });

    it("can challenge when at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [treasureGuardianProtectorOfTheCave, testLocation],
          inkwell: 1,
        },
        {
          play: [{ card: opponentDefender, exerted: true }],
        },
      );

      const guardianId = testEngine.findCardInstanceId(treasureGuardianProtectorOfTheCave, "play");
      const locationId = testEngine.findCardInstanceId(testLocation, "play");
      const defenderId = testEngine.findCardInstanceId(opponentDefender, "play", "player_two");

      // Move guardian to the location
      expect(
        testEngine.asPlayerOne().moveCharacterToLocation(guardianId, locationId),
      ).toBeSuccessfulCommand();

      // Now the guardian should be able to challenge
      const result = testEngine.asPlayerOne().challenge(guardianId, defenderId);
      expect(result).toBeSuccessfulCommand();
    });
  });
});
