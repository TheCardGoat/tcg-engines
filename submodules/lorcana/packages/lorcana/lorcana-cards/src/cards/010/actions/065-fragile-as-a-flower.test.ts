import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { fragileAsAFlower } from "./065-fragile-as-a-flower";

describe("Fragile as a Flower", () => {
  it("keeps the chosen low-cost character exerted through their next ready step", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fragileAsAFlower],
        inkwell: fragileAsAFlower.cost,
        deck: 1,
      },
      {
        play: [simbaProtectiveCub],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(fragileAsAFlower, {
      targets: [simbaProtectiveCub],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).toHaveRestriction({
      card: simbaProtectiveCub,
      restriction: "cant-ready",
    });

    testEngine.asServer().passTurn();
    expect(testEngine.asPlayerTwo().isExerted(simbaProtectiveCub)).toBe(true);
  });
});
