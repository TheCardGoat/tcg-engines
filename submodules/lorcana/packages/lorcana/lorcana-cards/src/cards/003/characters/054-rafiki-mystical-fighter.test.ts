import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rafikiMysticalFighter } from "./054-rafiki-mystical-fighter";

const hyenaCharacter = createMockCharacter({
  id: "rafiki-test-hyena",
  name: "Hyena Defender",
  cost: 2,
  strength: 3,
  willpower: 5,
  lore: 1,
  classifications: ["Hyena"],
});

const nonHyenaCharacter = createMockCharacter({
  id: "rafiki-test-non-hyena",
  name: "Non-Hyena Defender",
  cost: 2,
  strength: 1,
  willpower: 5,
  lore: 1,
});

describe("Rafiki - Mystical Fighter", () => {
  describe("Challenger +3", () => {
    it("has the Challenger keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [rafikiMysticalFighter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(rafikiMysticalFighter, "Challenger")).toBe(true);
    });
  });

  describe("ANCIENT SKILLS - Whenever he challenges a Hyena character, this character takes no damage from the challenge.", () => {
    it("takes no damage when challenging a Hyena character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rafikiMysticalFighter, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: hyenaCharacter, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(rafikiMysticalFighter, hyenaCharacter),
      ).toBeSuccessfulCommand();

      // Rafiki should take no damage from the Hyena
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: rafikiMysticalFighter,
        value: 0,
      });

      // Hyena should still take damage from Rafiki
      expect(testEngine.asPlayerTwo()).toHaveDamage({
        card: hyenaCharacter,
        value: rafikiMysticalFighter.strength + 3, // +3 from Challenger
      });
    });

    it("takes normal damage when challenging a non-Hyena character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rafikiMysticalFighter, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: nonHyenaCharacter, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(rafikiMysticalFighter, nonHyenaCharacter),
      ).toBeSuccessfulCommand();

      // Rafiki should take normal damage from the non-Hyena character's strength
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: rafikiMysticalFighter,
        value: nonHyenaCharacter.strength,
      });
    });
  });
});
