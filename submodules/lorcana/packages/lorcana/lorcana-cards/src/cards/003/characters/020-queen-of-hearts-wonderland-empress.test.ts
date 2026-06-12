import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { queenOfHeartsWonderlandEmpress } from "./020-queen-of-hearts-wonderland-empress";

const villainCharacter = createMockCharacter({
  id: "qohwe-test-villain",
  name: "Villain Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Villain"],
});

const anotherVillainCharacter = createMockCharacter({
  id: "qohwe-test-villain-2",
  name: "Another Villain Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 2,
  classifications: ["Storyborn", "Villain"],
});

const nonVillainCharacter = createMockCharacter({
  id: "qohwe-test-non-villain",
  name: "Non-Villain Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Queen of Hearts - Wonderland Empress", () => {
  describe("ALL WAYS HERE ARE MY WAYS - Whenever this character quests, your other Villain characters get +1 {L} this turn.", () => {
    it("other Villain characters get +1 lore when Queen of Hearts quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: queenOfHeartsWonderlandEmpress, isDrying: false }, villainCharacter],
        deck: 2,
      });

      const loreBefore = testEngine.asPlayerOne().getCardLore(villainCharacter);
      expect(loreBefore).toBe(villainCharacter.lore);

      expect(
        testEngine.asPlayerOne().quest(queenOfHeartsWonderlandEmpress),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(villainCharacter)).toBe(loreBefore + 1);
    });

    it("multiple Villain characters all get +1 lore when Queen of Hearts quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: queenOfHeartsWonderlandEmpress, isDrying: false },
          villainCharacter,
          anotherVillainCharacter,
        ],
        deck: 2,
      });

      const villain1LoreBefore = testEngine.asPlayerOne().getCardLore(villainCharacter);
      const villain2LoreBefore = testEngine.asPlayerOne().getCardLore(anotherVillainCharacter);

      expect(
        testEngine.asPlayerOne().quest(queenOfHeartsWonderlandEmpress),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(villainCharacter)).toBe(villain1LoreBefore + 1);
      expect(testEngine.asPlayerOne().getCardLore(anotherVillainCharacter)).toBe(
        villain2LoreBefore + 1,
      );
    });

    it("non-Villain characters do NOT get the lore bonus", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: queenOfHeartsWonderlandEmpress, isDrying: false }, nonVillainCharacter],
        deck: 2,
      });

      const loreBefore = testEngine.asPlayerOne().getCardLore(nonVillainCharacter);
      expect(loreBefore).toBe(nonVillainCharacter.lore);

      expect(
        testEngine.asPlayerOne().quest(queenOfHeartsWonderlandEmpress),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(nonVillainCharacter)).toBe(loreBefore);
    });

    it("Queen of Hearts herself does NOT get the lore bonus (only OTHER Villains)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: queenOfHeartsWonderlandEmpress, isDrying: false }],
        deck: 2,
      });

      const queenLoreBefore = testEngine.asPlayerOne().getCardLore(queenOfHeartsWonderlandEmpress);

      expect(
        testEngine.asPlayerOne().quest(queenOfHeartsWonderlandEmpress),
      ).toBeSuccessfulCommand();

      // Queen's lore stat stays the same (lore gained goes to the player, not card stat)
      expect(testEngine.asPlayerOne().getCardLore(queenOfHeartsWonderlandEmpress)).toBe(
        queenLoreBefore,
      );
    });

    it("the +1 lore bonus expires at the end of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: queenOfHeartsWonderlandEmpress, isDrying: false }, villainCharacter],
          deck: 2,
        },
        { deck: 2 },
      );

      const loreBefore = testEngine.asPlayerOne().getCardLore(villainCharacter);

      expect(
        testEngine.asPlayerOne().quest(queenOfHeartsWonderlandEmpress),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(villainCharacter)).toBe(loreBefore + 1);

      // Pass both turns
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // The lore bonus should be gone next turn
      expect(testEngine.asPlayerOne().getCardLore(villainCharacter)).toBe(loreBefore);
    });
  });
});
