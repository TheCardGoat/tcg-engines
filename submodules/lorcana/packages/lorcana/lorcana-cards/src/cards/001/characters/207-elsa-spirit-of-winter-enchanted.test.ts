import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { elsaSpiritOfWinterEnchanted } from "./207-elsa-spirit-of-winter-enchanted";

const targetOne = createMockCharacter({
  id: "deep-freeze-target-one",
  name: "Target One",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const targetTwo = createMockCharacter({
  id: "deep-freeze-target-two",
  name: "Target Two",
  cost: 3,
  strength: 2,
  willpower: 3,
});

describe("Elsa - Spirit of Winter (Enchanted)", () => {
  describe("DEEP FREEZE — When you play this character, exert up to 2 chosen characters. They can't ready at the start of their next turn.", () => {
    it("exerts 1 chosen character and prevents readying at start of their next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [elsaSpiritOfWinterEnchanted],
          inkwell: elsaSpiritOfWinterEnchanted.cost,
          deck: 2,
        },
        {
          play: [{ card: targetOne, exerted: false }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(elsaSpiritOfWinterEnchanted),
      ).toBeSuccessfulCommand();

      // DEEP FREEZE trigger should be on the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Resolve the bag targeting one character
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(elsaSpiritOfWinterEnchanted, { targets: [targetOne] }),
      ).toBeSuccessfulCommand();

      // Target should now be exerted
      expect(testEngine.asPlayerTwo().isExerted(targetOne)).toBe(true);

      // Pass player one's turn — at the start of player two's turn, targetOne should NOT ready
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(targetOne)).toBe(true);

      // Pass player two's turn — at the start of player one's turn, targetOne still can't ready
      // (restriction is for "their next turn" = player two's next turn)
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(targetOne)).toBe(true);

      // Pass player one's turn again — now player two's second turn starts, restriction expired
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(targetOne)).toBe(false);
    });

    it("exerts 2 chosen characters and prevents both from readying at start of their next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [elsaSpiritOfWinterEnchanted],
          inkwell: elsaSpiritOfWinterEnchanted.cost,
          deck: 2,
        },
        {
          play: [
            { card: targetOne, exerted: false },
            { card: targetTwo, exerted: false },
          ],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(elsaSpiritOfWinterEnchanted),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(elsaSpiritOfWinterEnchanted, { targets: [targetOne, targetTwo] }),
      ).toBeSuccessfulCommand();

      // Both targets should be exerted
      expect(testEngine.asPlayerTwo().isExerted(targetOne)).toBe(true);
      expect(testEngine.asPlayerTwo().isExerted(targetTwo)).toBe(true);

      // Pass player one's turn — neither target readies on player two's turn start
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(targetOne)).toBe(true);
      expect(testEngine.asPlayerTwo().isExerted(targetTwo)).toBe(true);

      // Pass player two's turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(targetOne)).toBe(true);
      expect(testEngine.asPlayerTwo().isExerted(targetTwo)).toBe(true);

      // Pass player one's turn — restriction expires, both ready on player two's next turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().isExerted(targetOne)).toBe(false);
      expect(testEngine.asPlayerTwo().isExerted(targetTwo)).toBe(false);
    });
  });
});
