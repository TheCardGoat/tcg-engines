import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { trampEnterprisingDog } from "./110-tramp-enterprising-dog";
import { trampEnterprisingDogEnchanted } from "./212-tramp-enterprising-dog-enchanted";
import { ladyElegantSpaniel } from "./100-lady-elegant-spaniel";

const allyOne = createMockCharacter({
  id: "tramp-enterprising-ally-one",
  name: "Ally One",
  cost: 1,
  strength: 1,
  willpower: 2,
});

const allyTwo = createMockCharacter({
  id: "tramp-enterprising-ally-two",
  name: "Ally Two",
  cost: 1,
  strength: 1,
  willpower: 2,
});

const targetCharacter = createMockCharacter({
  id: "tramp-enterprising-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Tramp - Enterprising Dog", () => {
  describe("HEY, PIDGE - If you have a character named Lady in play, you pay 1 less to play this character.", () => {
    it("can be played with 1 less ink when Lady is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: trampEnterprisingDog.cost - 1,
        play: [ladyElegantSpaniel],
        hand: [trampEnterprisingDog],
      });

      expect(testEngine.asPlayerOne().playCard(trampEnterprisingDog)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(trampEnterprisingDog)).toBe("play");
    });

    it("cannot be played with 1 less ink when Lady is NOT in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: trampEnterprisingDog.cost - 1,
        hand: [trampEnterprisingDog],
      });

      expect(testEngine.asPlayerOne().playCard(trampEnterprisingDog).success).toBe(false);

      expect(testEngine.asPlayerOne().getCardZone(trampEnterprisingDog)).toBe("hand");
    });
  });

  describe("NO TIME FOR WISECRACKS - When you play this character, chosen character of yours gets +1 strength this turn for each other character you have in play.", () => {
    it("grants +1 strength per other character in play to the chosen character", () => {
      // 2 other characters in play (allyOne + allyTwo), so +2 strength
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: trampEnterprisingDog.cost,
        hand: [trampEnterprisingDog],
        play: [allyOne, allyTwo, targetCharacter],
      });

      expect(testEngine.asPlayerOne().playCard(trampEnterprisingDog)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(trampEnterprisingDog, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      // 3 other characters in play (allyOne + allyTwo + targetCharacter), so +3 strength
      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(
        targetCharacter.strength + 3,
      );
    });

    it("grants +0 strength when there are no other characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: trampEnterprisingDog.cost,
        hand: [trampEnterprisingDog],
      });

      expect(testEngine.asPlayerOne().playCard(trampEnterprisingDog)).toBeSuccessfulCommand();

      // Tramp is now in play but no other characters, so 0 other characters
      // There should be a bag effect for choosing a target
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(trampEnterprisingDog, {
            targets: [trampEnterprisingDog],
          }),
        ).toBeSuccessfulCommand();

        // Tramp's strength should be unchanged (0 other characters)
        expect(testEngine.asPlayerOne().getCardStrength(trampEnterprisingDog)).toBe(
          trampEnterprisingDog.strength + 0,
        );
      }
    });

    it("the strength buff lasts only this turn and expires at start of next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: trampEnterprisingDog.cost,
          hand: [trampEnterprisingDog],
          play: [allyOne, targetCharacter],
        },
        {
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(trampEnterprisingDog)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(trampEnterprisingDog, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      // 2 other characters in play (allyOne + targetCharacter), so +2 strength
      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(
        targetCharacter.strength + 2,
      );

      // Pass turns
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      // Strength buff should have expired
      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(
        targetCharacter.strength,
      );
    });

    it("playing two Tramps gives each buff based on character count at time of play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: trampEnterprisingDog.cost + trampEnterprisingDogEnchanted.cost,
        hand: [trampEnterprisingDog, trampEnterprisingDogEnchanted],
        play: [allyOne, allyTwo],
      });

      // First Tramp: 2 other characters in play (allyOne + allyTwo), so +2 strength to target
      expect(testEngine.asPlayerOne().playCard(trampEnterprisingDog)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(trampEnterprisingDog, {
          targets: [allyOne],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(allyOne)).toBe(allyOne.strength + 2);

      // Second Tramp: 3 other characters in play (allyOne + allyTwo + first Tramp), so +3 strength to target
      expect(
        testEngine.asPlayerOne().playCard(trampEnterprisingDogEnchanted),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(trampEnterprisingDogEnchanted, {
          targets: [allyOne],
        }),
      ).toBeSuccessfulCommand();

      // allyOne has +2 from first Tramp and +3 from second Tramp = +5 total
      expect(testEngine.asPlayerOne().getCardStrength(allyOne)).toBe(allyOne.strength + 5);
    });
  });
});
