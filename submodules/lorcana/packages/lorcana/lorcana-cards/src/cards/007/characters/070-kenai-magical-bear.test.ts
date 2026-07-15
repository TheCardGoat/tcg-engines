import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kenaiMagicalBear } from "./070-kenai-magical-bear";

const strongOpponent = createMockCharacter({
  id: "kenai-magical-bear-strong-opponent",
  name: "Strong Opponent",
  cost: 4,
  strength: 10,
  willpower: 10,
});

const weakOpponent = createMockCharacter({
  id: "kenai-magical-bear-weak-opponent",
  name: "Weak Opponent",
  cost: 1,
  strength: 0,
  willpower: 1,
});

describe("Kenai - Magical Bear", () => {
  it("has Challenger +2 keyword", () => {
    const challengerAbility = (kenaiMagicalBear.abilities ?? []).find(
      (a) => a.type === "keyword" && a.keyword === "Challenger",
    );
    expect(challengerAbility).toBeDefined();
    expect(challengerAbility).toMatchObject({
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    });
  });

  describe("WISDOM OF HIS STORY — During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.", () => {
    it("returns Kenai to hand and grants 1 lore when he is banished in a challenge during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          // Kenai challenges the strong opponent and gets banished (str 1+2=3 vs willpower 10 for strong opp, but str 10 kills kenai's willpower 4)
          play: [kenaiMagicalBear],
          deck: 5,
        },
        {
          play: [{ card: strongOpponent, exerted: true }],
          deck: 5,
        },
      );

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().challenge(kenaiMagicalBear, strongOpponent),
      ).toBeSuccessfulCommand();

      // Kenai should be banished (4 willpower vs 10 strength)
      expect(testEngine.asPlayerOne().getCardZone(kenaiMagicalBear)).toBe("hand");

      // Gain 1 lore
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("does NOT trigger when Kenai is banished outside of a challenge (e.g. by damage counter)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kenaiMagicalBear],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      // Manually set damage to banish Kenai outside of a challenge
      expect(
        testEngine.asServer().manualSetDamage(kenaiMagicalBear, kenaiMagicalBear.willpower),
      ).toBeSuccessfulCommand();

      // Kenai should be banished to discard (not hand)
      expect(testEngine.asPlayerOne().getCardZone(kenaiMagicalBear)).toBe("discard");

      // No lore gained
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore);
    });

    it("does NOT trigger when Kenai is banished as a defender (opponent's turn)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kenaiMagicalBear, exerted: true }],
          deck: 5,
        },
        {
          play: [strongOpponent],
          deck: 5,
        },
      );

      // Pass to opponent's turn
      testEngine.asPlayerOne().passTurn();

      const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);

      // Opponent challenges exerted Kenai
      expect(
        testEngine.asPlayerTwo().challenge(strongOpponent, kenaiMagicalBear),
      ).toBeSuccessfulCommand();

      // Kenai should go to discard (not hand) — trigger doesn't fire on opponent's turn
      expect(testEngine.asPlayerOne().getCardZone(kenaiMagicalBear)).toBe("discard");

      // No lore gained for player one
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(loreBefore);
    });

    it("triggers when Kenai is banished as an attacker during your turn", () => {
      // Kenai has willpower 4; strongOpponent has str 10 — Kenai dies as attacker too
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [kenaiMagicalBear],
          deck: 5,
        },
        {
          play: [{ card: strongOpponent, exerted: true }],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(kenaiMagicalBear, strongOpponent),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(kenaiMagicalBear)).toBe("hand");
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });
  });
});
