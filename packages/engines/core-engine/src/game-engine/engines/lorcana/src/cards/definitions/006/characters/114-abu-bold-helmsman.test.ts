/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { abuBoldHelmsman } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Abu - Bold Helmsman", () => {
  it.skip("Rush (This character can challenge the turn they’re played.)", async () => {
    const testEngine = new TestEngine({
      play: [abuBoldHelmsman],
    });

    const cardUnderTest = testEngine.getCardModel(abuBoldHelmsman);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
