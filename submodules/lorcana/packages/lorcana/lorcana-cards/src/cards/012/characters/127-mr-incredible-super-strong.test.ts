import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { mrIncredibleSuperStrong } from "./127-mr-incredible-super-strong";

const otherSuperAlly = createMockCharacter({
  id: "mr-incredible-super-ally",
  name: "Super Ally",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Super", "Hero"],
});

const nonSuperAlly = createMockCharacter({
  id: "mr-incredible-non-super-ally",
  name: "Non Super Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Ally"],
});

const exertedDefender = createMockCharacter({
  id: "mr-incredible-defender",
  name: "Exerted Defender",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const exertedLocationDefender = createMockLocation({
  id: "mr-incredible-location-defender",
  name: "Exerted Location Defender",
  cost: 3,
  willpower: 5,
  lore: 1,
});

describe("Mr. Incredible - Super Strong", () => {
  describe("ALWAYS UNITED - This character gets +2 {S} for each other character you have in play", () => {
    it("has base strength with no other characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mrIncredibleSuperStrong],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(mrIncredibleSuperStrong)).toBe(
        mrIncredibleSuperStrong.strength,
      );
    });

    it("gains +2 strength for each other character you have in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mrIncredibleSuperStrong, otherSuperAlly, nonSuperAlly],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(mrIncredibleSuperStrong)).toBe(
        mrIncredibleSuperStrong.strength + 2 * 2,
      );
    });

    it("does not count itself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mrIncredibleSuperStrong],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(mrIncredibleSuperStrong)).toBe(
        mrIncredibleSuperStrong.strength,
      );
    });

    it("does not count opponent's characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [mrIncredibleSuperStrong], deck: 5 },
        { play: [otherSuperAlly, nonSuperAlly], deck: 5 },
      );

      expect(testEngine.asPlayerOne().getCardStrength(mrIncredibleSuperStrong)).toBe(
        mrIncredibleSuperStrong.strength,
      );
    });
  });

  describe("LET'S DO THIS! - Whenever one of your Super characters challenges another character, draw a card", () => {
    it("draws a card when a Super character (Mr. Incredible himself) challenges another character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mrIncredibleSuperStrong, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: exertedDefender, exerted: true }],
          deck: 5,
        },
      );

      const handBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(
        testEngine.asPlayerOne().challenge(mrIncredibleSuperStrong, exertedDefender),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;
      expect(handAfter).toBe(handBefore + 1);
    });

    it("draws a card when another one of your Super characters challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: mrIncredibleSuperStrong, isDrying: false },
            { card: otherSuperAlly, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [{ card: exertedDefender, exerted: true }],
          deck: 5,
        },
      );

      const handBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(
        testEngine.asPlayerOne().challenge(otherSuperAlly, exertedDefender),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;
      expect(handAfter).toBe(handBefore + 1);
    });

    it("does not draw a card when a Super character challenges a location (THE-1029 F-01)", () => {
      // Card text: "Whenever one of your Super characters challenges another
      // character, draw a card." Locations are not characters, so challenging
      // a location must not trigger the draw.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mrIncredibleSuperStrong, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: exertedLocationDefender, exerted: true }],
          deck: 5,
        },
      );

      const handBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(
        testEngine.asPlayerOne().challenge(mrIncredibleSuperStrong, exertedLocationDefender),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;
      expect(handAfter).toBe(handBefore);
    });

    it("release notes ruling: triggers when Mr. Incredible himself challenges (the ability is not restricted to 'other' Super characters)", () => {
      // Q&A: Let's Do This! triggers when ANY of your Super characters
      // challenges another character — including Mr. Incredible himself.
      const defenderForRelease = createMockCharacter({
        id: "mr-incredible-release-defender",
        name: "Release Defender",
        cost: 3,
        strength: 2,
        willpower: 4,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: mrIncredibleSuperStrong, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: defenderForRelease, exerted: true }],
          deck: 5,
        },
      );

      const handBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(
        testEngine.asPlayerOne().challenge(mrIncredibleSuperStrong, defenderForRelease),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length).toBe(handBefore + 1);
    });

    it("does not draw a card when a non-Super character of yours challenges", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: mrIncredibleSuperStrong, isDrying: false },
            { card: nonSuperAlly, isDrying: false },
          ],
          deck: 5,
        },
        {
          play: [{ card: exertedDefender, exerted: true }],
          deck: 5,
        },
      );

      const handBefore = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;

      expect(
        testEngine.asPlayerOne().challenge(nonSuperAlly, exertedDefender),
      ).toBeSuccessfulCommand();

      const handAfter = testEngine.getCardInstanceIdsInZone("hand", PLAYER_ONE).length;
      expect(handAfter).toBe(handBefore);
    });
  });
});
