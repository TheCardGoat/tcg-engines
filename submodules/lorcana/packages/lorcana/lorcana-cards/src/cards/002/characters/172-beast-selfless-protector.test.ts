import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { beastSelflessProtector } from "./172-beast-selfless-protector";

const allyCharacter = createMockCharacter({
  id: "beast-shield-ally",
  name: "Beast Shield Ally",
  cost: 2,
  strength: 3,
  willpower: 4,
});

const opponentAttacker = createMockCharacter({
  id: "beast-shield-attacker",
  name: "Beast Shield Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
});

describe("Beast - Selfless Protector", () => {
  describe("SHIELD ANOTHER - Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead", () => {
    it("redirects challenge damage from an ally to Beast", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [beastSelflessProtector, { card: allyCharacter, exerted: true }],
        },
        {
          play: [opponentAttacker],
        },
      );

      // Pass turn to player two so they can challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Verify cards are set up correctly
      const allyCard = testEngine.asPlayerOne().getCard(allyCharacter);
      expect(allyCard.strength).toBe(3);

      // Opponent challenges the ally
      const challengeResult = testEngine.asPlayerTwo().challenge(opponentAttacker, allyCharacter);
      expect(challengeResult).toBeSuccessfulCommand();

      // Beast should have taken the damage instead of the ally
      expect(testEngine.asPlayerOne().getDamage(beastSelflessProtector)).toBe(
        opponentAttacker.strength,
      );
      expect(testEngine.asPlayerOne().getDamage(allyCharacter)).toBe(0);
    });

    it("does NOT redirect damage when Beast itself is challenged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: beastSelflessProtector, exerted: true }, allyCharacter],
        },
        {
          play: [opponentAttacker],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const challengeResult = testEngine
        .asPlayerTwo()
        .challenge(opponentAttacker, beastSelflessProtector);
      expect(challengeResult).toBeSuccessfulCommand();

      // Beast takes its own damage normally (not redirected to itself again)
      expect(testEngine.asPlayerOne().getDamage(beastSelflessProtector)).toBe(
        opponentAttacker.strength,
      );
      // Ally should have no damage
      expect(testEngine.asPlayerOne().getDamage(allyCharacter)).toBe(0);
    });

    it("redirects counter-damage from a challenge to Beast when your character attacks", () => {
      const opponentCharacter = createMockCharacter({
        id: "beast-shield-opponent-char",
        name: "Opponent Character",
        cost: 2,
        strength: 2,
        willpower: 6,
      });

      const playerAttacker = createMockCharacter({
        id: "beast-shield-player-attacker",
        name: "Player Attacker",
        cost: 3,
        strength: 4,
        willpower: 3,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [beastSelflessProtector, playerAttacker],
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
        },
      );

      // Player one challenges opponent's character
      const challengeResult = testEngine.asPlayerOne().challenge(playerAttacker, opponentCharacter);
      expect(challengeResult).toBeSuccessfulCommand();

      // Beast absorbs the counter-damage that would have gone to playerAttacker
      expect(testEngine.asPlayerOne().getDamage(beastSelflessProtector)).toBe(
        opponentCharacter.strength,
      );
      // The attacker should have no damage (redirected to Beast)
      expect(testEngine.asPlayerOne().getDamage(playerAttacker)).toBe(0);
      // Opponent's character takes normal damage from the attacker
      expect(testEngine.asPlayerTwo().getDamage(opponentCharacter)).toBe(playerAttacker.strength);
    });
  });
});
