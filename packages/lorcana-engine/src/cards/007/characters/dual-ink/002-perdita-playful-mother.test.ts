/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { rollyHungryPup } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { perditaPlayfulMother } from "@lorcanito/lorcana-engine/cards/007";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
