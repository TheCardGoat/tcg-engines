import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { miloThatchUndauntedScholar } from "./145-milo-thatch-undaunted-scholar";

const testAction = createMockAction({
  id: "milo-test-action",
  name: "Test Action",
  cost: 1,
  text: "A Test Action",
  abilities: [
    {
      type: "action",
      effect: {
        type: "draw",
        amount: 1,
      },
    },
  ],
});

const targetCharacter = createMockCharacter({
  id: "milo-target-char",
  name: "Target Character",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Milo Thatch - Undaunted Scholar", () => {
  describe("I'M YOUR GUY - Whenever you play an action, you may give chosen character +2 {S} this turn.", () => {
    it("triggers when an action is played and gives +2 strength to chosen character this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [miloThatchUndauntedScholar, targetCharacter],
        hand: [testAction],
        inkwell: testAction.cost,
        deck: 2,
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(targetCharacter);

      expect(testEngine.asPlayerOne().playCard(testAction)).toBeSuccessfulCommand();

      // Triggered optional ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      // Accept the optional trigger
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(miloThatchUndauntedScholar, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose target character
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      // Target should have +2 strength
      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(strengthBefore + 2);
    });

    it("is optional — can decline the trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [miloThatchUndauntedScholar, targetCharacter],
        hand: [testAction],
        inkwell: testAction.cost,
        deck: 2,
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(targetCharacter);

      expect(testEngine.asPlayerOne().playCard(testAction)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      // Decline the optional trigger
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(miloThatchUndauntedScholar, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Strength should be unchanged
      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(strengthBefore);
    });

    it("+2 strength bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [miloThatchUndauntedScholar, targetCharacter],
          hand: [testAction],
          inkwell: testAction.cost,
          deck: 5,
        },
        { deck: 5 },
      );

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(targetCharacter);

      expect(testEngine.asPlayerOne().playCard(testAction)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(miloThatchUndauntedScholar, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(strengthBefore + 2);

      // Pass turns
      testEngine.asServer().passTurn();
      testEngine.asServer().passTurn();

      // Boost should be gone
      expect(testEngine.asPlayerOne().getCardStrength(targetCharacter)).toBe(strengthBefore);
    });
  });
});
