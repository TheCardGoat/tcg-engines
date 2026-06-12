import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dumboTheFlyingElephant } from "./046-dumbo-the-flying-elephant";

const targetCharacter = createMockCharacter({
  id: "dumbo-flying-elephant-target",
  name: "Target Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Dumbo - The Flying Elephant (set9-046)", () => {
  it("has Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [dumboTheFlyingElephant],
    });

    expect(testEngine.asPlayerOne().getCard(dumboTheFlyingElephant)?.keywords).toContain("Evasive");
  });

  describe("AERIAL DUO - When you play this character, chosen character gains Evasive until the start of your next turn.", () => {
    it("grants Evasive to chosen character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dumboTheFlyingElephant],
          inkwell: dumboTheFlyingElephant.cost,
          play: [targetCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(dumboTheFlyingElephant)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffects.length).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(dumboTheFlyingElephant, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Evasive")).toBe(true);
    });

    it("Evasive persists until start of next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dumboTheFlyingElephant],
          inkwell: dumboTheFlyingElephant.cost,
          play: [targetCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(dumboTheFlyingElephant)).toBeSuccessfulCommand();

      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(dumboTheFlyingElephant, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(targetCharacter, "Evasive")).toBe(true);

      // After P1 passes turn, Evasive should still be active during P2's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(targetCharacter, "Evasive")).toBe(true);

      // After P2 passes turn (start of P1's next turn), Evasive should be gone
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.hasKeyword(targetCharacter, "Evasive")).toBe(false);
    });
  });
});
