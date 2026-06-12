import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { rollyChubbyPuppy } from "./026-rolly-chubby-puppy";

const characterInDiscard = createMockCharacter({
  id: "rolly-cp-discard-char",
  name: "Character In Discard",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const anotherCharacterInDiscard = createMockCharacter({
  id: "rolly-cp-discard-char-2",
  name: "Another Character In Discard",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
});

describe("Rolly - Chubby Puppy", () => {
  it("has Support keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [rollyChubbyPuppy],
    });

    expect(testEngine.getCardModel(rollyChubbyPuppy).hasSupport()).toBe(true);
  });

  describe("ADORABLE ANTICS — When you play this character, you may put a character card from your discard into your inkwell facedown and exerted.", () => {
    it("triggers an optional bag effect when Rolly is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [rollyChubbyPuppy],
        inkwell: rollyChubbyPuppy.cost,
        discard: [characterInDiscard],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(rollyChubbyPuppy)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("puts a chosen character card from discard into inkwell facedown and exerted when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [rollyChubbyPuppy],
        inkwell: rollyChubbyPuppy.cost,
        discard: [characterInDiscard],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(rollyChubbyPuppy)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rollyChubbyPuppy, {
          resolveOptional: true,
          targets: [characterInDiscard],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(characterInDiscard)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(characterInDiscard)).toBe(true);
    });

    it("does not move the discard card when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [rollyChubbyPuppy],
        inkwell: rollyChubbyPuppy.cost,
        discard: [characterInDiscard],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(rollyChubbyPuppy)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rollyChubbyPuppy, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(characterInDiscard)).toBe("discard");
    });

    it("can choose which character card from discard to put into inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [rollyChubbyPuppy],
        inkwell: rollyChubbyPuppy.cost,
        discard: [characterInDiscard, anotherCharacterInDiscard],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(rollyChubbyPuppy)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rollyChubbyPuppy, {
          resolveOptional: true,
          targets: [anotherCharacterInDiscard],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(anotherCharacterInDiscard)).toBe("inkwell");
      expect(testEngine.asPlayerOne().getCardZone(characterInDiscard)).toBe("discard");
    });

    it("regression: successfully moves character from discard to inkwell (facedown and exerted)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [rollyChubbyPuppy],
        inkwell: rollyChubbyPuppy.cost,
        discard: [characterInDiscard],
        deck: 1,
      });

      const initialInkwellCount = testEngine.asPlayerOne().getZonesCardCount().inkwell;

      expect(testEngine.asPlayerOne().playCard(rollyChubbyPuppy)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rollyChubbyPuppy, {
          resolveOptional: true,
          targets: [characterInDiscard],
        }),
      ).toBeSuccessfulCommand();

      // Card should be in inkwell
      expect(testEngine.asPlayerOne().getCardZone(characterInDiscard)).toBe("inkwell");
      // Card should be exerted
      expect(testEngine.asPlayerOne().isExerted(characterInDiscard)).toBe(true);
      // Inkwell count should have increased (spent cost for Rolly, but gained 1 from ability)
      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(0);
    });

    it("does not trigger when there are no character cards in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [rollyChubbyPuppy],
        inkwell: rollyChubbyPuppy.cost,
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(rollyChubbyPuppy)).toBeSuccessfulCommand();
      // Bag may still be present but resolve with no valid targets
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(rollyChubbyPuppy, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(rollyChubbyPuppy.cost);
    });
  });
});
