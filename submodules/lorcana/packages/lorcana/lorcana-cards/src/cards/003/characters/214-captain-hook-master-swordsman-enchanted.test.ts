import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { captainHookMasterSwordsmanEnchanted } from "./214-captain-hook-master-swordsman-enchanted";
import { peterPanNeverLanding } from "../../001";

const evasiveGrantor = createMockCharacter({
  id: "hook-test-evasive-grantor",
  name: "Evasive Grantor",
  cost: 1,
  abilities: [
    {
      id: "hook-test-evasive-grantor-ability",
      type: "static",
      text: "Characters named Peter Pan gain Evasive.",
      effect: {
        keyword: "Evasive",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "has-name", name: "Peter Pan" }],
        },
        type: "gain-keyword",
      },
    },
  ],
});

const peterPanMock = createMockCharacter({
  id: "hook-test-peter-pan",
  name: "Peter Pan",
  cost: 1,
});

const nonPeterPanEvasive = createMockCharacter({
  id: "hook-test-non-peter-pan",
  name: "Evasive Guy",
  cost: 2,
  abilities: [
    {
      id: "hook-test-non-peter-pan-ability",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
});

describe("Captain Hook - Master Swordsman (Enchanted)", () => {
  describe("MAN-TO-MAN - Characters named Peter Pan lose Evasive and can't gain Evasive.", () => {
    it("removes Evasive from Peter Pan characters while Captain Hook is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [captainHookMasterSwordsmanEnchanted],
          deck: 1,
        },
        {
          play: [peterPanNeverLanding],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerTwo().hasKeyword(peterPanNeverLanding, "Evasive")).toBe(false);
    });

    it("prevents Peter Pan characters from gaining Evasive from another source", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [captainHookMasterSwordsmanEnchanted, evasiveGrantor],
          deck: 1,
        },
        {
          play: [peterPanMock],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerTwo().hasKeyword(peterPanMock, "Evasive")).toBe(false);
    });

    it("does not remove Evasive from non-Peter Pan characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [captainHookMasterSwordsmanEnchanted],
          deck: 1,
        },
        {
          play: [nonPeterPanEvasive],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerTwo().hasKeyword(nonPeterPanEvasive, "Evasive")).toBe(true);
    });
  });
});
