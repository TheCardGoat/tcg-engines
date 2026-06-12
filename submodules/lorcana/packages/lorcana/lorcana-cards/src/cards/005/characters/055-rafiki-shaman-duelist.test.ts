import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { rafikiShamanDuelist } from "./055-rafiki-shaman-duelist";

describe("Rafiki - Shaman Duelist", () => {
  describe("SURPRISING SKILL - When you play this character, he gains Challenger +4 this turn.", () => {
    it("gains Challenger +4 when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [rafikiShamanDuelist],
        inkwell: rafikiShamanDuelist.cost,
      });

      expect(testEngine.asPlayerOne().playCard(rafikiShamanDuelist)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(rafikiShamanDuelist, "Challenger")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(rafikiShamanDuelist, "Challenger")).toBe(4);
    });

    it("does not have Challenger before being played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [rafikiShamanDuelist],
        inkwell: rafikiShamanDuelist.cost,
      });

      expect(testEngine.asPlayerOne().hasKeyword(rafikiShamanDuelist, "Challenger")).toBe(false);
    });
  });
});
