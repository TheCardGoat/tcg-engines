/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  banzaiVoraciousPredator,
  edLaughingHyena,
  shenziHeadHyena,
  shenziScarsAccomplice,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Shenzi - Head Hyena", () => {
  it("**STICK AROUND FOR DINNER** This character gets +1 {S} for each other Hyena character you have in play.", () => {
    const testStore = new TestStore({
      inkwell: shenziScarsAccomplice.cost + edLaughingHyena.cost,
      hand: [shenziScarsAccomplice, edLaughingHyena],
      play: [shenziHeadHyena],
    });

    const cardUnderTest = testStore.getCard(shenziHeadHyena);

    expect(cardUnderTest.strength).toBe(shenziHeadHyena.strength);

    testStore.getCard(shenziScarsAccomplice).playFromHand();

    expect(cardUnderTest.strength).toBe(shenziHeadHyena.strength + 1);

    testStore.getCard(edLaughingHyena).playFromHand();

    expect(cardUnderTest.strength).toBe(shenziHeadHyena.strength + 2);
  });

  describe("**WHAT HAVE WE GOT HERE?** Whenever one of your Hyena characters challenges a damaged character, gain 2 lore.", () => {
    it("Should gain 2 lore when Shenzi challenges a damaged character", () => {
      const testStore = new TestStore(
        {
          play: [
            shenziHeadHyena,
            shenziScarsAccomplice,
            banzaiVoraciousPredator,
          ],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      const cardUnderTest = testStore.getCard(shenziHeadHyena);
      const attacker = testStore.getCard(shenziScarsAccomplice);
      const anotherAttacker = testStore.getCard(banzaiVoraciousPredator);
      const defender = testStore.getCard(goofyKnightForADay);

      defender.updateCardMeta({ exerted: true });

      expect(testStore.store.tableStore.getTable("player_one").lore).toBe(0);

      attacker.challenge(defender); // No lore gain as defender is not damaged
      expect(testStore.store.tableStore.getTable("player_one").lore).toBe(0);

      anotherAttacker.challenge(defender);
      expect(testStore.store.tableStore.getTable("player_one").lore).toBe(2);

      cardUnderTest.challenge(defender);
      expect(testStore.store.tableStore.getTable("player_one").lore).toBe(4);
    });
  });
});
