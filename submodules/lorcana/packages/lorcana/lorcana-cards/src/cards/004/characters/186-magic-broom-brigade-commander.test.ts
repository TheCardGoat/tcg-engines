import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { magicBroomBrigadeCommander } from "./186-magic-broom-brigade-commander";
import { magicBroomAerialCleaner } from "./185-magic-broom-aerial-cleaner";
import { magicBroomIlluminaryKeeper } from "./048-magic-broom-illuminary-keeper";

const nonMagicBroomCharacter = createMockCharacter({
  id: "magic-broom-brigade-commander-non-broom",
  name: "Non Broom Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const banishAction = createMockAction({
  id: "magic-broom-brigade-commander-banish-action",
  name: "Banish Action",
  cost: 2,
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      type: "action",
    },
  ],
});

describe("Magic Broom - Brigade Commander", () => {
  describe("Resist +1", () => {
    it("has Resist +1 as a static keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicBroomBrigadeCommander],
      });

      expect(testEngine.asPlayerOne().hasKeyword(magicBroomBrigadeCommander, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(magicBroomBrigadeCommander, "Resist")).toBe(
        1,
      );
    });
  });

  describe("ARMY OF BROOMS - This character gets +2 {S} for each other character named Magic Broom you have in play.", () => {
    it("has base strength 2 with no other Magic Broom characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicBroomBrigadeCommander],
      });

      expect(testEngine.asPlayerOne().getCardStrength(magicBroomBrigadeCommander)).toBe(2);
    });

    it("gets +2 strength for each other Magic Broom character (2 others = +4 strength)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicBroomBrigadeCommander, magicBroomAerialCleaner, magicBroomIlluminaryKeeper],
      });

      expect(testEngine.asPlayerOne().getCardStrength(magicBroomBrigadeCommander)).toBe(6);
    });

    it("gets +2 strength for one other Magic Broom character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicBroomBrigadeCommander, magicBroomAerialCleaner],
      });

      expect(testEngine.asPlayerOne().getCardStrength(magicBroomBrigadeCommander)).toBe(4);
    });

    it("does not count non-Magic Broom characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [magicBroomBrigadeCommander, nonMagicBroomCharacter],
      });

      expect(testEngine.asPlayerOne().getCardStrength(magicBroomBrigadeCommander)).toBe(2);
    });

    it("does not count opponent's Magic Broom characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [magicBroomBrigadeCommander] },
        { play: [magicBroomAerialCleaner, magicBroomIlluminaryKeeper] },
      );

      expect(testEngine.asPlayerOne().getCardStrength(magicBroomBrigadeCommander)).toBe(2);
    });

    it("strength decreases when another Magic Broom leaves play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [magicBroomBrigadeCommander, magicBroomAerialCleaner, magicBroomIlluminaryKeeper],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 5,
        },
        { deck: 5 },
      );

      expect(testEngine.asPlayerOne().getCardStrength(magicBroomBrigadeCommander)).toBe(6);

      testEngine.asPlayerOne().playCard(banishAction, { targets: [magicBroomAerialCleaner] });

      expect(testEngine.asPlayerOne().getCardStrength(magicBroomBrigadeCommander)).toBe(4);
    });
  });
});
