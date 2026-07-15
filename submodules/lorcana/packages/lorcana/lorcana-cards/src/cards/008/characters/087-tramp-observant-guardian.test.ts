import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { trampObservantGuardian } from "./087-tramp-observant-guardian";

const wardTarget = createMockCharacter({
  id: "tramp-og-test-target",
  name: "Ward Target",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Tramp - Observant Guardian", () => {
  describe("HOW DO I GET IN? - When you play this character, chosen character gains Ward until the start of your next turn.", () => {
    it("grants Ward to the chosen character after playing Tramp", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: trampObservantGuardian.cost,
          hand: [trampObservantGuardian],
          play: [wardTarget],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(wardTarget, "Ward")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(trampObservantGuardian)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(trampObservantGuardian, {
          resolveOptional: true,
          targets: [wardTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(wardTarget, "Ward")).toBe(true);
    });

    it("Ward expires at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: trampObservantGuardian.cost,
          hand: [trampObservantGuardian],
          play: [wardTarget],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(trampObservantGuardian)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(trampObservantGuardian, {
          resolveOptional: true,
          targets: [wardTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(wardTarget, "Ward")).toBe(true);

      // Player one passes turn — Ward should still be active during opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(wardTarget, "Ward")).toBe(true);

      // Opponent passes turn — Ward should expire at start of player one's next turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(wardTarget, "Ward")).toBe(false);
    });
  });
});
