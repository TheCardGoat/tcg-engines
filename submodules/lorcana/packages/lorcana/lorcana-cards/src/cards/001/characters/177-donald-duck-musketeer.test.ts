import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { donaldDuckMusketeer } from "./177-donald-duck-musketeer";
import { goofyMusketeer } from "./004-goofy-musketeer";
import { mickeyMouseMusketeer } from "./186-mickey-mouse-musketeer";
import { lefouBumbler } from "./008-lefou-bumbler";

const nonMusketeerCharacter = createMockCharacter({
  id: "non-musketeer-char",
  name: "Non Musketeer Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Donald Duck - Musketeer", () => {
  it("has Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [donaldDuckMusketeer],
      deck: 1,
    });

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: donaldDuckMusketeer,
      keyword: "Bodyguard",
    });
  });

  describe("STAY ALERT! — During your turn, your Musketeer characters gain Evasive.", () => {
    it("during your turn, Musketeer characters gain Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckMusketeer, mickeyMouseMusketeer, goofyMusketeer],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.hasKeyword(mickeyMouseMusketeer, "Evasive")).toBe(true);
      expect(testEngine.hasKeyword(goofyMusketeer, "Evasive")).toBe(true);
    });

    it("during your turn, Donald Duck himself gains Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckMusketeer],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.hasKeyword(donaldDuckMusketeer, "Evasive")).toBe(true);
    });

    it("during OPPONENT's turn, Musketeer characters do NOT gain Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckMusketeer, mickeyMouseMusketeer, goofyMusketeer],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      testEngine.asServer().passTurn();

      expect(testEngine.hasKeyword(mickeyMouseMusketeer, "Evasive")).toBe(false);
      expect(testEngine.hasKeyword(goofyMusketeer, "Evasive")).toBe(false);
    });

    it("non-Musketeer characters do NOT gain Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [donaldDuckMusketeer, lefouBumbler, nonMusketeerCharacter],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.hasKeyword(lefouBumbler, "Evasive")).toBe(false);
      expect(testEngine.hasKeyword(nonMusketeerCharacter, "Evasive")).toBe(false);
    });
  });
});
