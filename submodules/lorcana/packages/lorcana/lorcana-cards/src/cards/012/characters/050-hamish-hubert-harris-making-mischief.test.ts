import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hamishHubertHarrisMakingMischief } from "./050-hamish-hubert-harris-making-mischief";

const opposingCharacter = createMockCharacter({
  id: "hamish-opposing",
  name: "Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Hamish, Hubert & Harris - Making Mischief", () => {
  describe("STAY QUIET - This character may enter play exerted.", () => {
    it("enters play ready by default", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [hamishHubertHarrisMakingMischief],
        inkwell: hamishHubertHarrisMakingMischief.cost,
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().playCard(hamishHubertHarrisMakingMischief),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(hamishHubertHarrisMakingMischief)).toBe(false);
    });

    it("may enter play exerted when resolveOptional is true", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [hamishHubertHarrisMakingMischief],
        inkwell: hamishHubertHarrisMakingMischief.cost,
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().playCard(hamishHubertHarrisMakingMischief, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().isExerted(hamishHubertHarrisMakingMischief)).toBe(true);
    });
  });

  describe("CLEVER TRAP - At end of your turn, if exerted, chosen opposing character can't ready at the start of their next turn.", () => {
    it("prevents chosen opposing character from readying at start of their turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: hamishHubertHarrisMakingMischief, exerted: true }],
          deck: 3,
        },
        {
          play: [{ card: opposingCharacter, exerted: true }],
          deck: 3,
        },
      );

      // Hamish is exerted; opposing character is also exerted
      expect(testEngine.asPlayerOne().isExerted(hamishHubertHarrisMakingMischief)).toBe(true);
      expect(testEngine.isExerted(opposingCharacter)).toBe(true);

      // P1 passes → end-of-turn trigger fires (condition: is-exerted passes)
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const opposingId = testEngine.findCardInstanceId(opposingCharacter, "play", "player_two");
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(hamishHubertHarrisMakingMischief, {
          targets: [opposingId],
        }),
      ).toBeSuccessfulCommand();

      // P2's turn starts — the targeted opposing character should NOT ready
      expect(testEngine.isExerted(opposingCharacter)).toBe(true);
    });

    it("does not trigger when Hamish is NOT exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: hamishHubertHarrisMakingMischief, exerted: false }],
          deck: 3,
        },
        {
          play: [{ card: opposingCharacter, exerted: true }],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().isExerted(hamishHubertHarrisMakingMischief)).toBe(false);

      // P1 passes → CLEVER TRAP fires but condition (is-exerted) fails → no effect
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // P2's turn: opposing character normally readies
      expect(testEngine.isExerted(opposingCharacter)).toBe(false);
    });
  });
});
