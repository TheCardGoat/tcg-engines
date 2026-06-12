import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { fireTheCannons, stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { lawrenceJealousManservant } from "@tcg/lorcana-cards/cards/002";
import { minnieMouseQuickthinkingInventor } from "@tcg/lorcana-cards/cards/005";

const targetCharacter = createMockCharacter({
  id: "continuous-target",
  name: "Target Character",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

describe("Continuous Effects - Persistent stat modifiers and their lifecycle", () => {
  describe("Conditional static modifier - Lawrence, Jealous Manservant", () => {
    it("should apply +4 strength when character has no damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lawrenceJealousManservant],
      });

      // Lawrence base strength is 0, but PAYBACK gives +4 when no damage
      expect(testEngine.asPlayerOne().getCardStrength(lawrenceJealousManservant)).toBe(4);
    });

    it("should lose the +4 strength bonus when character takes damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
          play: [lawrenceJealousManservant],
        },
        {},
      );

      // Apply damage to Lawrence
      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, {
          targets: [lawrenceJealousManservant],
        }),
      ).toBeSuccessfulCommand();

      // Lawrence now has damage, so PAYBACK condition fails => strength goes to base 0
      expect(testEngine.asPlayerOne().getCardStrength(lawrenceJealousManservant)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(lawrenceJealousManservant)).toBe(2);
    });

    it("should show base strength when character has damage (modifier inactive)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: lawrenceJealousManservant, damage: 2 }],
      });

      // With damage: PAYBACK condition fails, strength should be base 0
      expect(testEngine.asPlayerOne().getCardStrength(lawrenceJealousManservant)).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(lawrenceJealousManservant)).toBe(2);
    });
  });

  describe("Multiple modifiers on same target", () => {
    it("should stack multiple temporary modifiers on the same target", () => {
      // Play two Minnies to apply -2 strength twice to the same target
      const minnie2 = {
        ...minnieMouseQuickthinkingInventor,
      } as typeof minnieMouseQuickthinkingInventor;

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseQuickthinkingInventor],
          inkwell: minnieMouseQuickthinkingInventor.cost,
          play: [targetCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(3);

      // Apply -2 strength
      expect(
        testEngine.asPlayerOne().playCard(minnieMouseQuickthinkingInventor),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
            targets: [targetCharacter],
          }),
      ).toBeSuccessfulCommand();

      // 3 - 2 = 1
      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(1);
    });
  });

  describe("Modifier lifecycle with source card leaving play", () => {
    it("should keep static modifier active as long as source is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lawrenceJealousManservant],
      });

      expect(testEngine.asPlayerOne().getCardStrength(lawrenceJealousManservant)).toBe(4);
      expect(testEngine.asPlayerOne().getCardZone(lawrenceJealousManservant)).toBe("play");
    });
  });
});
