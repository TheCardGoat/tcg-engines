import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { snowWhiteFairhearted } from "./183-snow-white-fair-hearted";

const knightAlly = createMockCharacter({
  id: "snow-white-fair-hearted-knight-ally",
  name: "Knight Ally",
  cost: 2,
  lore: 1,
  classifications: ["Storyborn", "Knight"],
});

const nonKnightAlly = createMockCharacter({
  id: "snow-white-fair-hearted-non-knight-ally",
  name: "Non Knight Ally",
  cost: 2,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

describe("Snow White - Fair-Hearted", () => {
  describe("NATURAL LEADER - This character gains Resist +1 for each other Knight character you have in play.", () => {
    it("gets Resist +0 if no other Knight is in play beside Snow White", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [snowWhiteFairhearted],
      });

      const card = testEngine.getCard(snowWhiteFairhearted);
      expect(card.keywordValues?.resist ?? 0).toBe(0);
    });

    it("gets Resist +1 if exactly 1 other Knight is in play beside Snow White", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [snowWhiteFairhearted, knightAlly],
      });

      const card = testEngine.getCard(snowWhiteFairhearted);
      expect(card.keywordValues?.resist).toBe(1);
    });

    it("gets Resist +2 if 2 other Knights are in play beside Snow White", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [snowWhiteFairhearted, knightAlly, knightAlly],
      });

      const card = testEngine.getCard(snowWhiteFairhearted);
      expect(card.keywordValues?.resist).toBe(2);
    });

    it("does not count Snow White herself as a Knight for the count", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [snowWhiteFairhearted],
      });

      const card = testEngine.getCard(snowWhiteFairhearted);
      // Snow White is a Knight but excludes herself
      expect(card.keywordValues?.resist ?? 0).toBe(0);
    });

    it("does not count non-Knight characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [snowWhiteFairhearted, nonKnightAlly],
      });

      const card = testEngine.getCard(snowWhiteFairhearted);
      expect(card.keywordValues?.resist ?? 0).toBe(0);
    });
  });
});
