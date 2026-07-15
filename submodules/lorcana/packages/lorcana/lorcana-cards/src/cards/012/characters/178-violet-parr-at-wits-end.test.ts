import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { violetParrAtWitsEnd } from "./178-violet-parr-at-wits-end";

const evasiveDefender = createMockCharacter({
  id: "violet-parr-evasive-defender",
  name: "Evasive Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "violet-parr-evasive-defender-evasive",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
});

describe("Violet Parr - At Wits' End", () => {
  describe("Alert (This character can challenge as if they had Evasive.)", () => {
    it("should have the Alert keyword ability", () => {
      const testEngine = new LorcanaTestEngine({
        play: [violetParrAtWitsEnd],
      });

      const cardUnderTest = testEngine.getCardModel(violetParrAtWitsEnd);
      expect(cardUnderTest.hasAlert()).toBe(true);
    });

    it("can challenge an opposing Evasive character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: violetParrAtWitsEnd, isDrying: false }],
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(violetParrAtWitsEnd, evasiveDefender),
      ).toBeSuccessfulCommand();
    });
  });
});
