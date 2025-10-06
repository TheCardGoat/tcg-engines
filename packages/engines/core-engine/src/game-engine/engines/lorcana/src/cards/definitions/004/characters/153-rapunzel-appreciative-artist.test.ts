/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  pascalInquisitivePet,
  rapunzelAppreciativeArtist,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Rapunzel - Appreciative Artist", () => {
  it("**PERCEPTIVE PARTNER** While you have a character named Pascal in play, this character gains **Ward.** _(Opponents can't chose them except to challenge.)_", async () => {
    // Setup test with only Rapunzel in play
    const testEngine = new TestEngine({
      inkwell: rapunzelAppreciativeArtist.cost,
      play: [rapunzelAppreciativeArtist],
    });

    const rapunzelCard = testEngine.getCardModel(rapunzelAppreciativeArtist);

    // Test initial state (without Pascal)
    expect(rapunzelCard.hasWard).toBe(false);

    // Setup test with both Rapunzel and Pascal in play
    const testEngineWithPascal = new TestEngine({
      inkwell: rapunzelAppreciativeArtist.cost,
      play: [rapunzelAppreciativeArtist, pascalInquisitivePet],
    });

    const rapunzelCardWithPascal = testEngineWithPascal.getCardModel(
      rapunzelAppreciativeArtist,
    );

    // Test state with Pascal in play
    expect(rapunzelCardWithPascal.hasWard).toBe(true);
  });
});
