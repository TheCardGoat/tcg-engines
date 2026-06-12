import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { simbaProtectiveCub } from "../../001";
import { ghostlyTale } from "./132-ghostly-tale";

describe("Ghostly Tale", () => {
  it("exerts only opposing characters with 2 strength or less", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [ghostlyTale],
        inkwell: ghostlyTale.cost,
      },
      {
        play: [simbaProtectiveCub, goofyKnightForADay],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(ghostlyTale);

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(simbaProtectiveCub)).toBe(true);
    expect(testEngine.asPlayerTwo().isExerted(goofyKnightForADay)).toBe(false);
  });
});
