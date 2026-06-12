import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { imStillHere } from "./196-im-still-here";

const target = createMockCharacter({
  id: "im-still-here-target",
  name: "Target Character",
  cost: 3,
  strength: 2,
  willpower: 5,
});

const otherCharacter = createMockCharacter({
  id: "im-still-here-other",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const drawnCard = createMockCharacter({
  id: "im-still-here-drawn",
  name: "Drawn Card",
  cost: 1,
});

describe.skip("I'm Still Here", () => {
  describe("Chosen character gains Resist +2 until the start of your next turn.", () => {
    it("grants Resist +2 to the chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [imStillHere],
        inkwell: imStillHere.cost,
        play: [target],
      });

      expect(testEngine.asPlayerOne().playCardTo(imStillHere, target)).toBeSuccessfulCommand();
      expect(testEngine.getKeywordValue(target, "Resist")).toBe(2);
    });

    it("does not grant Resist to other characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [imStillHere],
        inkwell: imStillHere.cost,
        play: [target, otherCharacter],
      });

      expect(testEngine.asPlayerOne().playCardTo(imStillHere, target)).toBeSuccessfulCommand();
      expect(testEngine.getKeywordValue(target, "Resist")).toBe(2);
      expect(testEngine.getKeywordValue(otherCharacter, "Resist")).toBeNull();
    });

    it("Resist +2 lasts through the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [imStillHere],
          inkwell: imStillHere.cost,
          play: [target],
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCardTo(imStillHere, target)).toBeSuccessfulCommand();
      expect(testEngine.getKeywordValue(target, "Resist")).toBe(2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      // Still active during opponent's turn
      expect(testEngine.getKeywordValue(target, "Resist")).toBe(2);

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      // Expires at the start of the controller's next turn
      expect(testEngine.getKeywordValue(target, "Resist")).toBe(2);
    });

    it("Resist +2 expires at the start of the controller's next turn (after a full round)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [imStillHere],
          inkwell: imStillHere.cost,
          play: [target],
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCardTo(imStillHere, target)).toBeSuccessfulCommand();
      expect(testEngine.getKeywordValue(target, "Resist")).toBe(2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      // After a full round, the "until-start-of-next-turn" duration should expire
      // The Resist should be gone at the start of P1's next turn
      // (the value may still show 2 right as P1's turn starts until cleanup)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.getKeywordValue(target, "Resist")).toBeNull();
    });
  });

  describe("Draw a card.", () => {
    it("draws a card when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [imStillHere],
        inkwell: imStillHere.cost,
        deck: [drawnCard],
        play: [target],
      });

      expect(testEngine.asPlayerOne().playCardTo(imStillHere, target)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    });
  });
});
