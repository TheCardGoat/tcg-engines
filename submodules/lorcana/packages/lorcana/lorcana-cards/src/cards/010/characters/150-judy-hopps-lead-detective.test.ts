import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { judyHoppsLeadDetective } from "./150-judy-hopps-lead-detective";
import { genieInvestigativeMind } from "./146-genie-investigative-mind";

describe("Judy Hopps - Lead Detective", () => {
  describe("Shift 4", () => {
    it("has Shift keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [judyHoppsLeadDetective],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(judyHoppsLeadDetective, "Shift")).toBe(true);
    });
  });

  describe("LATERAL THINKING — During your turn, your Detective characters gain Alert and Resist +2.", () => {
    it("grants Alert to Judy Hopps (a Detective) during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [judyHoppsLeadDetective], deck: 1 },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: judyHoppsLeadDetective,
        keyword: "Alert",
      });
    });

    it("grants Resist +2 to Judy Hopps (a Detective) during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [judyHoppsLeadDetective], deck: 1 },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: judyHoppsLeadDetective,
        keyword: "Resist",
      });
      expect(testEngine.asPlayerOne().getKeywordValue(judyHoppsLeadDetective, "Resist")).toBe(2);
    });

    it("grants Alert to Genie - Investigative Mind (another Detective) during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [judyHoppsLeadDetective, genieInvestigativeMind], deck: 1 },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: genieInvestigativeMind,
        keyword: "Alert",
      });
    });

    it("grants Resist +2 to Genie - Investigative Mind (another Detective) during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [judyHoppsLeadDetective, genieInvestigativeMind], deck: 1 },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: genieInvestigativeMind,
        keyword: "Resist",
      });
      expect(testEngine.asPlayerOne().getKeywordValue(genieInvestigativeMind, "Resist")).toBe(2);
    });

    it("does not grant Alert or Resist during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [judyHoppsLeadDetective], deck: 1 },
        { deck: 1 },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: judyHoppsLeadDetective,
        keyword: "Alert",
      });
      expect(testEngine.asPlayerOne()).not.toHaveKeyword({
        card: judyHoppsLeadDetective,
        keyword: "Resist",
      });
    });
  });
});
