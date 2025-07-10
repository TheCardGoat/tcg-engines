/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goofyExpertShipwright } from "@lorcanito/lorcana-engine/cards/006";
import { youCameBack } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
