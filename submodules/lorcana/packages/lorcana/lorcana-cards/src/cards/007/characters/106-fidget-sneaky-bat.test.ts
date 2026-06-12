import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { fidgetSneakyBat } from "./106-fidget-sneaky-bat";

const anotherCharacter = createMockCharacter({
  id: "fidget-test-ally",
  name: "Test Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Fidget - Sneaky Bat", () => {
  it("should have Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [fidgetSneakyBat],
      deck: 3,
    });

    expect(testEngine.hasKeyword(fidgetSneakyBat, "Evasive")).toBe(true);
  });

  describe("I TOOK CARE OF EVERYTHING — Whenever this character quests, another chosen character of yours gains Evasive until the start of your next turn.", () => {
    it("chosen ally gains Evasive after Fidget quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: fidgetSneakyBat, isDrying: false }, anotherCharacter],
        deck: 3,
      });

      expect(testEngine.hasKeyword(anotherCharacter, "Evasive")).toBe(false);

      expect(testEngine.asPlayerOne().quest(fidgetSneakyBat)).toBeSuccessfulCommand();

      // Triggered ability creates a bag effect requiring a chosen character
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      const allyId = testEngine.findCardInstanceId(anotherCharacter, "play", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fidgetSneakyBat, {
          targets: [allyId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(anotherCharacter, "Evasive")).toBe(true);
    });

    it("Evasive expires at the start of the controller's next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: fidgetSneakyBat, isDrying: false }, anotherCharacter],
          deck: 3,
        },
        {
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().quest(fidgetSneakyBat)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      const allyId = testEngine.findCardInstanceId(anotherCharacter, "play", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fidgetSneakyBat, {
          targets: [allyId],
        }),
      ).toBeSuccessfulCommand();

      // Ally has Evasive during player one's turn
      expect(testEngine.hasKeyword(anotherCharacter, "Evasive")).toBe(true);

      // Pass player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // During player two's turn, ally should still have Evasive
      expect(testEngine.hasKeyword(anotherCharacter, "Evasive")).toBe(true);

      // Pass player two's turn — now it's the start of player one's next turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Evasive should have expired at the start of player one's next turn
      expect(testEngine.hasKeyword(anotherCharacter, "Evasive")).toBe(false);
    });

    it("Fidget itself cannot be chosen as the target (another character only)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: fidgetSneakyBat, isDrying: false }],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(fidgetSneakyBat)).toBeSuccessfulCommand();

      // No valid targets (only Fidget is in play, which is excluded as "another" character)
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      // No bag effects should exist when there are no valid targets
      expect(bagEffects.length).toBe(0);
    });
  });
});
