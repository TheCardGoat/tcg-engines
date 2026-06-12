import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { leadTheWay } from "./129-lead-the-way";

describe("Lead the Way", () => {
  it("Your characters get +2 {S} this turn.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [leadTheWay],
        inkwell: leadTheWay.cost,
        play: [simbaProtectiveCub],
      },
      {},
    );

    const playResult = testEngine.asPlayerOne().playCard(leadTheWay);

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(simbaProtectiveCub)).toBe(
      simbaProtectiveCub.strength + 2,
    );
  });
});
