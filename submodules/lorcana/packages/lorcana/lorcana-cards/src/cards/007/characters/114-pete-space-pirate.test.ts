import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  createMockSong,
  LorcanaMultiplayerTestEngine,
} from "@tcg/lorcana-engine/testing";
import { peteSpacePirate } from "./114-pete-space-pirate";

const pirateCharacter = createMockCharacter({
  id: "pete-test-pirate",
  name: "Kakamora",
  version: "Band of Pirates",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Villain", "Pirate"],
});

const nonPirateCharacter = createMockCharacter({
  id: "pete-test-non-pirate",
  name: "Mickey Mouse",
  version: "Giant Mouse",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  classifications: ["Storyborn", "Hero"],
});

const song = createMockSong({
  id: "pete-test-song",
  name: "Test Song",
  cost: 2,
  text: "A test song",
});

describe("Pete - Space Pirate", () => {
  it("has Shift 4", () => {
    expect(peteSpacePirate.abilities).toBeDefined();
    const shiftAbility = peteSpacePirate.abilities?.find(
      (a) => a.type === "keyword" && a.keyword === "Shift",
    );
    expect(shiftAbility).toBeDefined();
  });

  describe("FRIGHTFUL SCHEME - While this character is exerted, opposing characters can't exert to sing songs", () => {
    it("opposing characters can sing when Pete is not exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [peteSpacePirate],
          deck: 1,
        },
        {
          play: [nonPirateCharacter],
          hand: [song],
          deck: 1,
        },
      );

      // Pete is not exerted, so opponent should be able to sing
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().singSong(song, nonPirateCharacter)).toBeSuccessfulCommand();
    });

    it("opposing characters can't sing when Pete is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [peteSpacePirate],
          deck: 1,
        },
        {
          play: [nonPirateCharacter],
          hand: [song],
          deck: 1,
        },
      );

      // Exert Pete
      const peteId = testEngine.findCardInstanceId(peteSpacePirate, "play");
      testEngine.manualExertCard(peteId);

      // Opponent should not be able to sing
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const result = testEngine.asPlayerTwo().singSong(song, nonPirateCharacter);
      expect(result.success).toBe(false);
    });
  });

  describe("FRIGHTFUL SCHEME - While this character is exerted, your Pirate characters gain Resist +1", () => {
    it("pirate characters do not have Resist when Pete is not exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peteSpacePirate, pirateCharacter],
      });

      expect(testEngine.hasKeyword(pirateCharacter, "Resist")).toBe(false);
      expect(testEngine.hasKeyword(peteSpacePirate, "Resist")).toBe(false);
    });

    it("your pirate characters gain Resist +1 when Pete is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peteSpacePirate, pirateCharacter],
      });

      const peteId = testEngine.findCardInstanceId(peteSpacePirate, "play");
      testEngine.manualExertCard(peteId);

      expect(testEngine.hasKeyword(pirateCharacter, "Resist")).toBe(true);
      expect(testEngine.getKeywordValue(pirateCharacter, "Resist")).toBe(1);

      // Pete himself is a Pirate, so he also gains Resist
      expect(testEngine.hasKeyword(peteSpacePirate, "Resist")).toBe(true);
      expect(testEngine.getKeywordValue(peteSpacePirate, "Resist")).toBe(1);
    });

    it("non-pirate characters do not gain Resist when Pete is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peteSpacePirate, nonPirateCharacter],
      });

      const peteId = testEngine.findCardInstanceId(peteSpacePirate, "play");
      testEngine.manualExertCard(peteId);

      expect(testEngine.hasKeyword(nonPirateCharacter, "Resist")).toBe(false);
    });
  });

  describe("FRIGHTFUL SCHEME - Regression: prevents singing when Pete is exerted via questing", () => {
    it("regression: opposing characters can't sing after Pete quests and becomes exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: peteSpacePirate, isDrying: false }],
          deck: 2,
        },
        {
          play: [nonPirateCharacter],
          hand: [song],
          deck: 2,
        },
      );

      // Pete quests - becomes exerted
      expect(testEngine.asPlayerOne().quest(peteSpacePirate)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(peteSpacePirate)).toBe(true);

      // Opponent should not be able to sing
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      const result = testEngine.asPlayerTwo().singSong(song, nonPirateCharacter);
      expect(result.success).toBe(false);
    });
  });

  describe("Regression", () => {
    it("Pete applies Resist to itself while challenging", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [peteSpacePirate],
          deck: 1,
        },
        {
          play: [pirateCharacter],
          deck: 1,
        },
      );

      // Exert defender so it can be challenged
      const defenderId = testEngine.findCardInstanceId(pirateCharacter, "play", "player_two");
      testEngine.manualExertCard(defenderId);

      // Challenge - Pete will become exerted during the challenge
      expect(
        testEngine.asPlayerOne().challenge(peteSpacePirate, pirateCharacter),
      ).toBeSuccessfulCommand();

      // Pete is now exerted and a Pirate, so he should have Resist +1
      // Therefore damage taken = pirate strength (3) - resist (1) = 2
      expect(testEngine.asPlayerOne().getDamage(peteSpacePirate)).toBe(
        pirateCharacter.strength - 1,
      );
    });
  });
});
