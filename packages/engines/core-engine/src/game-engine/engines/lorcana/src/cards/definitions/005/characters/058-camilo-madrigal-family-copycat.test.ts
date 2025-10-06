/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  camiloMadrigalFamilyCopycat,
  zazuAdvisorToMufasa,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Camilo Madrigal - Family Copycat", () => {
  describe("**IMITATE** Whenever this character quests, you may gain lore equal to the {L} of chosen other character of yours. Return that character to your hand.", () => {
    it("should gain lore equal to the {L} of chosen other character of yours", () => {
      const testStore = new TestStore({
        play: [camiloMadrigalFamilyCopycat, zazuAdvisorToMufasa],
      });

      const cardUnderTest = testStore.getCard(camiloMadrigalFamilyCopycat);
      const otherCharacter = testStore.getCard(zazuAdvisorToMufasa);

      cardUnderTest.quest();

      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [otherCharacter] });

      expect(testStore.getPlayerLore("player_one")).toBe(
        zazuAdvisorToMufasa.lore + camiloMadrigalFamilyCopycat.lore,
      );
      expect(otherCharacter.zone).toBe("hand");
    });

    it("should NOT trigger if there's not another char", () => {
      const testStore = new TestStore({
        play: [camiloMadrigalFamilyCopycat],
      });

      const cardUnderTest = testStore.getCard(camiloMadrigalFamilyCopycat);

      cardUnderTest.quest();
      expect(testStore.stackLayers).toHaveLength(0);

      expect(testStore.getPlayerLore("player_one")).toBe(
        camiloMadrigalFamilyCopycat.lore,
      );
    });
  });
});
