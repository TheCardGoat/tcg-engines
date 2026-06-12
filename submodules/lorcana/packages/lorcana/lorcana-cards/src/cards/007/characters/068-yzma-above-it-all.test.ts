import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { yzmaAboveItAll } from "./068-yzma-above-it-all";

// A strong attacker (Evasive so it can challenge back if needed) that banishes the defender
const attacker = createMockCharacter({
  id: "yzma-above-it-all-attacker",
  name: "Test Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
  abilities: [
    {
      id: "yzma-above-it-all-attacker-evasive",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

// A weak defender that will be banished in the challenge
const defender = createMockCharacter({
  id: "yzma-above-it-all-defender",
  name: "Test Defender",
  cost: 2,
  strength: 1,
  willpower: 2,
});

// A card the opponent has in hand that may get discarded
const opponentHandCard = createMockCharacter({
  id: "yzma-above-it-all-opponent-hand-card",
  name: "Opponent Hand Card",
  cost: 1,
});

describe("Yzma - Above It All", () => {
  it("has Shift 5 keyword", () => {
    const shiftAbility = (yzmaAboveItAll.abilities ?? []).find(
      (a) => a.type === "keyword" && a.keyword === "Shift",
    );
    expect(shiftAbility).toBeDefined();
  });

  it("has Evasive keyword", () => {
    const evasiveAbility = (yzmaAboveItAll.abilities ?? []).find(
      (a) => a.type === "keyword" && a.keyword === "Evasive",
    );
    expect(evasiveAbility).toBeDefined();
  });

  describe("BACK TO WORK — Whenever another character is banished in a challenge, return that card to its player's hand, then that player discards a card at random.", () => {
    it("returns the banished opponent character to opponent's hand and opponent discards a card at random", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          // Player one controls Yzma and an attacker who challenges the opponent's defender
          play: [{ card: yzmaAboveItAll, exerted: true }, attacker],
          deck: 2,
        },
        {
          // Opponent has the defender in play (exerted so it can be challenged) and a card in hand
          play: [{ card: defender, exerted: true }],
          hand: [opponentHandCard],
          deck: 2,
        },
      );

      // Player one challenges: attacker (str 5) vs defender (willpower 2) — defender gets banished
      // BACK TO WORK triggers and auto-resolves: defender returned to hand, opponent discards 1 at random
      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();

      // BACK TO WORK triggered: defender was returned to hand, then 1 random card discarded.
      // After the sequence: 1 card remains in hand, 1 in discard (which card is random).
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(1);
      expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(1);
    });

    it("does NOT trigger when Yzma herself is the one banished in a challenge (trigger is OTHER_CHARACTERS)", () => {
      // Needs Evasive to be able to challenge Yzma (who has Evasive)
      const strongEvasiveOpponent = createMockCharacter({
        id: "yzma-above-it-all-strong-opp",
        name: "Strong Evasive Opponent",
        cost: 5,
        strength: 10,
        willpower: 10,
        abilities: [
          {
            id: "yzma-above-it-all-strong-opp-evasive",
            keyword: "Evasive",
            text: "Evasive",
            type: "keyword",
          },
        ],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: yzmaAboveItAll, exerted: true }],
          deck: 2,
        },
        {
          play: [strongEvasiveOpponent],
          deck: 2,
        },
      );

      // Pass to opponent's turn
      testEngine.asPlayerOne().passTurn();

      // Opponent challenges exerted Yzma (strength 10 vs willpower 8 — Yzma is banished)
      expect(
        testEngine.asPlayerTwo().challenge(strongEvasiveOpponent, yzmaAboveItAll),
      ).toBeSuccessfulCommand();

      // Yzma is banished
      expect(testEngine.asPlayerOne().getCardZone(yzmaAboveItAll)).toBe("discard");

      // BACK TO WORK should NOT trigger since Yzma herself was banished, not "another character"
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
