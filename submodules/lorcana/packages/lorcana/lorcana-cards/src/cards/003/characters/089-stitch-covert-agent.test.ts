import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { stitchCovertAgent } from "./089-stitch-covert-agent";
import { mcduckManorScroogesMansion } from "../locations/169-mcduck-manor-scrooges-mansion";

describe("Stitch - Covert Agent", () => {
  describe("Evasive", () => {
    it("has Evasive keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stitchCovertAgent],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(stitchCovertAgent, "Evasive")).toBe(true);
    });
  });

  describe("HIDE — While this character is at a location, he gains Ward.", () => {
    it("does not have Ward when not at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stitchCovertAgent, mcduckManorScroogesMansion],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(stitchCovertAgent, "Ward")).toBe(false);
    });

    it("gains Ward when at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: stitchCovertAgent, atLocation: mcduckManorScroogesMansion },
          mcduckManorScroogesMansion,
        ],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(stitchCovertAgent, "Ward")).toBe(true);
    });

    it("gains Ward after moving to a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stitchCovertAgent, mcduckManorScroogesMansion],
        inkwell: mcduckManorScroogesMansion.moveCost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(stitchCovertAgent, "Ward")).toBe(false);

      expect(
        testEngine
          .asPlayerOne()
          .moveCharacterToLocation(stitchCovertAgent, mcduckManorScroogesMansion),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(stitchCovertAgent, "Ward")).toBe(true);
    });
  });
});
