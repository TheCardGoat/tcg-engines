/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goofyExpertShipwright } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Goofy - Expert Shipwright", () => {
  it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [goofyExpertShipwright],
    });

    const cardUnderTest = testEngine.getCardModel(goofyExpertShipwright);
    expect(cardUnderTest.hasWard).toBe(true);
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
