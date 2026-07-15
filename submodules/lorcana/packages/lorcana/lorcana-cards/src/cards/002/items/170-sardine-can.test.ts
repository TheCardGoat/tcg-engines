import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sardineCan } from "./170-sardine-can";

const character = createMockCharacter({
  id: "sardine-can-character",
  name: "Sardine Can Character",
  cost: 2,
});

describe("Sardine Can", () => {
  describe("FLIGHT CABIN — Your exerted characters gain Ward.", () => {
    it("exerted characters gain Ward while Sardine Can is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [sardineCan, character],
      });

      expect(testEngine.asPlayerOne().hasKeyword(character, "Ward")).toBe(false);

      testEngine.asServer().manualExertCard(character);

      expect(testEngine.asPlayerOne().hasKeyword(character, "Ward")).toBe(true);
    });

    it("non-exerted characters do not gain Ward", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [sardineCan, character],
      });

      expect(testEngine.asPlayerOne().hasKeyword(character, "Ward")).toBe(false);
    });

    it("Ward is removed when a character readies", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [sardineCan, character],
      });

      testEngine.asServer().manualExertCard(character);
      expect(testEngine.asPlayerOne().hasKeyword(character, "Ward")).toBe(true);

      // Ready the character at start of next turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(character, "Ward")).toBe(false);
    });
  });
});
