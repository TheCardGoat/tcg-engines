/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { baymaxUpgradedRobot } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Baymax - Upgraded Robot", () => {
  it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [baymaxUpgradedRobot],
    });

    const cardUnderTest = testEngine.getCardModel(baymaxUpgradedRobot);
    expect(cardUnderTest.hasSupport).toBe(true);
  });

  it.skip("ADVANCED SCANNER When you play this character, look at the top 4 cards of your deck. You may reveal a Floodborn character card and put it into your hand. Put the rest on the bottom of your deck in any order.", async () => {
    const testEngine = new TestEngine({
      inkwell: baymaxUpgradedRobot.cost,
      hand: [baymaxUpgradedRobot],
    });

    await testEngine.playCard(baymaxUpgradedRobot);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
