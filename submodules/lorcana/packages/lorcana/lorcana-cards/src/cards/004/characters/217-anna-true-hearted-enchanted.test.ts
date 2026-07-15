import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { annaTrueheartedEnchanted } from "./217-anna-true-hearted-enchanted";

const heroOne = createMockCharacter({
  id: "anna-enchanted-hero-one",
  name: "Hero One",
  cost: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const heroTwo = createMockCharacter({
  id: "anna-enchanted-hero-two",
  name: "Hero Two",
  cost: 3,
  lore: 2,
  classifications: ["Dreamborn", "Hero", "Princess"],
});

const nonHero = createMockCharacter({
  id: "anna-enchanted-non-hero",
  name: "Non Hero",
  cost: 2,
  lore: 1,
  classifications: ["Storyborn", "Villain"],
});

describe("Anna - True-Hearted (Enchanted)", () => {
  describe("LET ME HELP YOU - Whenever this character quests, your other Hero characters get +1 {L} this turn.", () => {
    it("gives other Hero characters +1 lore when she quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: annaTrueheartedEnchanted, isDrying: false },
          { card: heroOne, isDrying: false },
          { card: heroTwo, isDrying: false },
          { card: nonHero, isDrying: false },
        ],
      });

      const initialHeroOneLore = testEngine.asPlayerOne().getCardLore(heroOne);
      const initialHeroTwoLore = testEngine.asPlayerOne().getCardLore(heroTwo);
      const initialNonHeroLore = testEngine.asPlayerOne().getCardLore(nonHero);

      expect(testEngine.asPlayerOne().quest(annaTrueheartedEnchanted)).toBeSuccessfulCommand();

      // Other Hero characters should get +1 lore
      expect(testEngine.asPlayerOne().getCardLore(heroOne)).toBe(initialHeroOneLore + 1);
      expect(testEngine.asPlayerOne().getCardLore(heroTwo)).toBe(initialHeroTwoLore + 1);
      // Non-Hero should not be affected
      expect(testEngine.asPlayerOne().getCardLore(nonHero)).toBe(initialNonHeroLore);
      // Anna herself is a Hero but should NOT get the buff (excludeSelf)
      expect(testEngine.asPlayerOne().getCardLore(annaTrueheartedEnchanted)).toBe(
        annaTrueheartedEnchanted.lore,
      );
    });

    it("buff expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: annaTrueheartedEnchanted, isDrying: false },
          { card: heroOne, isDrying: false },
        ],
      });

      const initialHeroOneLore = testEngine.asPlayerOne().getCardLore(heroOne);

      expect(testEngine.asPlayerOne().quest(annaTrueheartedEnchanted)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardLore(heroOne)).toBe(initialHeroOneLore + 1);

      // Pass both turns to end the turn cycle
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Buff should be gone
      expect(testEngine.asPlayerOne().getCardLore(heroOne)).toBe(initialHeroOneLore);
    });

    it("questing with Anna gains lore equal to her base lore value", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: annaTrueheartedEnchanted, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(annaTrueheartedEnchanted)).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(annaTrueheartedEnchanted.lore);
    });
  });
});
