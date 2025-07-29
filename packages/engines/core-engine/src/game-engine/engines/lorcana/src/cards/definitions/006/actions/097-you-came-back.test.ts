import { describe, expect, it } from "bun:test";
import { goofyExpertShipwright } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import { youCameBack } from "~/game-engine/engines/lorcana/src/cards/definitions/006/actions";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("You Came Back", () => {
  it("Ready chosen character.", async () => {
    const testEngine = new TestEngine({
      inkwell: youCameBack.cost,
      // Goofy has Ward
      play: [goofyExpertShipwright],
      hand: [youCameBack],
    });

    const cardTarget = testEngine.getCardModel(goofyExpertShipwright);

    await testEngine.tapCard(goofyExpertShipwright);

    expect(cardTarget.exerted).toBe(true);

    await testEngine.playCard(youCameBack, {
      targets: [goofyExpertShipwright],
    });

    expect(cardTarget.exerted).toBe(false);
  });
});
