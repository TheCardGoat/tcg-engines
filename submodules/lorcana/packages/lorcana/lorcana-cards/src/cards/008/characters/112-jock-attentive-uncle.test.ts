import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { jockAttentiveUncle } from "./112-jock-attentive-uncle";

const allyOne = createMockCharacter({
  id: "jock-test-ally-1",
  name: "Ally One",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const allyTwo = createMockCharacter({
  id: "jock-test-ally-2",
  name: "Ally Two",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const allyThree = createMockCharacter({
  id: "jock-test-ally-3",
  name: "Ally Three",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Jock - Attentive Uncle", () => {
  describe("VOICE OF EXPERIENCE - When you play this character, if you have 3 or more other characters in play, gain 2 lore.", () => {
    it("gains 2 lore when played with 3 other characters already in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [jockAttentiveUncle],
        inkwell: jockAttentiveUncle.cost,
        play: [allyOne, allyTwo, allyThree],
        deck: 2,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);
      expect(testEngine.asPlayerOne().playCard(jockAttentiveUncle)).toBeSuccessfulCommand();

      // Resolve any pending bag effects
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const effect of bagEffects) {
        testEngine.asPlayerOne().resolvePendingByCard(jockAttentiveUncle);
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 2);
    });

    it("does not gain lore when played with only 2 other characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [jockAttentiveUncle],
        inkwell: jockAttentiveUncle.cost,
        play: [allyOne, allyTwo],
        deck: 2,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);
      expect(testEngine.asPlayerOne().playCard(jockAttentiveUncle)).toBeSuccessfulCommand();

      // Resolve any pending bag effects
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const effect of bagEffects) {
        testEngine.asPlayerOne().resolvePendingByCard(jockAttentiveUncle);
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });

    it("does not gain lore when played with no other characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [jockAttentiveUncle],
        inkwell: jockAttentiveUncle.cost,
        deck: 2,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);
      expect(testEngine.asPlayerOne().playCard(jockAttentiveUncle)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const effect of bagEffects) {
        testEngine.asPlayerOne().resolvePendingByCard(jockAttentiveUncle);
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });
  });
});
