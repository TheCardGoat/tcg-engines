import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { beastSnowfieldTroublemaker } from "./118-beast-snowfield-troublemaker";

const mockLocation = createMockLocation({
  id: "beast-test-loc",
  name: "Test Location",
  cost: 2,
  moveCost: 1,
  willpower: 8,
  lore: 1,
});

const toughDefender = createMockCharacter({
  id: "beast-tough-def",
  name: "Tough Defender",
  cost: 5,
  strength: 5,
  willpower: 5,
});

describe("Beast - Snowfield Troublemaker", () => {
  describe("Rush", () => {
    it("has the Rush keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [beastSnowfieldTroublemaker],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.hasKeyword(beastSnowfieldTroublemaker, "Rush")).toBe(true);
    });
  });

  describe("DYNAMIC MANEUVER", () => {
    it("should take no damage when challenging while at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mockLocation, { card: beastSnowfieldTroublemaker, atLocation: mockLocation }],
          deck: 1,
        },
        {
          play: [{ card: toughDefender, exerted: true }],
          deck: 1,
        },
      );

      // Beast has 3 strength, defender has 5 strength and 5 willpower
      // With the ability, Beast should take 0 damage and survive
      expect(
        testEngine.asPlayerOne().challenge(beastSnowfieldTroublemaker, toughDefender),
      ).toBeSuccessfulCommand();

      // Beast should survive - no damage taken
      expect(testEngine.asPlayerOne().getCardZone(beastSnowfieldTroublemaker)).toBe("play");
      expect(testEngine.asPlayerOne().getDamage(beastSnowfieldTroublemaker)).toBe(0);

      // Defender should have taken Beast's 3 strength as damage
      expect(testEngine.asPlayerOne().getDamage(toughDefender)).toBe(3);
    });

    it("should take damage when challenging while NOT at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [beastSnowfieldTroublemaker],
          deck: 1,
        },
        {
          play: [{ card: toughDefender, exerted: true }],
          deck: 1,
        },
      );

      // Beast has 1 willpower, defender has 5 strength
      // Without the ability (not at location), Beast should be banished
      expect(
        testEngine.asPlayerOne().challenge(beastSnowfieldTroublemaker, toughDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(beastSnowfieldTroublemaker)).toBe("discard");
    });

    it("should take damage when being challenged (defender) while at a location", () => {
      // Beast's ability only protects him when HE challenges (attacker),
      // not when he is being challenged (defender)
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            mockLocation,
            {
              card: beastSnowfieldTroublemaker,
              atLocation: mockLocation,
              exerted: true,
            },
          ],
          deck: 1,
        },
        {
          play: [toughDefender],
          deck: 1,
        },
      );

      // Pass turn to opponent so they can challenge Beast
      testEngine.asPlayerOne().passTurn();

      // Opponent challenges Beast (Beast is the defender)
      // Beast has 1 willpower, attacker has 5 strength
      // Beast should take damage and be banished
      expect(
        testEngine.asPlayerTwo().challenge(toughDefender, beastSnowfieldTroublemaker),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(beastSnowfieldTroublemaker)).toBe("discard");
    });
  });
});
