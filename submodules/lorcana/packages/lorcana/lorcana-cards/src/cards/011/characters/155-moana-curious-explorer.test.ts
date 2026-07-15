import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { moanaCuriousExplorer } from "./155-moana-curious-explorer";
import { belleStrangeButSpecial } from "../../001";

const inkableCard = createMockCharacter({
  id: "moana-test-inkable",
  name: "Inkable Card",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const secondInkableCard = createMockCharacter({
  id: "moana-test-inkable-2",
  name: "Second Inkable Card",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const nonInkableCard = createMockCharacter({
  id: "moana-test-noink",
  name: "Non Inkable Card",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});
Object.assign(nonInkableCard, { inkable: false });

describe("Moana - Curious Explorer", () => {
  describe("ANCESTRAL LEGACY — You can ink cards from your discard.", () => {
    it("allows inking inkable cards from discard while Moana is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [moanaCuriousExplorer],
        discard: [inkableCard],
      });

      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(inkableCard)).toBe("inkwell");
    });

    it("does not allow inking non-inkable cards from discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [moanaCuriousExplorer],
        discard: [nonInkableCard],
      });

      expect(testEngine.asPlayerOne().ink(nonInkableCard)).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(nonInkableCard)).toBe("discard");
    });

    it("does not allow inking from discard when Moana is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        discard: [inkableCard],
      });

      expect(testEngine.asPlayerOne().ink(inkableCard)).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(inkableCard)).toBe("discard");
    });

    it("still allows normal inking from hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [moanaCuriousExplorer],
        hand: [inkableCard],
      });

      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(inkableCard)).toBe("inkwell");
    });

    it("does not allow inking twice in the same turn (one from hand, one from discard)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [moanaCuriousExplorer],
        hand: [inkableCard],
        discard: [secondInkableCard],
      });

      // First ink from hand should succeed
      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(inkableCard)).toBe("inkwell");

      // Second ink from discard should fail (already inked this turn)
      expect(testEngine.asPlayerOne().ink(secondInkableCard)).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(secondInkableCard)).toBe("discard");
    });

    it("does allow inking twice in the same turn, when inking limit has been increased", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [moanaCuriousExplorer, belleStrangeButSpecial],
        hand: [inkableCard],
        discard: [secondInkableCard],
      });

      // First ink from hand should succeed
      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(inkableCard)).toBe("inkwell");

      // Second ink from discard should succeed because Belle increases the inking limit
      expect(testEngine.asPlayerOne().ink(secondInkableCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(secondInkableCard)).toBe("inkwell");
    });
  });
});
