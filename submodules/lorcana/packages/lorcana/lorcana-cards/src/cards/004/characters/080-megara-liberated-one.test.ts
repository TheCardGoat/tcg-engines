import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { megaraLiberatedOne } from "./080-megara-liberated-one";
import { herculesHeroInTraining } from "../../002/characters/182-hercules-hero-in-training";

const nonHerculesCharacter = createMockCharacter({
  id: "megara-test-non-hercules",
  name: "Some Other Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Megara - Liberated One", () => {
  it("has Ward keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [megaraLiberatedOne],
    });

    expect(testEngine.hasKeyword(megaraLiberatedOne, "Ward")).toBe(true);
  });

  describe("PEOPLE ALWAYS DO CRAZY THINGS", () => {
    it("readies Megara when you play a character named Hercules", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [herculesHeroInTraining],
        inkwell: herculesHeroInTraining.cost,
        play: [{ card: megaraLiberatedOne, exerted: true }],
      });

      expect(testEngine.asPlayerOne().getCard(megaraLiberatedOne).exerted).toBe(true);

      expect(testEngine.asPlayerOne().playCard(herculesHeroInTraining)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(megaraLiberatedOne, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(megaraLiberatedOne).exerted).toBe(false);
    });

    it("does not trigger when you play a character not named Hercules", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [nonHerculesCharacter],
        inkwell: nonHerculesCharacter.cost,
        play: [{ card: megaraLiberatedOne, exerted: true }],
      });

      expect(testEngine.asPlayerOne().getCard(megaraLiberatedOne).exerted).toBe(true);

      expect(testEngine.asPlayerOne().playCard(nonHerculesCharacter)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCard(megaraLiberatedOne).exerted).toBe(true);
    });

    it("can decline the optional ready", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [herculesHeroInTraining],
        inkwell: herculesHeroInTraining.cost,
        play: [{ card: megaraLiberatedOne, exerted: true }],
      });

      expect(testEngine.asPlayerOne().getCard(megaraLiberatedOne).exerted).toBe(true);

      expect(testEngine.asPlayerOne().playCard(herculesHeroInTraining)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(megaraLiberatedOne, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(megaraLiberatedOne).exerted).toBe(true);
    });
  });
});
