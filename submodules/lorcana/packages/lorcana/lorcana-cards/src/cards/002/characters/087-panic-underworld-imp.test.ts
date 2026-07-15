import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { panicUnderworldImp } from "./087-panic-underworld-imp";
import { painUnderworldImp } from "./086-pain-underworld-imp";

const genericAlly = createMockCharacter({
  id: "panic-test-generic-ally",
  name: "Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Panic - Underworld Imp", () => {
  describe("I CAN HANDLE IT - When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.", () => {
    it("gives +4 strength when targeting Pain", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [panicUnderworldImp],
        inkwell: panicUnderworldImp.cost,
        play: [painUnderworldImp],
        deck: 1,
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(painUnderworldImp);

      expect(testEngine.asPlayerOne().playCard(panicUnderworldImp)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(panicUnderworldImp, { targets: [painUnderworldImp] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(painUnderworldImp)).toBe(strengthBefore + 4);
    });

    it("gives +2 strength when NOT targeting Pain", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [panicUnderworldImp],
        inkwell: panicUnderworldImp.cost,
        play: [genericAlly],
        deck: 1,
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(genericAlly);

      expect(testEngine.asPlayerOne().playCard(panicUnderworldImp)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(panicUnderworldImp, { targets: [genericAlly] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(genericAlly)).toBe(strengthBefore + 2);
    });

    it("strength bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [panicUnderworldImp],
          inkwell: panicUnderworldImp.cost,
          play: [painUnderworldImp],
          deck: 1,
        },
        {
          deck: 1,
        },
      );

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(painUnderworldImp);

      expect(testEngine.asPlayerOne().playCard(panicUnderworldImp)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(panicUnderworldImp, { targets: [painUnderworldImp] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(painUnderworldImp)).toBe(strengthBefore + 4);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(painUnderworldImp)).toBe(strengthBefore);
    });
  });
});
