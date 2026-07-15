import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { annaTruehearted } from "./138-anna-true-hearted";

const heroOne = createMockCharacter({
  id: "anna-true-hearted-hero-one",
  name: "Hero One",
  cost: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const heroTwo = createMockCharacter({
  id: "anna-true-hearted-hero-two",
  name: "Hero Two",
  cost: 3,
  lore: 2,
  classifications: ["Dreamborn", "Hero", "Princess"],
});

const nonHero = createMockCharacter({
  id: "anna-true-hearted-non-hero",
  name: "Non Hero",
  cost: 2,
  lore: 1,
  classifications: ["Storyborn", "Villain"],
});

describe("Anna - True-Hearted", () => {
  describe("LET ME HELP YOU - Whenever this character quests, your other Hero characters get +1 {L} this turn.", () => {
    it("gives other Hero characters +1 lore when she quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: annaTruehearted, isDrying: false },
          { card: heroOne, isDrying: false },
          { card: heroTwo, isDrying: false },
          { card: nonHero, isDrying: false },
        ],
      });

      const initialHeroOneLore = testEngine.asPlayerOne().getCardLore(heroOne);
      const initialHeroTwoLore = testEngine.asPlayerOne().getCardLore(heroTwo);
      const initialNonHeroLore = testEngine.asPlayerOne().getCardLore(nonHero);

      expect(testEngine.asPlayerOne().quest(annaTruehearted)).toBeSuccessfulCommand();

      // Other Hero characters should get +1 lore
      expect(testEngine.asPlayerOne().getCardLore(heroOne)).toBe(initialHeroOneLore + 1);
      expect(testEngine.asPlayerOne().getCardLore(heroTwo)).toBe(initialHeroTwoLore + 1);
      // Non-Hero should not be affected
      expect(testEngine.asPlayerOne().getCardLore(nonHero)).toBe(initialNonHeroLore);
      // Anna herself is a Hero but should NOT get the buff (excludeSelf)
      expect(testEngine.asPlayerOne().getCardLore(annaTruehearted)).toBe(annaTruehearted.lore);
    });

    it("buff expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: annaTruehearted, isDrying: false },
          { card: heroOne, isDrying: false },
        ],
      });

      const initialHeroOneLore = testEngine.asPlayerOne().getCardLore(heroOne);

      expect(testEngine.asPlayerOne().quest(annaTruehearted)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(heroOne)).toBe(initialHeroOneLore + 1);

      // Pass both turns to end the turn cycle
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Buff should be gone
      expect(testEngine.asPlayerOne().getCardLore(heroOne)).toBe(initialHeroOneLore);
    });

    it("questing with Anna gains lore equal to her base lore value", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: annaTruehearted, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(annaTruehearted)).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(annaTruehearted.lore);
    });
  });
});
