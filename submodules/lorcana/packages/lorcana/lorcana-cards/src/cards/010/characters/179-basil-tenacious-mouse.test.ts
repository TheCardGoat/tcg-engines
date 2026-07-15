import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { basilTenaciousMouse } from "./179-basil-tenacious-mouse";

const detectiveAlly = createMockCharacter({
  id: "detective-ally",
  name: "Detective Ally",
  cost: 2,
  classifications: ["Storyborn", "Hero", "Detective"],
});

const nonDetectiveAlly = createMockCharacter({
  id: "non-detective-ally",
  name: "Non-Detective Ally",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

describe("Basil - Tenacious Mouse", () => {
  describe("HOLD YOUR GROUND - Whenever you play another Detective character, this character gains Resist +1 until the start of your next turn.", () => {
    it("grants Resist +1 to Basil when another Detective is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [basilTenaciousMouse],
        hand: [detectiveAlly],
        inkwell: detectiveAlly.cost,
      });

      expect(testEngine.asPlayerOne().getKeywordValue(basilTenaciousMouse, "Resist")).toBeNull();

      expect(testEngine.asPlayerOne().playCard(detectiveAlly)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getKeywordValue(basilTenaciousMouse, "Resist")).toBe(1);
    });

    it("does NOT trigger when playing a non-Detective character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [basilTenaciousMouse],
        hand: [nonDetectiveAlly],
        inkwell: nonDetectiveAlly.cost,
      });

      expect(testEngine.asPlayerOne().playCard(nonDetectiveAlly)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getKeywordValue(basilTenaciousMouse, "Resist")).toBeNull();
    });

    it("Resist lasts until the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [basilTenaciousMouse],
        hand: [detectiveAlly],
        inkwell: detectiveAlly.cost,
      });

      expect(testEngine.asPlayerOne().playCard(detectiveAlly)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getKeywordValue(basilTenaciousMouse, "Resist")).toBe(1);

      // Pass to opponent's turn - Resist should still be active
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getKeywordValue(basilTenaciousMouse, "Resist")).toBe(1);

      // Pass back to your turn - Resist should expire
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getKeywordValue(basilTenaciousMouse, "Resist")).toBeNull();
    });

    it("does NOT trigger when Basil himself is played (excludeSelf)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [basilTenaciousMouse],
        inkwell: basilTenaciousMouse.cost,
      });

      expect(testEngine.asPlayerOne().playCard(basilTenaciousMouse)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getKeywordValue(basilTenaciousMouse, "Resist")).toBeNull();
    });
  });
});
