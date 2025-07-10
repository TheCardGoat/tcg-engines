/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  palaceGuardSpectralSentry,
  scarab,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
