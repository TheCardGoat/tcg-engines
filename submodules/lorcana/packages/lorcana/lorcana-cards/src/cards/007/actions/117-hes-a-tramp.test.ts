import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { goonsMaleficentsUnderlings, heiheiBoatSnack, simbaProtectiveCub } from "../../001";
import { hesATramp } from "./117-hes-a-tramp";

describe("He's a Tramp", () => {
  it("gives the chosen character strength equal to the number of your characters in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [hesATramp],
        inkwell: hesATramp.cost,
        deck: [goonsMaleficentsUnderlings, heiheiBoatSnack],
        play: [goonsMaleficentsUnderlings, heiheiBoatSnack],
      },
      {
        deck: [simbaProtectiveCub, simbaProtectiveCub],
        play: [simbaProtectiveCub],
      },
    );

    const strengthBefore = testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub);

    expect(
      testEngine.asPlayerOne().playCard(hesATramp, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(strengthBefore + 2);

    testEngine.asServer().passTurn();

    expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(strengthBefore);
  });
});
