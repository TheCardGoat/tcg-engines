import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { nortonNimnulMisanthropicGenius } from "./146-norton-nimnul-misanthropic-genius";

const firstItem = createMockItem({
  id: "norton-nimnul-first-item",
  name: "Norton First Item",
  cost: 1,
});

const secondItem = createMockItem({
  id: "norton-nimnul-second-item",
  name: "Norton Second Item",
  cost: 1,
});

const opposingCharacter = createMockCharacter({
  id: "norton-nimnul-opposing",
  name: "Opposing Character",
  cost: 3,
  strength: 4,
  willpower: 4,
});

const ownCharacter = createMockCharacter({
  id: "norton-nimnul-own",
  name: "Own Character",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Norton Nimnul - Misanthropic Genius", () => {
  describe("DEVITALIZER RAY - Once during your turn, whenever you play an item, chosen opposing character gets -2 {S} this turn.", () => {
    it("reduces the chosen opposing character's strength by 2 when you play an item", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: nortonNimnulMisanthropicGenius, isDrying: false }],
          hand: [firstItem],
          inkwell: firstItem.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(firstItem)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(nortonNimnulMisanthropicGenius, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength - 2,
      );
    });

    it("strength penalty expires at the end of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: nortonNimnulMisanthropicGenius, isDrying: false }],
          hand: [firstItem],
          inkwell: firstItem.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(firstItem)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(nortonNimnulMisanthropicGenius, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength - 2,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength,
      );
    });

    it("only triggers once per turn even when multiple items are played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: nortonNimnulMisanthropicGenius, isDrying: false }],
          hand: [firstItem, secondItem],
          inkwell: firstItem.cost + secondItem.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(firstItem)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(nortonNimnulMisanthropicGenius, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength - 2,
      );

      // Second item in the same turn should NOT add another trigger to the bag.
      expect(testEngine.asPlayerOne().playCard(secondItem)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getCardStrength(opposingCharacter)).toBe(
        opposingCharacter.strength - 2,
      );
    });

    it("cannot target own characters (only opposing)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: nortonNimnulMisanthropicGenius, isDrying: false },
            { card: ownCharacter, isDrying: false },
          ],
          hand: [firstItem],
          inkwell: firstItem.cost,
          deck: 1,
        },
        {
          play: [opposingCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(firstItem)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(nortonNimnulMisanthropicGenius, {
          targets: [ownCharacter],
        }),
      ).not.toBeSuccessfulCommand();
    });
  });
});
