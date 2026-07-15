import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { trampEnterprisingDogEnchanted } from "./212-tramp-enterprising-dog-enchanted";
import { trampEnterprisingDog } from "./110-tramp-enterprising-dog";
import { runEnchantedParityCharacterTest } from "../../002/characters/test-helpers";

runEnchantedParityCharacterTest(trampEnterprisingDogEnchanted, trampEnterprisingDog);

const ladyCharacter = createMockCharacter({
  id: "tramp-enchanted-lady",
  name: "Lady",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const otherCharacterOne = createMockCharacter({
  id: "tramp-enchanted-other-one",
  name: "Other Character One",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const otherCharacterTwo = createMockCharacter({
  id: "tramp-enchanted-other-two",
  name: "Other Character Two",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const targetCharacter = createMockCharacter({
  id: "tramp-enchanted-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Tramp - Enterprising Dog (Enchanted)", () => {
  describe("HEY, PIDGE - If you have a character named Lady in play, you pay 1 {I} less to play this character.", () => {
    it("can be played with 1 less ink when a Lady character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: trampEnterprisingDogEnchanted.cost - 1,
        play: [ladyCharacter],
        hand: [trampEnterprisingDogEnchanted],
        deck: 1,
      });

      expect(
        testEngine.asPlayerOne().playCard(trampEnterprisingDogEnchanted),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(trampEnterprisingDogEnchanted)).toBe("play");
    });

    it("cannot be played with 1 less ink when no Lady character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: trampEnterprisingDogEnchanted.cost - 1,
        play: [otherCharacterOne],
        hand: [trampEnterprisingDogEnchanted],
        deck: 1,
      });

      const result = testEngine.asPlayerOne().playCard(trampEnterprisingDogEnchanted);
      expect(result.success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(trampEnterprisingDogEnchanted)).toBe("hand");
    });
  });

  describe("NO TIME FOR WISECRACKS - When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.", () => {
    it("chosen character gets +1 strength for each other character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: trampEnterprisingDogEnchanted.cost,
        hand: [trampEnterprisingDogEnchanted],
        play: [otherCharacterOne, otherCharacterTwo, targetCharacter],
        deck: 1,
      });

      expect(
        testEngine.asPlayerOne().playCard(trampEnterprisingDogEnchanted),
      ).toBeSuccessfulCommand();

      // After playing, there are 3 other characters in play (otherOne, otherTwo, target)
      // so the chosen character gets +3 strength
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(trampEnterprisingDogEnchanted, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(targetCharacter)?.strength).toBe(
        targetCharacter.strength + 3,
      );
    });

    it("chosen character gets +1 strength when exactly one other character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: trampEnterprisingDogEnchanted.cost,
        hand: [trampEnterprisingDogEnchanted],
        play: [targetCharacter],
        deck: 1,
      });

      expect(
        testEngine.asPlayerOne().playCard(trampEnterprisingDogEnchanted),
      ).toBeSuccessfulCommand();

      // After playing, there is 1 other character in play (target)
      // so the chosen character gets +1 strength
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(trampEnterprisingDogEnchanted, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(targetCharacter)?.strength).toBe(
        targetCharacter.strength + 1,
      );
    });
  });
});
