/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { diabloSpitefulRaven } from "@lorcanito/lorcana-engine/cards/007/index";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Diablo - Spiteful Raven", () => {
  it.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [diabloSpitefulRaven],
    });

    const cardUnderTest = testEngine.getCardModel(diabloSpitefulRaven);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it.skip("Challenger +2 (While challenging, this character gets +2 {S})", async () => {
    const testEngine = new TestEngine({
      play: [diabloSpitefulRaven],
    });

    const cardUnderTest = testEngine.getCardModel(diabloSpitefulRaven);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
