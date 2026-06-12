import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { crikeeGoodLuckCharm } from "./142-cri-kee-good-luck-charm";

const evasiveDefender = createMockCharacter({
  id: "cri-kee-evasive-defender",
  name: "Evasive Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "cri-kee-evasive-defender-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

describe("Cri-Kee - Good Luck Charm", () => {
  describe("Alert", () => {
    it("has Alert printed on the card", () => {
      const testEngine = new LorcanaTestEngine({
        play: [crikeeGoodLuckCharm],
      });

      const cardUnderTest = testEngine.getCardModel(crikeeGoodLuckCharm);

      expect(cardUnderTest.hasAlert()).toBe(true);
    });

    it("can challenge an Evasive character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: crikeeGoodLuckCharm, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: evasiveDefender, exerted: true, isDrying: false }],
        },
      );

      expect(testEngine.asPlayerOne().canChallenge(crikeeGoodLuckCharm, evasiveDefender)).toBe(
        true,
      );
    });
  });

  describe("Stats and basic properties", () => {
    it("has the expected printed stats and metadata", () => {
      expect(crikeeGoodLuckCharm.strength).toBe(3);
      expect(crikeeGoodLuckCharm.willpower).toBe(2);
      expect(crikeeGoodLuckCharm.lore).toBe(1);
      expect(crikeeGoodLuckCharm.cost).toBe(2);
      expect(crikeeGoodLuckCharm.inkable).toBe(true);
      expect(crikeeGoodLuckCharm.classifications).toEqual(["Storyborn", "Ally"]);
      expect(crikeeGoodLuckCharm.inkType).toEqual(["sapphire"]);
      expect(crikeeGoodLuckCharm.rarity).toBe("common");
    });
  });
});
