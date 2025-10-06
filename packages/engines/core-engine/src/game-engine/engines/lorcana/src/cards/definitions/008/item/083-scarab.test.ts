/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  palaceGuardSpectralSentry,
  scarab,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Scarab", () => {
  it("SEARCH THE SANDS {E} 2 {I} – Return an Illusion character card from your discard to your hand.", async () => {
    const testEngine = new TestEngine({
      inkwell: 2,
      play: [scarab],
      discard: [palaceGuardSpectralSentry],
    });

    await testEngine.activateCard(scarab, {
      targets: [palaceGuardSpectralSentry],
    });

    expect(testEngine.getCardModel(palaceGuardSpectralSentry).zone).toBe(
      "hand",
    );
  });
});
