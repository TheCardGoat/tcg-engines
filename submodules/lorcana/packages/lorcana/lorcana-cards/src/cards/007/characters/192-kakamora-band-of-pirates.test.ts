import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kakamoraBandOfPirates } from "./192-kakamora-band-of-pirates";

const pirateAlly = createMockCharacter({
  id: "kakamora-test-pirate-ally",
  name: "Pirate Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Pirate"],
});

const nonPirateAlly = createMockCharacter({
  id: "kakamora-test-non-pirate-ally",
  name: "Non-Pirate Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

const defender = createMockCharacter({
  id: "kakamora-test-defender",
  name: "Defender",
  cost: 3,
  strength: 2,
  willpower: 8,
});

describe("Kakamora - Band of Pirates", () => {
  describe("SHOWBOATING - While you have another Pirate character in play, this character gains Challenger +3.", () => {
    it("should not have Challenger bonus without another Pirate in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kakamoraBandOfPirates],
          deck: 1,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 1,
        },
      );

      const preview = testEngine.asPlayerOne().previewChallenge(kakamoraBandOfPirates, defender);
      // Without another Pirate, Challenger bonus does not apply — damage = base strength (1)
      expect(preview?.attackerDamageDealt).toBe(kakamoraBandOfPirates.strength);
    });

    it("should not gain Challenger from a non-Pirate ally", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kakamoraBandOfPirates, nonPirateAlly],
          deck: 1,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 1,
        },
      );

      const preview = testEngine.asPlayerOne().previewChallenge(kakamoraBandOfPirates, defender);
      expect(preview?.attackerDamageDealt).toBe(kakamoraBandOfPirates.strength);
    });

    it("should gain Challenger +3 when another Pirate character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kakamoraBandOfPirates, pirateAlly],
          deck: 1,
        },
        {
          play: [{ card: defender, exerted: true }],
          deck: 1,
        },
      );

      const preview = testEngine.asPlayerOne().previewChallenge(kakamoraBandOfPirates, defender);
      // With another Pirate in play, Challenger +3 applies — damage = 1 + 3 = 4
      expect(preview?.attackerDamageDealt).toBe(kakamoraBandOfPirates.strength + 3);
    });
  });
});
