/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { marchHareAbsurdHost } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";

describe("March Hare - Absurd Host", () => {
  it.skip("Rush (This character can challenge the turn they're played.)", async () => {
    const testEngine = new TestEngine({
      play: [marchHareAbsurdHost],
    });

    const cardUnderTest = testEngine.getCardModel(marchHareAbsurdHost);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
