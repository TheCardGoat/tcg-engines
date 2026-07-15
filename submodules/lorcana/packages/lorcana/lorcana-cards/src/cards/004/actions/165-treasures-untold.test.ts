import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { shieldOfVirtue } from "../../001/items/135-shield-of-virtue";
import { pawpsicle } from "../../002";
import { treasuresUntold } from "./165-treasures-untold";

describe("Treasures Untold", () => {
  it("returns up to 2 item cards from your discard to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [treasuresUntold],
      inkwell: treasuresUntold.cost,
      discard: [shieldOfVirtue, pawpsicle],
    });

    expect(
      testEngine.asPlayerOne().playCard(treasuresUntold, {
        targets: [shieldOfVirtue, pawpsicle],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(shieldOfVirtue)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(pawpsicle)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 2, discard: 1 }),
    );
  });
});
