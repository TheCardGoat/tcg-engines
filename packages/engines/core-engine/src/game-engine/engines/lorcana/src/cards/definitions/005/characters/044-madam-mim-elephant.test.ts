/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloGalacticHero } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { madamMimElephant } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Madam Mim - Elephant", () => {
  it.skip("**A LITTLE GAME** When you play this character, banish her or return another chosen character of yours to your hand.", () => {
    const testStore = new TestStore({
      inkwell: madamMimElephant.cost,
      hand: [madamMimElephant],
    });

    const cardUnderTest = testStore.getCard(madamMimElephant);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  describe("**SNEAKY MOVE** At the start of your turn, you may move up to 2 damage counters from this character to chosen opposing character.", () => {
    it("Moves 1 damage counters from Madam Mim to Lilo", () => {
      const testStore = new TestStore(
        {
          play: [liloGalacticHero],
        },
        {
          play: [madamMimElephant],
          deck: 1,
        },
      );

      const cardUnderTest = testStore.getCard(madamMimElephant);
      const targetCard = testStore.getCard(liloGalacticHero);
      cardUnderTest.updateCardDamage(1);

      testStore.passTurn();

      testStore.changePlayer("player_two");
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [targetCard] });

      expect(cardUnderTest.damage).toBe(0);
      expect(targetCard.damage).toBe(1);
    });
  });
});

describe("Regression test", () => {
  it("Doesn't trigger effect when there's no card to move damage to", () => {
    const testStore = new TestStore(
      {
        play: [madamMimElephant],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    testStore.passTurn();
    testStore.passTurn();

    expect(testStore.stackLayers).toHaveLength(0);
  });

  it("Doesn't trigger effect when there's no damage", () => {
    const testStore = new TestStore(
      {
        play: [madamMimElephant],
        deck: 2,
      },
      {
        deck: 2,
        play: [liloGalacticHero],
      },
    );

    testStore.passTurn();
    testStore.passTurn();

    expect(testStore.stackLayers).toHaveLength(0);
  });
});
