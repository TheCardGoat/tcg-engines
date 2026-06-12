import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { merlinGoat } from "./051-merlin-goat";
import { letItGo } from "../../001/actions/163-let-it-go";

describe("Merlin - Goat", () => {
  describe("HERE I COME! - When you play this character and when he leaves play, gain 1 lore.", () => {
    it("should gain 1 lore when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [merlinGoat],
        inkwell: merlinGoat.cost,
        deck: 5,
      });

      const loreBefore = testEngine.getLore(PLAYER_ONE);
      expect(testEngine.asPlayerOne().playCard(merlinGoat)).toBeSuccessfulCommand();

      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        const effects = testEngine.asPlayerOne().getBagEffects();
        if (effects.length > 0) {
          testEngine.asPlayerOne().resolvePendingByCard(merlinGoat);
        }
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("should gain 1 lore when leaves play via put-into-inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [merlinGoat],
          deck: 5,
        },
        {
          inkwell: letItGo.cost,
          hand: [letItGo],
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(letItGo, { targets: [merlinGoat] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(merlinGoat)).toBe("inkwell");

      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        const effects = testEngine.asPlayerOne().getBagEffects();
        if (effects.length > 0) {
          testEngine.asPlayerOne().resolvePendingByCard(merlinGoat);
        }
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("should gain 2 lore total when played and then leaves play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: merlinGoat.cost,
          hand: [merlinGoat],
          deck: 5,
        },
        {
          inkwell: letItGo.cost,
          hand: [letItGo],
          deck: 5,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(merlinGoat)).toBeSuccessfulCommand();

      const playBagCount = testEngine.asPlayerOne().getBagCount();
      if (playBagCount > 0) {
        const effects = testEngine.asPlayerOne().getBagEffects();
        if (effects.length > 0) {
          testEngine.asPlayerOne().resolvePendingByCard(merlinGoat);
        }
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(letItGo, { targets: [merlinGoat] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(merlinGoat)).toBe("inkwell");

      const leaveBagCount = testEngine.asPlayerOne().getBagCount();
      if (leaveBagCount > 0) {
        const effects = testEngine.asPlayerOne().getBagEffects();
        if (effects.length > 0) {
          testEngine.asPlayerOne().resolvePendingByCard(merlinGoat);
        }
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 2);
    });
  });
});
