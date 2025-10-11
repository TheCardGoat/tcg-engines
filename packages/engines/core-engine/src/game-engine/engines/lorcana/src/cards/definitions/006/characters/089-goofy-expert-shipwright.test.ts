import { describe, expect, it } from "bun:test";
import { goofyExpertShipwright } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Goofy - Expert Shipwright", () => {
  it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [goofyExpertShipwright],
    });

    const cardUnderTest = testEngine.getCardModel(goofyExpertShipwright);
    expect(cardUnderTest.hasWard()).toBe(true);
  });

  it.skip("CLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: goofyExpertShipwright.cost,
      play: [goofyExpertShipwright],
      hand: [goofyExpertShipwright],
    });

    await testEngine.playCard(goofyExpertShipwright);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
