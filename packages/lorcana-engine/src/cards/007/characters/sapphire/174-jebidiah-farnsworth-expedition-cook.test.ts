/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { jebidiahFarnsworthExpeditionCook } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Jebidiah Farnsworth - Expedition Cook", () => {
  it.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
    const testEngine = new TestEngine({
      play: [jebidiahFarnsworthExpeditionCook],
    });

    const cardUnderTest = testEngine.getCardModel(
      jebidiahFarnsworthExpeditionCook,
    );
    expect(cardUnderTest.hasSupport).toBe(true);
  });

  it.skip("I GOT YOUR FOUR BASIC FOOD GROUPS When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)", async () => {
    const testEngine = new TestEngine({
      inkwell: jebidiahFarnsworthExpeditionCook.cost,
      hand: [jebidiahFarnsworthExpeditionCook],
    });

    await testEngine.playCard(jebidiahFarnsworthExpeditionCook);
    await testEngine.acceptOptionalLayer();
    await testEngine.resolveTopOfStack({});
  });
});
