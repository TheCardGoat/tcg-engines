import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { flotsamRiffraff } from "./072-flotsam-riffraff";
import { jetsamRiffraff } from "./076-jetsam-riffraff";

const notJetsam = createMockCharacter({
  id: "flotsam-riffraff-not-jetsam",
  name: "Not Jetsam",
  cost: 2,
  strength: 3,
  willpower: 3,
});

describe("Flotsam - Riffraff", () => {
  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [flotsamRiffraff],
      inkwell: flotsamRiffraff.cost,
    });

    expect(testEngine.asPlayerOne().playCard(flotsamRiffraff)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(flotsamRiffraff)).toBe("play");
  });

  describe("EERIE PAIR — Your characters named Jetsam get +3 {S}.", () => {
    it("gives Jetsam characters +3 strength while Flotsam is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [flotsamRiffraff, jetsamRiffraff],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(jetsamRiffraff)).toBe(
        jetsamRiffraff.strength + 3,
      );
    });

    it("does not give +3 strength to non-Jetsam characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [flotsamRiffraff, notJetsam],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(notJetsam)).toBe(notJetsam.strength);
    });

    it("Flotsam itself does not get +3 strength from EERIE PAIR", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [flotsamRiffraff],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(flotsamRiffraff)).toBe(
        flotsamRiffraff.strength,
      );
    });

    it("Jetsam without Flotsam in play has base strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [jetsamRiffraff],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().getCardStrength(jetsamRiffraff)).toBe(
        jetsamRiffraff.strength,
      );
    });
  });
});
