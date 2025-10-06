/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { goonsMaleficent } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { missBiancaIndefectibleAgent } from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Miss Bianca - Indefectible Agent", () => {
  it("KEEP HOPE Playing this character costs you 2 {I} less if you have an Ally character in play.", async () => {
    const testStore = new TestStore({
      inkwell: missBiancaIndefectibleAgent.cost - 2,
      hand: [missBiancaIndefectibleAgent],
      play: [goonsMaleficent],
    });

    const cardUnderTest = testStore.getCard(missBiancaIndefectibleAgent);

    cardUnderTest.playFromHand();
    expect(cardUnderTest.zone).toEqual("play");
    expect(testStore.getAvailableInkwellCardCount()).toEqual(0);
  });
});
