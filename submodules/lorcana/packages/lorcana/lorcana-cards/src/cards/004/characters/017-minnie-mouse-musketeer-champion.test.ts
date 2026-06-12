import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { minnieMouseMusketeerChampion } from "./017-minnie-mouse-musketeer-champion";

const strongOpponent = createMockCharacter({
  id: "minnie-strong-opponent",
  name: "Strong Opponent",
  cost: 5,
  strength: 5,
  willpower: 4,
  lore: 1,
});

const weakOpponent = createMockCharacter({
  id: "minnie-weak-opponent",
  name: "Weak Opponent",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
});

const veryStrongOpponent = createMockCharacter({
  id: "minnie-very-strong-opponent",
  name: "Very Strong Opponent",
  cost: 6,
  strength: 7,
  willpower: 5,
  lore: 2,
});

describe("Minnie Mouse - Musketeer Champion", () => {
  it("has Bodyguard keyword ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [minnieMouseMusketeerChampion],
    });

    const cardUnderTest = testEngine.getCardModel(minnieMouseMusketeerChampion);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  describe("DRAMATIC ENTRANCE - When you play this character, banish chosen opposing character with 5 {S} or more.", () => {
    it("banishes a chosen opposing character with exactly 5 strength when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseMusketeerChampion],
          inkwell: minnieMouseMusketeerChampion.cost,
        },
        {
          play: [strongOpponent],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(minnieMouseMusketeerChampion),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(minnieMouseMusketeerChampion, { targets: [strongOpponent] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(strongOpponent)).toBe("discard");
    });

    it("banishes a chosen opposing character with more than 5 strength when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseMusketeerChampion],
          inkwell: minnieMouseMusketeerChampion.cost,
        },
        {
          play: [veryStrongOpponent],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(minnieMouseMusketeerChampion),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(minnieMouseMusketeerChampion, { targets: [veryStrongOpponent] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(veryStrongOpponent)).toBe("discard");
    });

    it("effect fizzles when no opposing characters with 5 strength or more exist", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseMusketeerChampion],
          inkwell: minnieMouseMusketeerChampion.cost,
          deck: 1,
        },
        {
          play: [weakOpponent],
          deck: 1,
        },
      );

      // No valid targets exist — effect auto-fizzles (bag is empty after play)
      expect(
        testEngine.asPlayerOne().playCard(minnieMouseMusketeerChampion),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Weak opponent is unaffected
      expect(testEngine.asPlayerTwo().getCardZone(weakOpponent)).toBe("play");
    });

    it("regression: does NOT banish characters with less than 5 strength (only 5+ strength)", () => {
      const opponent4Strength = createMockCharacter({
        id: "minnie-opponent-4str",
        name: "Opponent 4 Strength",
        cost: 3,
        strength: 4,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseMusketeerChampion],
          inkwell: minnieMouseMusketeerChampion.cost,
          deck: 1,
        },
        {
          play: [opponent4Strength],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(minnieMouseMusketeerChampion),
      ).toBeSuccessfulCommand();

      // No valid targets (4 strength < 5), so bag should be empty
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(opponent4Strength)).toBe("play");
    });

    it("regression: does NOT banish items or locations even with high values", () => {
      const strongItem = createMockItem({
        id: "minnie-strong-item",
        name: "Strong Item",
        cost: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseMusketeerChampion],
          inkwell: minnieMouseMusketeerChampion.cost,
          deck: 1,
        },
        {
          play: [strongItem],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(minnieMouseMusketeerChampion),
      ).toBeSuccessfulCommand();

      // Items are not characters — should not be targetable
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(strongItem)).toBe("play");
    });
  });
});
