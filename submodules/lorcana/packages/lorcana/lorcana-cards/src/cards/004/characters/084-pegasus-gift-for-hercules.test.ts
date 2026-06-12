import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { pegasusGiftForHercules } from "./084-pegasus-gift-for-hercules";

const nonEvasiveAttacker = createMockCharacter({
  id: "pegasus-test-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const evasiveAttacker = createMockCharacter({
  id: "pegasus-test-evasive-attacker",
  name: "Evasive Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  abilities: [
    {
      id: "pegasus-test-evasive-attacker-kw",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Pegasus - Gift for Hercules (set 004)", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [pegasusGiftForHercules],
    });

    const cardUnderTest = testEngine.getCardModel(pegasusGiftForHercules);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  describe("Evasive - Only characters with Evasive can challenge this character", () => {
    it("cannot be challenged by a non-Evasive character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: pegasusGiftForHercules, exerted: true }],
          deck: 2,
        },
        {
          play: [nonEvasiveAttacker],
          deck: 2,
        },
      );

      testEngine.asPlayerOne().passTurn();
      expect(
        testEngine.asPlayerTwo().canChallenge(nonEvasiveAttacker, pegasusGiftForHercules),
      ).toBe(false);
    });

    it("can be challenged by an Evasive character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: pegasusGiftForHercules, exerted: true }],
          deck: 2,
        },
        {
          play: [evasiveAttacker],
          deck: 2,
        },
      );

      testEngine.asPlayerOne().passTurn();
      expect(testEngine.asPlayerTwo().canChallenge(evasiveAttacker, pegasusGiftForHercules)).toBe(
        true,
      );
    });
  });
});
