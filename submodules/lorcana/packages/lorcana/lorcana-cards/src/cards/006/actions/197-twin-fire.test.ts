import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001/characters";
import { gadgetHackwrenchPerceptiveMouse } from "../characters";
import { sailTheAzuriteSea } from "./163-sail-the-azurite-sea";
import { twinFire } from "./197-twin-fire";

describe("Twin Fire", () => {
  it("deals 2 damage, then can discard a card to deal 2 damage again", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [twinFire, sailTheAzuriteSea],
        inkwell: twinFire.cost,
      },
      {
        play: [gadgetHackwrenchPerceptiveMouse, simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(twinFire, { targets: [gadgetHackwrenchPerceptiveMouse] })
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerTwo().getDamage(gadgetHackwrenchPerceptiveMouse)).toBe(2);

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(twinFire, {
        resolveOptional: true,
        targets: [sailTheAzuriteSea, simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(sailTheAzuriteSea)).toBe("discard");
    expect(testEngine.asPlayerTwo().getDamage(simbaProtectiveCub)).toBe(2);
  });

  it("deals only 2 damage when the optional part is declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [twinFire, sailTheAzuriteSea],
        inkwell: twinFire.cost,
      },
      {
        play: [gadgetHackwrenchPerceptiveMouse, simbaProtectiveCub],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(twinFire, { targets: [gadgetHackwrenchPerceptiveMouse] })
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerTwo().getDamage(gadgetHackwrenchPerceptiveMouse)).toBe(2);

    expect(
      testEngine.asPlayerOne().resolvePendingEffect(twinFire, {
        resolveOptional: false,
      }).success,
    ).toBe(true);

    // Hand should still have sailTheAzuriteSea (not discarded)
    expect(testEngine.asPlayerOne().getCardZone(sailTheAzuriteSea)).toBe("hand");
    // simba should have no damage
    expect(testEngine.asPlayerTwo().getDamage(simbaProtectiveCub)).toBe(0);
  });
});
