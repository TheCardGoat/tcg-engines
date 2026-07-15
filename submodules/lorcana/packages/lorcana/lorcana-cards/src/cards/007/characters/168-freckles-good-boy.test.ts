import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { frecklesGoodBoy } from "./168-freckles-good-boy";

describe("Freckles - Good Boy", () => {
  it("JUST SO CUTE! When you play this character, chosen opposing character gets -1 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [frecklesGoodBoy],
        inkwell: frecklesGoodBoy.cost,
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    expect(testEngine.asPlayerOne().playCard(frecklesGoodBoy)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(frecklesGoodBoy, {
        targets: [simbaProtectiveCub],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(
      simbaProtectiveCub.strength - 1,
    );
  });
});
