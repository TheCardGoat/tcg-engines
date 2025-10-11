import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { rollyHungryPup } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { perditaPlayfulMother } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Perdita - Playful Mother", () => {
  describe("WHO'S NEXT? Whenever this character quests, you pay 2 {I} less for the next Puppy character you play this turn.", () => {
    it("should pay 2 less for the next Puppy character you play this turn", async () => {
      const testEngine = new TestEngine({
        inkwell: 10,
        play: [perditaPlayfulMother],
        hand: [rollyHungryPup],
      });
      const targetPuppy = testEngine.getCardModel(rollyHungryPup);

      expect(targetPuppy.cost).toBe(rollyHungryPup.cost);
      await testEngine.questCard(perditaPlayfulMother);
      expect(targetPuppy.cost).toBe(rollyHungryPup.cost - 2);

      await testEngine.playCard(rollyHungryPup);
      expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(9);
    });

    it("should not discount the cost of non-Puppy characters", async () => {
      const testEngine = new TestEngine({
        inkwell: 10,
        play: [perditaPlayfulMother],
        hand: [mickeyBraveLittleTailor, rollyHungryPup],
      });
      const targetNonPuppy = testEngine.getCardModel(mickeyBraveLittleTailor);

      expect(targetNonPuppy.cost).toBe(mickeyBraveLittleTailor.cost);
      await testEngine.questCard(perditaPlayfulMother);
      expect(targetNonPuppy.cost).toBe(mickeyBraveLittleTailor.cost);

      await testEngine.playCard(mickeyBraveLittleTailor);
      expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(2);

      await testEngine.playCard(rollyHungryPup);
      expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(1);
    });
  });

  describe("DON'T BE AFRAID Your Puppy characters gain Ward. (Opponents can't choose them except to challenge.)", () => {
    it("should give Ward only to Puppy characters", async () => {
      const testEngine = new TestEngine({
        inkwell: 10,
        play: [perditaPlayfulMother, rollyHungryPup, mickeyBraveLittleTailor],
        hand: [],
      });

      expect(testEngine.getCardModel(rollyHungryPup).hasAbility("ward")).toBe(
        true,
      );
      expect(
        testEngine.getCardModel(mickeyBraveLittleTailor).hasAbility("ward"),
      ).toBe(false);
      expect(
        testEngine.getCardModel(perditaPlayfulMother).hasAbility("ward"),
      ).toBe(false);
    });
  });
});
