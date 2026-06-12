import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { moanaCuriousExplorer } from "../../011";
import { hiddenInkcaster } from "./098-hidden-inkcaster";

const drawnCard = createMockCharacter({
  id: "hidden-inkcaster-drawn",
  name: "Drawn Card",
  cost: 1,
});

const nonInkableCard = createMockCharacter({
  id: "hidden-inkcaster-non-inkable",
  name: "Non Inkable Card",
  cost: 3,
  abilities: [],
});

// Override to make it non-inkable
Object.assign(nonInkableCard, { inkable: false });

const inkableCard = createMockCharacter({
  id: "hidden-inkcaster-inkable",
  name: "Inkable Card",
  cost: 2,
  abilities: [],
});

describe("Hidden Inkcaster", () => {
  describe("FRESH INK — When you play this item, draw a card.", () => {
    it("draws a card when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [hiddenInkcaster],
        inkwell: hiddenInkcaster.cost,
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(hiddenInkcaster)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
        expect.objectContaining({ hand: 1, deck: 0, play: 1 }),
      );
    });
  });

  describe("UNEXPECTED TREASURE — All cards in your hand count as having inkwell symbol.", () => {
    it("allows non-inkable cards in hand to be inked while Hidden Inkcaster is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [nonInkableCard],
        play: [hiddenInkcaster],
      });

      expect(testEngine.asPlayerOne().ink(nonInkableCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
        expect.objectContaining({ inkwell: 1, hand: 0 }),
      );
    });

    it("does not allow non-inkable cards to be inked when Hidden Inkcaster is not in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [nonInkableCard],
      });

      expect(testEngine.asPlayerOne().ink(nonInkableCard)).not.toBeSuccessfulCommand();
    });

    it("does not affect cards in discard (only hand)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hiddenInkcaster],
        discard: [nonInkableCard],
      });

      expect(testEngine.asPlayerOne().ink(nonInkableCard)).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(nonInkableCard)).toBe("discard");
    });

    it("still allows normal inking of cards with inkwell symbol", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkableCard],
        play: [hiddenInkcaster],
      });

      expect(testEngine.asPlayerOne().ink(inkableCard)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(inkableCard)).toBe("inkwell");
    });
  });

  describe("Interaction with Moana - Curious Explorer", () => {
    it("does not allow inking non-inkable cards from discard even with both in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hiddenInkcaster, moanaCuriousExplorer],
        discard: [nonInkableCard],
      });

      expect(testEngine.asPlayerOne().ink(nonInkableCard)).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(nonInkableCard)).toBe("discard");
    });
  });
});
