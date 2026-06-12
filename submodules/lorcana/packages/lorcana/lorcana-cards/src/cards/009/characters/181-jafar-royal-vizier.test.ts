import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jafarRoyalVizier } from "./181-jafar-royal-vizier";

const nonEvasiveDefender = createMockCharacter({
  id: "jafar-royal-vizier-non-evasive-defender",
  name: "Non-Evasive Defender",
  cost: 3,
  strength: 2,
  willpower: 4,
});

const evasiveDefender = createMockCharacter({
  id: "jafar-royal-vizier-evasive-defender",
  name: "Evasive Defender",
  cost: 3,
  strength: 2,
  willpower: 4,
  abilities: [
    {
      id: "jafar-royal-vizier-evasive-kw",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

const nonEvasiveAttacker = createMockCharacter({
  id: "jafar-royal-vizier-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 2,
});

describe("Jafar - Royal Vizier (set 009)", () => {
  describe("I DON'T TRUST HIM, SIRE — During your turn, this character gains Evasive.", () => {
    it("has Evasive during your own turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jafarRoyalVizier, exerted: true }],
          deck: 1,
        },
        {
          play: [nonEvasiveAttacker],
          deck: 1,
        },
      );

      // During player one's turn, Jafar has Evasive — non-Evasive attacker from opponent cannot challenge him
      expect(testEngine.asPlayerTwo().canChallenge(nonEvasiveAttacker, jafarRoyalVizier)).toBe(
        false,
      );
    });

    it("loses Evasive during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jafarRoyalVizier, exerted: true }],
          deck: 1,
        },
        {
          play: [nonEvasiveAttacker],
          deck: 1,
        },
      );

      // Pass to opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // During player two's turn, Jafar no longer has Evasive
      expect(testEngine.asPlayerTwo().canChallenge(nonEvasiveAttacker, jafarRoyalVizier)).toBe(
        true,
      );
    });

    it("can challenge Evasive characters during your own turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jafarRoyalVizier, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: evasiveDefender, exerted: true }],
          deck: 1,
        },
      );

      // Jafar gains Evasive on player one's turn, so he can challenge the Evasive defender
      expect(testEngine.asPlayerOne().canChallenge(jafarRoyalVizier, evasiveDefender)).toBe(true);
    });

    it("cannot challenge Evasive characters during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: evasiveDefender, exerted: true }],
          deck: 1,
        },
        {
          play: [{ card: jafarRoyalVizier, isDrying: false }],
          deck: 1,
        },
      );

      // During player two's turn Jafar does NOT have Evasive
      // so he cannot challenge an Evasive character
      expect(testEngine.asPlayerTwo().canChallenge(jafarRoyalVizier, evasiveDefender)).toBe(false);
    });

    it("can challenge non-Evasive characters both on own and opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jafarRoyalVizier, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: nonEvasiveDefender, exerted: true }],
          deck: 1,
        },
      );

      // Jafar can always challenge non-Evasive characters
      expect(testEngine.asPlayerOne().canChallenge(jafarRoyalVizier, nonEvasiveDefender)).toBe(
        true,
      );
    });
  });
});
