import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { palaceGuardSpectralSentry } from "./045-palace-guard-spectral-sentry";
import { angelExperiment624 } from "../../011";
import { liloMakingAWish } from "../../001";

describe("Palace Guard - Spectral Sentry", () => {
  it("does not vanish when chosen by Angel's activated ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [angelExperiment624],
        hand: [liloMakingAWish],
        deck: 5,
      },
      {
        play: [palaceGuardSpectralSentry],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(angelExperiment624, {
        costs: { discardCards: [liloMakingAWish] },
        targets: [palaceGuardSpectralSentry],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(palaceGuardSpectralSentry)).toBe("play");
    expect(testEngine.asPlayerTwo().getDamage(palaceGuardSpectralSentry)).toBe(2);
  });
});
