/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { madamMimTinyAdversary } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Madam Mim - Tiny Adversary", () => {
  it.skip("Challenger +1 (While challenging, this character gets +1 {S}.)", async () => {
    const testEngine = new TestEngine({
      play: [madamMimTinyAdversary],
    });

    const cardUnderTest = testEngine.getCardModel(madamMimTinyAdversary);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });

  it.skip("ZIM ZABBERIM ZIM Your other characters gain Challenger +1.", async () => {
    const testEngine = new TestEngine({
      inkwell: madamMimTinyAdversary.cost,
      play: [madamMimTinyAdversary],
      hand: [madamMimTinyAdversary],
    });

    await testEngine.playCard(madamMimTinyAdversary);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
