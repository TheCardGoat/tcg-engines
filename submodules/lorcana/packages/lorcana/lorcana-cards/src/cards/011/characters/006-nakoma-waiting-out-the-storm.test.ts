import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { nakomaWaitingOutTheStorm } from "./006-nakoma-waiting-out-the-storm";

describe("Nakoma - Waiting Out the Storm", () => {
  it("should be playable as a vanilla character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [nakomaWaitingOutTheStorm],
      inkwell: nakomaWaitingOutTheStorm.cost,
    });

    expect(testEngine.asPlayerOne().playCard(nakomaWaitingOutTheStorm)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(nakomaWaitingOutTheStorm)).toBe("play");
  });
});
