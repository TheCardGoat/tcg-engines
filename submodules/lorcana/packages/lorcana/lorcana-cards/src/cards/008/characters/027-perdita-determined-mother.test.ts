import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { perditaDeterminedMother } from "./027-perdita-determined-mother";
import { rollyChubbyPuppy } from "./026-rolly-chubby-puppy";
import { patchPlayfulPup } from "./025-patch-playful-pup";
import { dalmatianPuppyTailWagger } from "./038-dalmatian-puppy-tail-wagger";

const nonPuppyCharacter = createMockCharacter({
  id: "non-puppy-character",
  name: "Non-Puppy Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  classifications: ["Storyborn", "Villain"],
});

describe("Perdita - Determined Mother", () => {
  it("has Shift 4", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [perditaDeterminedMother],
    });

    expect(testEngine.asPlayerOne().hasKeyword(perditaDeterminedMother, "Shift")).toBe(true);
  });

  describe("QUICK, EVERYONE HIDE - When you play this character, you may put all Puppy character cards from your discard into your inkwell facedown and exerted.", () => {
    it("puts all Puppy character cards from discard into inkwell facedown and exerted when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [perditaDeterminedMother],
        inkwell: perditaDeterminedMother.cost,
        discard: [rollyChubbyPuppy, patchPlayfulPup, dalmatianPuppyTailWagger, nonPuppyCharacter],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(perditaDeterminedMother)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(perditaDeterminedMother, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // All Puppy characters should be in inkwell, facedown, and exerted
      expect(testEngine.asPlayerOne().getCardZone(rollyChubbyPuppy)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(rollyChubbyPuppy)).toBe(true);
      expect(testEngine.isCardFaceDown(rollyChubbyPuppy, "inkwell")).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(patchPlayfulPup)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(patchPlayfulPup)).toBe(true);
      expect(testEngine.isCardFaceDown(patchPlayfulPup, "inkwell")).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(dalmatianPuppyTailWagger)).toBe("inkwell");
      expect(testEngine.asPlayerOne().isExerted(dalmatianPuppyTailWagger)).toBe(true);
      expect(testEngine.isCardFaceDown(dalmatianPuppyTailWagger, "inkwell")).toBe(true);

      // Non-puppy character should remain in discard
      expect(testEngine.asPlayerOne().getCardZone(nonPuppyCharacter)).toBe("discard");
    });

    it("leaves all cards in discard when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [perditaDeterminedMother],
        inkwell: perditaDeterminedMother.cost,
        discard: [rollyChubbyPuppy, patchPlayfulPup, dalmatianPuppyTailWagger],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(perditaDeterminedMother)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(perditaDeterminedMother, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // All cards should remain in discard
      expect(testEngine.asPlayerOne().getCardZone(rollyChubbyPuppy)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(patchPlayfulPup)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(dalmatianPuppyTailWagger)).toBe("discard");
    });
  });
});
