import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { minnieMouseQuickthinkingInventor } from "./152-minnie-mouse-quick-thinking-inventor";

const targetCharacter = createMockCharacter({
  id: "minnie-qti-target",
  name: "Target Character",
  cost: 2,
  strength: 4,
  willpower: 4,
  lore: 1,
});

describe("Minnie Mouse - Quick-Thinking Inventor", () => {
  describe("CAKE CATAPULT - When you play this character, chosen character gets -2 {S} this turn.", () => {
    it("should have the correct trigger event and subject", () => {
      const abilities = minnieMouseQuickthinkingInventor.abilities ?? [];
      const cakeCatapult = abilities.find(
        (a) => a.type === "triggered" && "name" in a && a.name === "CAKE CATAPULT",
      );

      expect(cakeCatapult).toBeDefined();
      expect(cakeCatapult?.type).toBe("triggered");

      if (cakeCatapult?.type === "triggered") {
        expect(cakeCatapult.trigger.event).toBe("play");
        expect(cakeCatapult.trigger.on).toBe("SELF");
      }
    });

    it("should have a modify-stat strength -2 effect for this-turn duration", () => {
      const abilities = minnieMouseQuickthinkingInventor.abilities ?? [];
      const cakeCatapult = abilities.find(
        (a) => a.type === "triggered" && "name" in a && a.name === "CAKE CATAPULT",
      );

      expect(cakeCatapult?.type).toBe("triggered");

      if (cakeCatapult?.type === "triggered") {
        const effect = cakeCatapult.effect;
        expect(effect.type).toBe("modify-stat");

        if (effect.type === "modify-stat") {
          expect(effect.stat).toBe("strength");
          expect(effect.modifier).toBe(-2);
          expect(effect.duration).toBe("this-turn");
        }
      }
    });

    it("gives -2 strength to a chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseQuickthinkingInventor],
          inkwell: minnieMouseQuickthinkingInventor.cost,
          play: [targetCharacter],
        },
        {
          deck: 2,
        },
      );

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(targetCharacter);
      expect(strengthBefore).toBe(4);

      expect(
        testEngine.asPlayerOne().playCard(minnieMouseQuickthinkingInventor),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(minnieMouseQuickthinkingInventor, { targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(2);
    });

    it("can target an opponent's character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseQuickthinkingInventor],
          inkwell: minnieMouseQuickthinkingInventor.cost,
        },
        {
          deck: 2,
          play: [targetCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(minnieMouseQuickthinkingInventor),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(minnieMouseQuickthinkingInventor, { targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardStrength(targetCharacter)).toBe(2);
    });

    it("strength reduction expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseQuickthinkingInventor],
          inkwell: minnieMouseQuickthinkingInventor.cost,
          play: [targetCharacter],
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(minnieMouseQuickthinkingInventor),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(minnieMouseQuickthinkingInventor, { targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(2);

      // Pass both turns so we come back to player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Strength should be back to normal
      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(4);
    });
  });
});
