import { describe, expect, it } from "bun:test";
import { jebidiahFarnsworthExpeditionCook } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
