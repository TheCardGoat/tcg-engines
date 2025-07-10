/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  goofyKnightForADay,
  sisuDivineWaterDragon,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { sisuEmpoweredSibling } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import {
  kronkUnlicensedInvestigator,
  mickeyMouseFoodFightDefender,
  royalGuardBovineProtector,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { emeraldChromiconItem } from "@lorcanito/lorcana-engine/cards/005/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Emerald Chromicon", () => {
  describe("**EMERALD LIGHT** During opponents’ turns, whenever one of your characters is banished, you may return chosen character to their player’s hand.", () => {
    it("Opponent attacking", () => {
      const testStore = new TestStore(
        {
          play: [goofyKnightForADay],
        },
        {
          play: [emeraldChromiconItem, royalGuardBovineProtector],
        },
      );

      const attacker = testStore.getCard(goofyKnightForADay);
      const defender = testStore.getCard(royalGuardBovineProtector);

      defender.updateCardMeta({ exerted: true });
      attacker.challenge(defender);

      expect(testStore.stackLayers).toHaveLength(1);
    });

    it("You Attacking", () => {
      const testStore = new TestStore(
        {
          play: [emeraldChromiconItem, goofyKnightForADay],
        },
        {
          play: [royalGuardBovineProtector],
        },
      );

      const attacker = testStore.getCard(goofyKnightForADay);
      const defender = testStore.getCard(royalGuardBovineProtector);

      defender.updateCardMeta({ exerted: true });
      attacker.challenge(defender);

      expect(testStore.stackLayers).toHaveLength(0);
    });
  });
});

describe("Regression", () => {
  it("Adds three layers onto the stack when removed by Sisu", () => {
    const testStore = new TestStore(
      {
        inkwell: sisuEmpoweredSibling.cost,
        hand: [sisuEmpoweredSibling],
      },
      {
        play: [
          emeraldChromiconItem,
          royalGuardBovineProtector,
          mickeyMouseFoodFightDefender,
          kronkUnlicensedInvestigator,
        ],
      },
    );

    const removal = testStore.getCard(sisuEmpoweredSibling);

    const firstTarget = testStore.getCard(royalGuardBovineProtector);
    const secondTarget = testStore.getCard(mickeyMouseFoodFightDefender);
    const thirdTarget = testStore.getCard(kronkUnlicensedInvestigator);

    removal.playFromHand();

    [firstTarget, secondTarget, thirdTarget].forEach((card) => {
      expect(card.zone).toEqual("discard");
    });

    expect(testStore.stackLayers).toHaveLength(3);
  });
});
