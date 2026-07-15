import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { teKElementalTerror } from "./054-te-k-elemental-terror";

const opponentCharA = createMockCharacter({
  id: "teka-et-opponent-a",
  name: "Opponent Char A",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const opponentCharB = createMockCharacter({
  id: "teka-et-opponent-b",
  name: "Opponent Char B",
  cost: 2,
  strength: 1,
  willpower: 2,
});

// A mock character that exerts an opponent's character when it quests
const exerterCharacter = createMockCharacter({
  id: "teka-et-exerter",
  name: "Exerter Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "teka-et-exerter-ability",
      name: "EXERT OPPONENT",
      text: "Whenever this character quests, exert chosen opposing character.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "exert",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});

describe("Te Kā - Elemental Terror", () => {
  it("has Shift 7 keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [teKElementalTerror],
    });
    expect(testEngine.asPlayerOne().hasKeyword(teKElementalTerror, "Shift")).toBe(true);
  });

  describe("ANCIENT RAGE - During your turn, whenever an opposing character is exerted, banish them.", () => {
    it("banishes an opposing character that is exerted during your turn via a triggered exert ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [teKElementalTerror, exerterCharacter],
          deck: 3,
        },
        {
          play: [opponentCharA, opponentCharB],
          deck: 3,
        },
      );

      // Player one quests exerterCharacter — triggers EXERT OPPONENT
      expect(testEngine.asPlayerOne().quest(exerterCharacter)).toBeSuccessfulCommand();

      // Resolve the exert bag — choose opponentCharA
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(exerterCharacter, { targets: [opponentCharA] }),
      ).toBeSuccessfulCommand();

      // opponentCharA is now exerted during player one's turn
      // ANCIENT RAGE auto-resolved: banished opponentCharA
      expect(testEngine.asPlayerOne().getCardZone(opponentCharA)).toBe("discard");

      // opponentCharB should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharB)).toBe("play");
    });

    it("does NOT banish an opposing character that is exerted during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [teKElementalTerror],
          deck: 3,
        },
        {
          play: [opponentCharA],
          deck: 3,
        },
      );

      // Pass to player two's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two quests opponentCharA (exerts it) — this is opponent's turn, NOT player one's
      expect(testEngine.asPlayerTwo().quest(opponentCharA)).toBeSuccessfulCommand();

      // ANCIENT RAGE should NOT trigger — it's not player one's turn
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharA)).toBe("play");
    });
  });
});
