import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { cardHasName } from "@tcg/lorcana-engine";
import { incrediboyBuddyPine } from "./177-incrediboy-buddy-pine";

const heroCharacter = createMockCharacter({
  id: "incrediboy-hero-character",
  name: "Hero Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const nonHeroCharacter = createMockCharacter({
  id: "incrediboy-non-hero-character",
  name: "Non Hero",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Villain"],
});

describe("Incrediboy - Buddy Pine", () => {
  describe("NERDING OUT - When you play this character, if a Hero character is in play, gain 1 lore.", () => {
    it("gains 1 lore when a Hero character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [incrediboyBuddyPine],
        play: [heroCharacter],
        inkwell: incrediboyBuddyPine.cost,
        deck: 2,
      });

      const initialLore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(incrediboyBuddyPine)).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(incrediboyBuddyPine),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(initialLore + 1);
    });

    it("does not gain lore when no Hero character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [incrediboyBuddyPine],
        play: [nonHeroCharacter],
        inkwell: incrediboyBuddyPine.cost,
        deck: 2,
      });

      const initialLore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(incrediboyBuddyPine)).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(incrediboyBuddyPine),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(initialLore);
    });
  });

  describe("SPOILER ALERT - This character also counts as being named Syndrome for Shift.", () => {
    it("counts as being named Syndrome (in addition to Incrediboy)", () => {
      expect(cardHasName(incrediboyBuddyPine, "Syndrome")).toBe(true);
      expect(cardHasName(incrediboyBuddyPine, "Incrediboy")).toBe(true);
    });
  });
});
