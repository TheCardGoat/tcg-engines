import { describe, expect, it } from "bun:test";
import { mauiHalfshark } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Maui - Half-Shark", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [mauiHalfshark],
    });

    const cardUnderTest = testEngine.getCardModel(mauiHalfshark);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it.skip("CHEEEEOHOOOO! Whenever this character challenges another character, you may return an action card from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: mauiHalfshark.cost,
      play: [mauiHalfshark],
      hand: [mauiHalfshark],
    });

    await testEngine.playCard(mauiHalfshark);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });

  it.skip("WAYFINDING Whenever you play an action, gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: mauiHalfshark.cost,
      play: [mauiHalfshark],
      hand: [mauiHalfshark],
    });

    await testEngine.playCard(mauiHalfshark);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
