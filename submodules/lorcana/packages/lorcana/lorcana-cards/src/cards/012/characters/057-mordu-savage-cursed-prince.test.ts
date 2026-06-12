import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { morduSavageCursedPrince } from "./057-mordu-savage-cursed-prince";

const otherFriendlyCharacter = createMockCharacter({
  id: "mordu-savage-other-friendly",
  name: "Other Friendly",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const anotherMordu = createMockCharacter({
  id: "mordu-savage-another-mordu",
  name: "Mor'du",
  version: "Raging Bear",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opposingCharacter = createMockCharacter({
  id: "mordu-savage-opposing",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Mor'du - Savage Cursed Prince", () => {
  describe("FEROCIOUS ROAR - When you play this character, exert all your characters not named Mor'du.", () => {
    it("exerts your other non-Mor'du characters when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [morduSavageCursedPrince],
        inkwell: morduSavageCursedPrince.cost,
        play: [otherFriendlyCharacter, anotherMordu],
        deck: 3,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(testEngine.isExerted(otherFriendlyCharacter)).toBe(false);
      expect(testEngine.isExerted(anotherMordu)).toBe(false);

      expect(playerOne.playCard(morduSavageCursedPrince)).toBeSuccessfulCommand();

      // Non-Mor'du characters get exerted
      expect(testEngine.isExerted(otherFriendlyCharacter)).toBe(true);
      // Other Mor'du characters are NOT exerted
      expect(testEngine.isExerted(anotherMordu)).toBe(false);
      // The played Mor'du itself is not exerted (drying, but not exerted)
      expect(testEngine.isExerted(morduSavageCursedPrince)).toBe(false);
    });

    it("does not exert opposing characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [morduSavageCursedPrince],
          inkwell: morduSavageCursedPrince.cost,
          deck: 3,
        },
        {
          play: [opposingCharacter],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().playCard(morduSavageCursedPrince)).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opposingCharacter)).toBe(false);
    });
  });

  describe("ROOTED BY FEAR - Your characters not named Mor'du can't ready at the start of your turn.", () => {
    it("prevents your non-Mor'du characters from readying at the start of your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: morduSavageCursedPrince, exerted: false },
            { card: otherFriendlyCharacter, exerted: true },
            { card: anotherMordu, exerted: true },
          ],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      // Both other chars start exerted; Mor'du itself ready
      expect(testEngine.isExerted(otherFriendlyCharacter)).toBe(true);
      expect(testEngine.isExerted(anotherMordu)).toBe(true);

      // P1 passes — P2's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      // P2 passes — P1's turn starts
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // The non-Mor'du character should NOT ready at the start of your turn
      expect(testEngine.isExerted(otherFriendlyCharacter)).toBe(true);
      // The other Mor'du should ready normally
      expect(testEngine.isExerted(anotherMordu)).toBe(false);
    });
  });
});
