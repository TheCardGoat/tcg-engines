/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { kenaiMagicalBear } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Kenai - Magical Bear", () => {
  it.skip("Challenger +2 (While challenging, this character gets +2 {}). WISDOM OF HIS STORY During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      play: [kenaiMagicalBear],
    });

    const cardUnderTest = testEngine.getCardModel(kenaiMagicalBear);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
