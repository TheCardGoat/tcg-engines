import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { syndromeEvilInventor } from "./143-syndrome-evil-inventor";

const evasiveDefender = createMockCharacter({
  id: "syndrome-evasive-defender",
  name: "Evasive Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "syndrome-evasive-defender-evasive",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
});

describe("Syndrome - Evil Inventor", () => {
  describe("Alert (This character can challenge as if they had Evasive.)", () => {
    it("should have the Alert keyword ability", () => {
      const testEngine = new LorcanaTestEngine({
        play: [syndromeEvilInventor],
      });

      const cardUnderTest = testEngine.getCardModel(syndromeEvilInventor);
      expect(cardUnderTest.hasAlert()).toBe(true);
    });

    it("can challenge an opposing Evasive character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: syndromeEvilInventor, isDrying: false }],
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(syndromeEvilInventor, evasiveDefender),
      ).toBeSuccessfulCommand();
    });
  });
});
