import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { montereyJackHypnotizedByCheese } from "./012-monterey-jack-hypnotized-by-cheese";
import { andysRoomHomeBase } from "../locations/034-andys-room-home-base";

const sturdyAlly = createMockCharacter({
  id: "mj-hyp-sturdy-ally",
  name: "Sturdy Ally",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const frailAlly = createMockCharacter({
  id: "mj-hyp-frail-ally",
  name: "Frail Ally",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
});

describe("Monterey Jack - Hypnotized by Cheese", () => {
  describe("BREAK THE TRANCE - This character can't quest unless you have a character with 4 {W} or more in play.", () => {
    it("has quest restriction when no character with 4+ willpower is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: montereyJackHypnotizedByCheese }, frailAlly],
      });

      expect(
        testEngine.asPlayerOne().getCard(montereyJackHypnotizedByCheese)?.hasQuestRestriction,
      ).toBe(true);
    });

    it("regression: lifts quest restriction when this character alone at a location gets buffed willpower above 4", () => {
      // Monterey Jack (3W base) is the only character at Andy's Room, which grants +2W (5W effective).
      // 5W >= 4W satisfies BREAK THE TRANCE — quest restriction must lift.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          andysRoomHomeBase,
          { card: montereyJackHypnotizedByCheese, isDrying: false, atLocation: andysRoomHomeBase },
        ],
        deck: [],
      });

      expect(
        testEngine.asPlayerOne().getCard(montereyJackHypnotizedByCheese)?.hasQuestRestriction,
      ).toBe(false);

      expect(
        testEngine.asPlayerOne().quest(montereyJackHypnotizedByCheese),
      ).toBeSuccessfulCommand();
    });

    it("lifts quest restriction once a character with 4+ willpower is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: sturdyAlly.cost,
        hand: [sturdyAlly],
        play: [{ card: montereyJackHypnotizedByCheese }],
      });

      expect(
        testEngine.asPlayerOne().getCard(montereyJackHypnotizedByCheese)?.hasQuestRestriction,
      ).toBe(true);

      expect(testEngine.asPlayerOne().playCard(sturdyAlly)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().getCard(montereyJackHypnotizedByCheese)?.hasQuestRestriction,
      ).toBe(false);
    });
  });
});
