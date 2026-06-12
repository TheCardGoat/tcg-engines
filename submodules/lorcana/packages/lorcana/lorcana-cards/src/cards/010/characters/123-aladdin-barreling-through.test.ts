import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { gastonArrogantHunter } from "../../001/characters/110-gaston-arrogant-hunter";
import { flynnRiderConfidentVagabond } from "../../002/characters/081-flynn-rider-confident-vagabond";
import { aladdinBarrelingThrough } from "./123-aladdin-barreling-through";

describe("Aladdin - Barreling Through", () => {
  describe("Boost 1", () => {
    it("has Boost keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aladdinBarrelingThrough],
      });

      expect(testEngine.hasKeyword(aladdinBarrelingThrough, "Boost")).toBe(true);
    });

    it("puts a card under Aladdin when boosted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 2,
        deck: 2,
        play: [aladdinBarrelingThrough],
      });

      expect(testEngine.getCardsUnder(aladdinBarrelingThrough)).toHaveLength(0);

      expect(
        testEngine.asPlayerOne().activateAbility(aladdinBarrelingThrough, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(aladdinBarrelingThrough)).toHaveLength(1);
    });
  });

  describe("Reckless", () => {
    it("has Reckless keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aladdinBarrelingThrough],
      });

      expect(testEngine.hasKeyword(aladdinBarrelingThrough, "Reckless")).toBe(true);
    });
  });

  describe("ONLY THE BOLD - While there's a card under this character, your characters with Reckless gain '{E} -- Gain 1 lore.'", () => {
    it("Aladdin can exert to gain 1 lore after boosting", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 2,
        deck: 2,
        play: [aladdinBarrelingThrough],
      });

      // Activate boost ability
      expect(
        testEngine.asPlayerOne().activateAbility(aladdinBarrelingThrough, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      // Verify card is under
      expect(testEngine.getCardsUnder(aladdinBarrelingThrough)).toHaveLength(1);

      // Activate ONLY THE BOLD ability to gain 1 lore
      const initialLore = testEngine.getLore("player_one");
      expect(
        testEngine
          .asPlayerOne()
          .activateAbility(aladdinBarrelingThrough, { ability: "ONLY THE BOLD" }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore("player_one")).toBe(initialLore + 1);
      expect(testEngine.isExerted(aladdinBarrelingThrough)).toBe(true);
    });

    it("other characters with Reckless also gain the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 2,
        deck: 2,
        play: [aladdinBarrelingThrough, gastonArrogantHunter],
      });

      // Activate boost ability on Aladdin
      expect(
        testEngine.asPlayerOne().activateAbility(aladdinBarrelingThrough, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      // Verify card is under Aladdin
      expect(testEngine.getCardsUnder(aladdinBarrelingThrough)).toHaveLength(1);

      // Gaston has Reckless, so he should be able to use ONLY THE BOLD
      const initialLore = testEngine.getLore("player_one");
      expect(
        testEngine
          .asPlayerOne()
          .activateAbility(gastonArrogantHunter, { ability: "ONLY THE BOLD" }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore("player_one")).toBe(initialLore + 1);
      expect(testEngine.isExerted(gastonArrogantHunter)).toBe(true);
    });

    it("characters without Reckless do not gain the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 2,
        deck: 2,
        play: [aladdinBarrelingThrough, flynnRiderConfidentVagabond],
      });

      // Verify Flynn doesn't have Reckless
      expect(testEngine.hasKeyword(flynnRiderConfidentVagabond, "Reckless")).toBe(false);

      // Activate boost ability on Aladdin
      expect(
        testEngine.asPlayerOne().activateAbility(aladdinBarrelingThrough, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      // Flynn should NOT be able to use ONLY THE BOLD
      const result = testEngine
        .asPlayerOne()
        .activateAbility(flynnRiderConfidentVagabond, { ability: "ONLY THE BOLD" });
      expect(result.success).toBe(false);
    });

    it("ability is not available before boosting (no card under)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [aladdinBarrelingThrough],
      });

      // Before boost, there are no cards under Aladdin
      expect(testEngine.getCardsUnder(aladdinBarrelingThrough)).toHaveLength(0);

      // ONLY THE BOLD should not be activatable since condition is not met
      const result = testEngine
        .asPlayerOne()
        .activateAbility(aladdinBarrelingThrough, { ability: "ONLY THE BOLD" });
      expect(result.success).toBe(false);
    });
  });
});
