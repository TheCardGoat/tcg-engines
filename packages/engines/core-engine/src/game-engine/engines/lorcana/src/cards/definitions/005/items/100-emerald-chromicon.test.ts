/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { sisuEmpoweredSibling } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import {
  kronkUnlicensedInvestigator,
  mickeyMouseFoodFightDefender,
  royalGuardBovineProtector,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import { emeraldChromiconItem } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/index";
import {
  mickeyMouseGiantMouse,
  pullTheLever,
  wrongLeverAction,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { mrSmeeBumblingMate } from "../../003/characters";

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
  it("Should NOT trigger when returning to hand", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: wrongLeverAction.cost,
        hand: [wrongLeverAction],
        play: [goofyKnightForADay],
      },
      {
        play: [mickeyMouseGiantMouse, emeraldChromiconItem],
      },
    );

    await testEngine.playCard(wrongLeverAction, { mode: "1" }, true);
    await testEngine.resolveTopOfStack({ targets: [mickeyMouseGiantMouse] });

    expect(testEngine.getCardModel(mickeyMouseGiantMouse).zone).toBe("hand");

    expect(testEngine.stackLayers).toHaveLength(0);
  });

  it("Should NOT trigger when card is put at the bottom", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: wrongLeverAction.cost,
        discard: [pullTheLever],
        hand: [wrongLeverAction],
        play: [goofyKnightForADay],
      },
      {
        play: [mickeyMouseGiantMouse, emeraldChromiconItem],
      },
    );

    await testEngine.playCard(wrongLeverAction);

    await testEngine.resolveTopOfStack({ mode: "2" }, true);
    await testEngine.resolveTopOfStack({ targets: [pullTheLever] }, true);

    expect(testEngine.getCardModel(pullTheLever).zone).toBe("deck");
    expect(testEngine.stackLayers).toHaveLength(1);

    await testEngine.resolveTopOfStack({ targets: [mickeyMouseGiantMouse] });
    expect(testEngine.getCardModel(mickeyMouseGiantMouse).zone).toBe("deck");

    expect(testEngine.stackLayers).toHaveLength(0);
  });

  it("Mr Smee Interaction", async () => {
    const testEngine = new TestEngine(
      {
        play: [mrSmeeBumblingMate, emeraldChromiconItem],
      },
      {
        play: [emeraldChromiconItem],
      },
    );

    const smee = testEngine.getCardModel(mrSmeeBumblingMate);
    await testEngine.setCardDamage(mrSmeeBumblingMate, 2);
    expect(smee.damage).toBe(2);

    await testEngine.tapCard(mrSmeeBumblingMate);
    expect(smee.exerted).toBe(true);

    // Mr Smee damage himself at the end of the turn, which causes him to be banished
    // This should NOT trigger the Emerald Chromicon ability, because it is not an opponent's turn
    await testEngine.passTurn();

    expect(smee.zone).toBe("discard");
  });

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

    for (const card of [firstTarget, secondTarget, thirdTarget]) {
      expect(card.zone).toEqual("discard");
    }

    expect(testStore.stackLayers).toHaveLength(3);
  });
});
