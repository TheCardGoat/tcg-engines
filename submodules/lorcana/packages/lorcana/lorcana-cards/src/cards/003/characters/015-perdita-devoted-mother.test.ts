import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { perditaDevotedMother } from "./015-perdita-devoted-mother";

const cheapCharacter = createMockCharacter({
  id: "perdita-test-cheap",
  name: "Cheap Character",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const expensiveCharacter = createMockCharacter({
  id: "perdita-test-expensive",
  name: "Expensive Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Perdita - Devoted Mother", () => {
  describe("COME ALONG, CHILDREN — When you play this character and whenever she quests, you may play a character with cost 2 or less from your discard for free.", () => {
    it("triggers when played and plays a character with cost 2 or less from discard for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [perditaDevotedMother],
        inkwell: perditaDevotedMother.cost,
        discard: [cheapCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(perditaDevotedMother)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(perditaDevotedMother, {
          targets: [cheapCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("play");
    });

    it("is optional - can decline the ability when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [perditaDevotedMother],
        inkwell: perditaDevotedMother.cost,
        discard: [cheapCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(perditaDevotedMother)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(perditaDevotedMother, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("discard");
    });

    it("does not allow playing a character with cost more than 2", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [perditaDevotedMother],
        inkwell: perditaDevotedMother.cost,
        discard: [expensiveCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(perditaDevotedMother)).toBeSuccessfulCommand();

      // No valid targets → no bag effect should be created
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(expensiveCharacter)).toBe("discard");
    });

    it("does not create a bag effect when discard is empty", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [perditaDevotedMother],
        inkwell: perditaDevotedMother.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(perditaDevotedMother)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("triggers when questing and plays a character with cost 2 or less from discard for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: perditaDevotedMother, isDrying: false }],
        discard: [cheapCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(perditaDevotedMother)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(perditaDevotedMother, {
          targets: [cheapCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("play");
    });

    it("is optional - can decline the ability when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: perditaDevotedMother, isDrying: false }],
        discard: [cheapCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().quest(perditaDevotedMother)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(perditaDevotedMother, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapCharacter)).toBe("discard");
    });
  });
});
