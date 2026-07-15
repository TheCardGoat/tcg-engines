import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { fairyGodmotherPureHeart } from "./042-fairy-godmother-pure-heart";
import { cinderellaBallroomSensation } from "./003-cinderella-ballroom-sensation";

const nonCinderellaCharacter = createMockCharacter({
  id: "fg-ph-non-cinderella",
  name: "Goofy",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Fairy Godmother - Pure Heart", () => {
  describe("JUST LEAVE IT TO ME - Whenever you play a character named Cinderella, you may exert chosen character.", () => {
    it("triggers when a character named Cinderella is played, allowing you to exert chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [cinderellaBallroomSensation],
          play: [fairyGodmotherPureHeart],
          inkwell: cinderellaBallroomSensation.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(cinderellaBallroomSensation),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      // Resolve the optional trigger: exert the Fairy Godmother itself
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fairyGodmotherPureHeart, {
          resolveOptional: true,
          targets: [fairyGodmotherPureHeart],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(fairyGodmotherPureHeart)).toBe(true);
    });

    it("does not trigger when a character not named Cinderella is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [nonCinderellaCharacter],
          play: [fairyGodmotherPureHeart],
          inkwell: nonCinderellaCharacter.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().playCard(nonCinderellaCharacter)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      // No JUST LEAVE IT TO ME bag effect should be queued
      expect(bagEffects.length).toBe(0);

      // Fairy Godmother should still be ready
      expect(testEngine.isExerted(fairyGodmotherPureHeart)).toBe(false);
    });

    it("is optional - declining the trigger leaves target ready", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [cinderellaBallroomSensation],
          play: [fairyGodmotherPureHeart],
          inkwell: cinderellaBallroomSensation.cost,
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(cinderellaBallroomSensation),
      ).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      // Decline the optional trigger
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(fairyGodmotherPureHeart, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(fairyGodmotherPureHeart)).toBe(false);
    });
  });
});
