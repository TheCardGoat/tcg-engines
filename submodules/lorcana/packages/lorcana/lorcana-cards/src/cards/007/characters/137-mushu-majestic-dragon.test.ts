import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mushuMajesticDragon } from "./137-mushu-majestic-dragon";

const attacker = createMockCharacter({
  id: "mushu-test-attacker",
  name: "Test Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

const defender = createMockCharacter({
  id: "mushu-test-defender",
  name: "Test Defender",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
});

const toughDefender = createMockCharacter({
  id: "mushu-test-tough-defender",
  name: "Tough Defender",
  cost: 3,
  strength: 1,
  willpower: 10,
  lore: 1,
});

const strongOpponent = createMockCharacter({
  id: "mushu-test-strong-opponent",
  name: "Strong Opponent",
  cost: 3,
  strength: 7,
  willpower: 5,
  lore: 1,
});

describe("Mushu - Majestic Dragon", () => {
  describe("INTIMIDATING AND AWE-INSPIRING - Whenever one of your characters challenges, they gain Resist +2 during that challenge.", () => {
    it("grants Resist +2 to a character that challenges, reducing damage taken", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mushuMajesticDragon, attacker],
        },
        {
          play: [{ card: defender, exerted: true }],
        },
      );

      // Attacker (3 str, 3 wp) challenges Defender (3 str, 2 wp)
      // Without Resist: attacker takes 3 damage (banished)
      // With Resist +2: attacker takes 3-2=1 damage (survives)
      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(attacker)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(defender)).toBe("discard");
      expect(testEngine.asPlayerOne().getDamage(attacker)).toBe(1);
      expect(testEngine.asPlayerOne().getKeywordValue(attacker, "Resist") ?? 0).toBe(0);
    });
  });

  describe("GUARDIAN OF LOST SOULS - During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.", () => {
    it("gains 2 lore when one of your characters banishes a character in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mushuMajesticDragon, attacker],
          lore: 0,
        },
        {
          play: [{ card: defender, exerted: true }],
        },
      );

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(defender)).toBe("discard");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
    });

    it("does not gain lore when the defender is not banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mushuMajesticDragon, attacker],
          lore: 0,
        },
        {
          play: [{ card: toughDefender, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().challenge(attacker, toughDefender)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(toughDefender)).toBe("play");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });

    it("does not gain lore during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mushuMajesticDragon, { card: attacker, exerted: true }],
          lore: 0,
        },
        {
          play: [strongOpponent],
          lore: 0,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerTwo().challenge(strongOpponent, attacker)).toBeSuccessfulCommand();
      // attacker is banished by opponent but the lore gain should NOT trigger because it's not player one's turn
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });
  });

  it("regression: does not gain lore when opponent's character banishes in a challenge during opponent's turn", () => {
    const weakAttacker = createMockCharacter({
      id: "mushu-test-weak-attacker",
      name: "Weak Attacker",
      cost: 1,
      strength: 1,
      willpower: 1,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mushuMajesticDragon, { card: weakAttacker, exerted: true }],
        lore: 0,
      },
      {
        play: [strongOpponent],
        lore: 0,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent's character banishes our weak attacker during opponent's turn
    expect(
      testEngine.asPlayerTwo().challenge(strongOpponent, weakAttacker),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(weakAttacker)).toBe("discard");

    // GUARDIAN OF LOST SOULS should NOT fire — it's opponent's turn, not ours
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
