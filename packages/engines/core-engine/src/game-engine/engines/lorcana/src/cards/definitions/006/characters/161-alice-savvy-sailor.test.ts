import { describe, expect, it } from "bun:test";
import { aliceSavvySailor } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Alice - Savvy Sailor", () => {
  it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
    const testEngine = new TestEngine({
      play: [aliceSavvySailor],
    });

    const cardUnderTest = testEngine.getCardModel(aliceSavvySailor);
    expect(cardUnderTest.hasWard()).toBe(true);
  });

  it.skip("AHOY! Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.", async () => {
    const testEngine = new TestEngine({
      inkwell: aliceSavvySailor.cost,
      play: [aliceSavvySailor],
      hand: [aliceSavvySailor],
    });

    await testEngine.playCard(aliceSavvySailor);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
