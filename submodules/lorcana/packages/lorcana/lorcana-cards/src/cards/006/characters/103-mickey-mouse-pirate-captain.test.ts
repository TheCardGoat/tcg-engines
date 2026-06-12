import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mickeyMousePirateCaptain } from "./103-mickey-mouse-pirate-captain";

const pirateCharacter = createMockCharacter({
  id: "mm-pc-pirate",
  name: "Pirate Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  classifications: ["Pirate"],
});

describe("Mickey Mouse - Pirate Captain", () => {
  it("has Shift keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mickeyMousePirateCaptain],
    });

    expect(testEngine.asPlayerOne().hasKeyword(mickeyMousePirateCaptain, "Shift")).toBe(true);
  });

  describe('MARINER\'S MIGHT - Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.', () => {
    it("gives chosen Pirate character +2 strength when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMousePirateCaptain, pirateCharacter],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(mickeyMousePirateCaptain)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mickeyMousePirateCaptain, { targets: [pirateCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(pirateCharacter)).toBe(
        pirateCharacter.strength + 2,
      );
    });

    it("grants chosen Pirate 'takes no damage from challenges' this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMousePirateCaptain, pirateCharacter],
        deck: 3,
      });

      expect(
        testEngine
          .asPlayerOne()
          .hasTemporaryAbility(pirateCharacter, "takes-no-damage-from-challenges"),
      ).toBe(false);

      expect(testEngine.asPlayerOne().quest(mickeyMousePirateCaptain)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(mickeyMousePirateCaptain, { targets: [pirateCharacter] }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .hasTemporaryAbility(pirateCharacter, "takes-no-damage-from-challenges"),
      ).toBe(true);
    });
  });
});
