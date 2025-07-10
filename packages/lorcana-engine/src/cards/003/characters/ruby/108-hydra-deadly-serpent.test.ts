/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { smash } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import {
  hydraDeadlySerpent,
  kingLouieBandleader,
  kitCloudkickerNavigator,
} from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Hydra - Deadly Serpent", () => {
  describe("**WATCH THE TEETH** When this character is damaged, deal the same amount of damage to a chosen opposing character.", () => {
    it("receives damage from action card", () => {
      const testStore = new TestStore(
        {
          inkwell: smash.cost,
          hand: [smash],
          play: [hydraDeadlySerpent],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      const cardUnderTest = testStore.getCard(hydraDeadlySerpent);
      const targetCard = testStore.getCard(goofyKnightForADay);
      const removalCard = testStore.getCard(smash);

      removalCard.playFromHand();
      testStore.resolveTopOfStack({ targets: [cardUnderTest] }, true);

      // Hydra adds a layer to the stack
      testStore.resolveTopOfStack({ targets: [targetCard] });

      expect(cardUnderTest.damage).toBe(3);
      expect(targetCard.damage).toBe(3);
    });

    it("receives damage from challenge and dies", () => {
      const testStore = new TestStore(
        {
          play: [hydraDeadlySerpent],
        },
        {
          play: [goofyKnightForADay, kingLouieBandleader],
        },
      );

      const cardUnderTest = testStore.getCard(hydraDeadlySerpent);
      const targetCard = testStore.getCard(goofyKnightForADay);
      const challenged = testStore.getCard(kingLouieBandleader);

      challenged.updateCardMeta({ exerted: true });
      cardUnderTest.challenge(challenged);

      testStore.resolveTopOfStack({ targets: [targetCard] });

      expect(cardUnderTest.zone).toEqual("discard");
      expect(targetCard.damage).toBe(challenged.strength);
    });
  });
});

describe("Regression", () => {
  it("Cancels effect when it doesn't find a valid target", async () => {
    const testEngine = new TestEngine(
      {
        play: [hydraDeadlySerpent],
      },
      {
        play: [goofyKnightForADay, kitCloudkickerNavigator],
      },
    );

    await testEngine.setCardDamage(
      goofyKnightForADay,
      goofyKnightForADay.willpower - 1,
    );
    await testEngine.tapCard(goofyKnightForADay);

    const { attacker, defender } = await testEngine.challenge({
      attacker: hydraDeadlySerpent,
      defender: goofyKnightForADay,
    });

    expect(attacker.isDead).toBe(true);
    expect(defender.isDead).toBe(true);

    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
