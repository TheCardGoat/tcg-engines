import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, CANONICAL_PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { perditaPlayfulMother } from "./002-perdita-playful-mother";
import { rollyHungryPup } from "../../003/characters/021-rolly-hungry-pup";
import { mickeyMouseBraveLittleTailor } from "../../001/characters/115-mickey-mouse-brave-little-tailor";

describe("Perdita - Playful Mother", () => {
  describe("WHO'S NEXT? Whenever this character quests, you pay 2 {I} less for the next Puppy character you play this turn.", () => {
    it("should pay 2 less for the next Puppy character you play this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 10,
        play: [{ card: perditaPlayfulMother, isDrying: false }],
        hand: [rollyHungryPup],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(perditaPlayfulMother)).toBeSuccessfulCommand();

      // Rolly costs 3, but with 2 discount it should cost 1
      expect(testEngine.asPlayerOne().playCard(rollyHungryPup)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(rollyHungryPup)).toBe("play");
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(10 - 1);
    });

    it("should not discount the cost of non-Puppy characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 10,
        play: [{ card: perditaPlayfulMother, isDrying: false }],
        hand: [mickeyMouseBraveLittleTailor, rollyHungryPup],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(perditaPlayfulMother)).toBeSuccessfulCommand();

      // Mickey costs 8 and should NOT be discounted (not a Puppy)
      expect(
        testEngine.asPlayerOne().playCard(mickeyMouseBraveLittleTailor),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(10 - 8);

      // Rolly should still be discounted since the "next Puppy" discount wasn't consumed by non-Puppy Mickey
      expect(testEngine.asPlayerOne().playCard(rollyHungryPup)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getAvailableInk(CANONICAL_PLAYER_ONE)).toBe(10 - 8 - 1);
    });
  });

  describe("DON'T BE AFRAID Your Puppy characters gain Ward.", () => {
    it("should give Ward to Puppy characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: perditaPlayfulMother, isDrying: false },
          { card: rollyHungryPup, isDrying: false },
        ],
        deck: 3,
      });

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: rollyHungryPup,
        keyword: "Ward",
      });
    });

    it("should not give Ward to non-Puppy characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: perditaPlayfulMother, isDrying: false },
          { card: mickeyMouseBraveLittleTailor, isDrying: false },
        ],
        deck: 3,
      });

      expect(testEngine.hasKeyword(mickeyMouseBraveLittleTailor, "Ward")).toBe(false);
    });

    it("Perdita herself should not gain Ward", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: perditaPlayfulMother, isDrying: false }],
        deck: 3,
      });

      expect(testEngine.hasKeyword(perditaPlayfulMother, "Ward")).toBe(false);
    });
  });
});
