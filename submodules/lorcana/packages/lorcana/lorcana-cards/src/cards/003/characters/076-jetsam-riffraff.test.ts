import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jetsamRiffraff } from "./076-jetsam-riffraff";
import { flotsamRiffraff } from "./072-flotsam-riffraff";

const notFlotsam = createMockCharacter({
  id: "jetsam-riffraff-not-flotsam",
  name: "Not Flotsam",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Jetsam - Riffraff", () => {
  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [jetsamRiffraff],
      inkwell: jetsamRiffraff.cost,
    });

    expect(testEngine.asPlayerOne().playCard(jetsamRiffraff)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(jetsamRiffraff)).toBe("play");
  });

  it("has Ward keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [jetsamRiffraff],
      deck: 3,
    });

    expect(testEngine.hasKeyword(jetsamRiffraff, "Ward")).toBe(true);
  });

  describe("EERIE PAIR — Your characters named Flotsam gain Ward.", () => {
    it("gives Ward to Flotsam characters while Jetsam is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [jetsamRiffraff, flotsamRiffraff],
        deck: 5,
      });

      expect(testEngine.hasKeyword(flotsamRiffraff, "Ward")).toBe(true);
    });

    it("does not give Ward to non-Flotsam characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [jetsamRiffraff, notFlotsam],
        deck: 5,
      });

      expect(testEngine.hasKeyword(notFlotsam, "Ward")).toBe(false);
    });

    it("Flotsam without Jetsam in play does not have Ward from EERIE PAIR", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [flotsamRiffraff],
        deck: 5,
      });

      expect(testEngine.hasKeyword(flotsamRiffraff, "Ward")).toBe(false);
    });

    it("Jetsam itself has Ward from its own keyword, not EERIE PAIR", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [jetsamRiffraff],
        deck: 5,
      });

      expect(testEngine.hasKeyword(jetsamRiffraff, "Ward")).toBe(true);
    });
  });
});
