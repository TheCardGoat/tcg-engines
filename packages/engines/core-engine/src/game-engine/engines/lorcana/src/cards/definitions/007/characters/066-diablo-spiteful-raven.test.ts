/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { diabloSpitefulRaven } from "~/game-engine/engines/lorcana/src/cards/definitions/007/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
