import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { flynnRiderHisOwnBiggestFan } from "./082-flynn-rider-his-own-biggest-fan";

const opponentHandCard1 = createMockCharacter({
  id: "flynn-fan-opp-hand-1",
  name: "Opponent Hand Card 1",
  cost: 1,
});

const opponentHandCard2 = createMockCharacter({
  id: "flynn-fan-opp-hand-2",
  name: "Opponent Hand Card 2",
  cost: 1,
});

const opponentHandCard3 = createMockCharacter({
  id: "flynn-fan-opp-hand-3",
  name: "Opponent Hand Card 3",
  cost: 1,
});

const opponentHandCard4 = createMockCharacter({
  id: "flynn-fan-opp-hand-4",
  name: "Opponent Hand Card 4",
  cost: 1,
});

describe("Flynn Rider - His Own Biggest Fan", () => {
  it("has Shift 2", () => {
    expect(
      flynnRiderHisOwnBiggestFan.abilities!.some(
        (ability) => ability.type === "keyword" && ability.keyword === "Shift",
      ),
    ).toBe(true);
  });

  it("has Evasive", () => {
    expect(
      flynnRiderHisOwnBiggestFan.abilities!.some(
        (ability) => ability.type === "keyword" && ability.keyword === "Evasive",
      ),
    ).toBe(true);
  });

  describe("ONE LAST, BIG SCORE: This character gets -1 lore for each card in your opponents' hands.", () => {
    it("has full lore (4) when opponent has zero cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [flynnRiderHisOwnBiggestFan],
        },
        {
          hand: [],
          deck: 1,
        },
      );

      expect(testEngine.asServer().getCardLore(flynnRiderHisOwnBiggestFan)).toBe(4);
      expect(testEngine.asPlayerOne().getCardLore(flynnRiderHisOwnBiggestFan)).toBe(4);
    });

    it("has 3 lore when opponent has 1 card in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [flynnRiderHisOwnBiggestFan],
        },
        {
          hand: [opponentHandCard1],
          deck: 1,
        },
      );

      expect(testEngine.asServer().getCardLore(flynnRiderHisOwnBiggestFan)).toBe(3);
      expect(testEngine.asPlayerTwo().getCardLore(flynnRiderHisOwnBiggestFan)).toBe(3);
    });

    it("has 2 lore when opponent has 2 cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [flynnRiderHisOwnBiggestFan],
        },
        {
          hand: [opponentHandCard1, opponentHandCard2],
          deck: 1,
        },
      );

      expect(testEngine.asServer().getCardLore(flynnRiderHisOwnBiggestFan)).toBe(2);
    });

    it("has 0 lore when opponent has 4 or more cards in hand (minimum 0)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [flynnRiderHisOwnBiggestFan],
        },
        {
          hand: [opponentHandCard1, opponentHandCard2, opponentHandCard3, opponentHandCard4],
          deck: 1,
        },
      );

      expect(testEngine.asServer().getCardLore(flynnRiderHisOwnBiggestFan)).toBe(0);
    });
  });
});
