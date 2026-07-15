import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mauiSoaringDemigod } from "./113-maui-soaring-demigod";
import { heiheiAccidentalExplorer } from "./107-heihei-accidental-explorer";

const nonHeiHeiCharacter = createMockCharacter({
  id: "non-heihei-character",
  name: "Random Character",
  cost: 2,
  willpower: 5,
  lore: 1,
});

describe("Maui - Soaring Demigod", () => {
  describe("Reckless", () => {
    it("has Reckless keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mauiSoaringDemigod, isDrying: false }],
      });

      expect(testEngine.hasKeyword(mauiSoaringDemigod, "Reckless")).toBe(true);
    });

    it("cannot quest due to Reckless", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: mauiSoaringDemigod, isDrying: false }],
      });

      expect(testEngine.asPlayerOne().quest(mauiSoaringDemigod)).not.toBeSuccessfulCommand();
    });
  });

  describe("IN MA BELLY — Whenever a character of yours named HeiHei quests, this character gets +1 {L} and loses Reckless this turn.", () => {
    it("gets +1 lore when HeiHei quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: mauiSoaringDemigod, isDrying: false },
          { card: heiheiAccidentalExplorer, isDrying: false },
        ],
      });

      expect(testEngine.asPlayerOne().quest(heiheiAccidentalExplorer)).toBeSuccessfulCommand();

      expect(testEngine.getCard(mauiSoaringDemigod).lore).toBe(mauiSoaringDemigod.lore + 1);
    });

    it("can quest this turn after HeiHei quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: mauiSoaringDemigod, isDrying: false },
          { card: heiheiAccidentalExplorer, isDrying: false },
        ],
      });

      expect(testEngine.hasKeyword(mauiSoaringDemigod, "Reckless")).toBe(true);

      expect(testEngine.asPlayerOne().quest(heiheiAccidentalExplorer)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().quest(mauiSoaringDemigod)).toBeSuccessfulCommand();
    });
  });
});
