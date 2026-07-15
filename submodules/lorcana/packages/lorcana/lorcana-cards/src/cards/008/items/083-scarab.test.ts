import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { palaceGuardSpectralSentry } from "../characters/045-palace-guard-spectral-sentry";
import { scarab } from "./083-scarab";

const ordinaryDiscard = createMockCharacter({
  id: "scarab-ordinary-discard",
  name: "Ordinary Discard",
  cost: 2,
});

describe("Scarab", () => {
  it("returns an Illusion character card from your discard to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      discard: [palaceGuardSpectralSentry],
      inkwell: 2,
      play: [scarab],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(scarab, {
        ability: "SEARCH THE SANDS",
        targets: [palaceGuardSpectralSentry],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(palaceGuardSpectralSentry)).toBe("hand");
  });

  it("does not let you choose a non-Illusion character card in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      discard: [ordinaryDiscard],
      inkwell: 2,
      play: [scarab],
    });

    const result = testEngine.asPlayerOne().activateAbility(scarab, {
      ability: "SEARCH THE SANDS",
      targets: [ordinaryDiscard],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(ordinaryDiscard)).toBe("discard");
  });
});
