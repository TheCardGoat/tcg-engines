import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { lingImperialSoldier } from "./183-ling-imperial-soldier";

const heroOne = createMockCharacter({
  id: "ling-hero-one",
  name: "Hero One",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const heroTwo = createMockCharacter({
  id: "ling-hero-two",
  name: "Hero Two",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  classifications: ["Dreamborn", "Hero", "Princess"],
});

const nonHero = createMockCharacter({
  id: "ling-non-hero",
  name: "Non Hero",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Villain"],
});

describe("Ling - Imperial Soldier", () => {
  describe("FULL OF SPIRIT - Your Hero characters get +1 {S}.", () => {
    it("gives Hero characters +1 strength", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lingImperialSoldier, heroOne, heroTwo, nonHero],
      });

      const heroOneStrength = testEngine.asPlayerOne().getCardStrength(heroOne);
      const heroTwoStrength = testEngine.asPlayerOne().getCardStrength(heroTwo);
      const nonHeroStrength = testEngine.asPlayerOne().getCardStrength(nonHero);
      const lingStrength = testEngine.asPlayerOne().getCardStrength(lingImperialSoldier);

      expect(heroOneStrength).toBe(heroOne.strength + 1);
      expect(heroTwoStrength).toBe(heroTwo.strength + 1);
      expect(nonHeroStrength).toBe(nonHero.strength);
      expect(lingStrength).toBe(lingImperialSoldier.strength);
    });

    it("does not affect opponent's Hero characters", () => {
      const opponentHero = createMockCharacter({
        id: "ling-opponent-hero",
        name: "Opponent Hero",
        cost: 2,
        strength: 2,
        willpower: 2,
        lore: 1,
        classifications: ["Storyborn", "Hero"],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [lingImperialSoldier] },
        { play: [opponentHero] },
      );

      const opponentHeroStrength = testEngine.asPlayerTwo().getCardStrength(opponentHero);
      expect(opponentHeroStrength).toBe(opponentHero.strength);
    });

    it("buff persists while Ling is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lingImperialSoldier, heroOne],
      });

      expect(testEngine.asPlayerOne().getCardStrength(heroOne)).toBe(heroOne.strength + 1);

      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      expect(testEngine.asPlayerOne().getCardStrength(heroOne)).toBe(heroOne.strength + 1);
    });
  });
});
