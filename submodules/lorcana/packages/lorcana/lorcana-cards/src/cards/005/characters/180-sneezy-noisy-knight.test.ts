import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { sneezyNoisyKnight } from "./180-sneezy-noisy-knight";

// Sneezy - Noisy Knight: 4 cost, 3 strength, 4 willpower, 1 lore
// HEADWIND: When you play this character, chosen Knight character gains Challenger +2 this turn.

const knightCharacter = createMockCharacter({
  id: "sneezy-test-knight",
  name: "Knight Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Knight"],
});

const nonKnightCharacter = createMockCharacter({
  id: "sneezy-test-non-knight",
  name: "Non-Knight Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Sneezy - Noisy Knight", () => {
  describe("HEADWIND - When you play this character, chosen Knight character gains Challenger +2 this turn.", () => {
    it("grants Challenger +2 to chosen Knight character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sneezyNoisyKnight],
          play: [knightCharacter],
          inkwell: sneezyNoisyKnight.cost,
        },
        {
          play: [],
        },
      );

      const knightCharacterId = testEngine.findCardInstanceId(knightCharacter, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(sneezyNoisyKnight)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(sneezyNoisyKnight, { targets: [knightCharacterId] }),
      ).toBeSuccessfulCommand();

      // Knight should have Challenger +2 keyword
      expect(testEngine.asPlayerOne().hasKeyword(knightCharacterId, "Challenger")).toBe(true);
      expect(testEngine.getKeywordValue(knightCharacterId, "Challenger")).toBe(2);
    });

    it("Challenger +2 effect expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sneezyNoisyKnight],
          play: [knightCharacter],
          inkwell: sneezyNoisyKnight.cost,
        },
        {
          play: [],
          deck: 1,
        },
      );

      const knightCharacterId = testEngine.findCardInstanceId(knightCharacter, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(sneezyNoisyKnight)).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(sneezyNoisyKnight, { targets: [knightCharacterId] }),
      ).toBeSuccessfulCommand();

      // Pass turn to expire the effects
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Challenger should be gone
      expect(testEngine.asPlayerOne().hasKeyword(knightCharacterId, "Challenger")).toBe(false);
    });

    it("only Knight characters can be chosen as targets", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [sneezyNoisyKnight],
          play: [knightCharacter, nonKnightCharacter],
          inkwell: sneezyNoisyKnight.cost,
        },
        {
          play: [],
        },
      );

      const nonKnightCharacterId = testEngine.findCardInstanceId(
        nonKnightCharacter,
        "play",
        PLAYER_ONE,
      );

      expect(testEngine.asPlayerOne().playCard(sneezyNoisyKnight)).toBeSuccessfulCommand();

      // Attempting to target non-Knight character should fail
      const result = testEngine
        .asPlayerOne()
        .resolvePendingByCard(sneezyNoisyKnight, { targets: [nonKnightCharacterId] });
      expect(result.success).toBe(false);
    });
  });
});
