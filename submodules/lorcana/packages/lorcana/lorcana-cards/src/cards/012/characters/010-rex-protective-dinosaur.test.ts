import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { rexProtectiveDinosaur } from "./010-rex-protective-dinosaur";

const strongOpponent = createMockCharacter({
  id: "rex-strong-opponent",
  name: "Strong Opponent",
  cost: 4,
  strength: 5,
  willpower: 4,
  lore: 1,
});

describe("Rex - Protective Dinosaur", () => {
  describe("Bodyguard", () => {
    it("has the Bodyguard keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [rexProtectiveDinosaur],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(rexProtectiveDinosaur, "Bodyguard")).toBe(true);
    });

    it("forces opponent to challenge Rex first when Rex is exerted (R25)", () => {
      const otherDefender = createMockCharacter({
        id: "rex-other-defender",
        name: "Other Defender",
        cost: 2,
        strength: 1,
        willpower: 4,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: rexProtectiveDinosaur, exerted: true },
            { card: otherDefender, exerted: true },
          ],
          deck: 5,
        },
        {
          play: [strongOpponent],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Attempting to challenge the non-Bodyguard character must fail
      // because Rex (exerted Bodyguard) is a mandatory target.
      const result = testEngine.asPlayerTwo().challenge(strongOpponent, otherDefender);
      expect(result).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(otherDefender)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(rexProtectiveDinosaur)).toBe("play");
    });
  });

  describe("RUN AWAY! - During an opponent's turn, when this character is banished, gain 1 lore.", () => {
    it("gains 1 lore when banished during an opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: rexProtectiveDinosaur, exerted: true }],
          deck: 5,
        },
        {
          play: [strongOpponent],
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(strongOpponent, rexProtectiveDinosaur),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rexProtectiveDinosaur),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
      expect(testEngine.asPlayerOne().getCardZone(rexProtectiveDinosaur)).toBe("discard");
    });

    it("does NOT trigger when banished during your own turn", () => {
      const exertedOpponent = createMockCharacter({
        id: "rex-exerted-opp",
        name: "Exerted Opponent",
        cost: 3,
        strength: 5,
        willpower: 1,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rexProtectiveDinosaur],
          deck: 5,
        },
        {
          play: [{ card: exertedOpponent, exerted: true }],
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      // Player one challenges during their own turn; Rex dies in the challenge
      // (5 strength vs 1 willpower -> Rex banished; 3 strength vs 1 willpower -> opponent banished)
      expect(
        testEngine.asPlayerOne().challenge(rexProtectiveDinosaur, exertedOpponent),
      ).toBeSuccessfulCommand();

      // Rex is discarded, no lore gained, no pending trigger
      expect(testEngine.asPlayerOne().getCardZone(rexProtectiveDinosaur)).toBe("discard");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
