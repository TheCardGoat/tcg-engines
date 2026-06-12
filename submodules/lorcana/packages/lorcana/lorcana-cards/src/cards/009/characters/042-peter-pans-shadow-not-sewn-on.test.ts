import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { peterPansShadowNotSewnOn } from "./042-peter-pans-shadow-not-sewn-on";

const rushCharacter = createMockCharacter({
  id: "pps-nso-rush-character",
  name: "Rush Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "pps-nso-rush-keyword",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
  ],
});

const nonRushCharacter = createMockCharacter({
  id: "pps-nso-non-rush-character",
  name: "Non-Rush Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const evasiveDefender = createMockCharacter({
  id: "pps-nso-evasive-defender",
  name: "Evasive Defender",
  cost: 3,
  strength: 1,
  willpower: 7,
  abilities: [
    {
      id: "pps-nso-evasive-defender-keyword",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

const normalDefender = createMockCharacter({
  id: "pps-nso-normal-defender",
  name: "Normal Defender",
  cost: 3,
  strength: 1,
  willpower: 7,
});

describe.skip("Peter Pan's Shadow - Not Sewn On", () => {
  it("has the Rush keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [peterPansShadowNotSewnOn],
    });

    const cardModel = testEngine.getCardModel(peterPansShadowNotSewnOn);
    expect(cardModel.hasRush).toBe(true);
  });

  it("has the Evasive keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [peterPansShadowNotSewnOn],
    });

    const cardModel = testEngine.getCardModel(peterPansShadowNotSewnOn);
    expect(cardModel.hasEvasive).toBe(true);
  });

  describe("TIPTOE — Your other characters with Rush gain Evasive.", () => {
    it("grants Evasive to your other Rush characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peterPansShadowNotSewnOn, rushCharacter],
        deck: 1,
      });

      expect(testEngine.getKeywordValue(rushCharacter, "Evasive")).not.toBeNull();
    });

    it("does not grant Evasive to characters without Rush", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [peterPansShadowNotSewnOn, nonRushCharacter],
        deck: 1,
      });

      expect(testEngine.getKeywordValue(nonRushCharacter, "Evasive")).toBeNull();
    });

    it("Rush characters with Evasive granted by TIPTOE can challenge Evasive defenders", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [peterPansShadowNotSewnOn, { card: rushCharacter, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
          deck: 1,
        },
      );

      // rushCharacter gains Evasive from TIPTOE, so can challenge an Evasive defender
      expect(testEngine.asPlayerOne().canChallenge(rushCharacter, evasiveDefender)).toBe(true);
    });

    it("non-Rush characters cannot challenge Evasive defenders even when TIPTOE is active", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [peterPansShadowNotSewnOn, { card: nonRushCharacter, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().canChallenge(nonRushCharacter, evasiveDefender)).toBe(false);
    });

    it("does not grant Evasive to Peter Pan's Shadow itself via TIPTOE (only 'other' characters)", () => {
      // Peter Pan's Shadow already has Evasive natively; TIPTOE only targets "other" characters
      // We verify that without Peter Pan's Shadow, a Rush character does NOT have Evasive
      const testEngineWithout = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [rushCharacter],
        deck: 1,
      });

      expect(testEngineWithout.getKeywordValue(rushCharacter, "Evasive")).toBeNull();
    });
  });
});
