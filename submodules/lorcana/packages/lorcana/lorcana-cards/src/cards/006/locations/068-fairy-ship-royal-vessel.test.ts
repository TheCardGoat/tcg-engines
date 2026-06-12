import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { fairyShipRoyalVessel } from "./068-fairy-ship-royal-vessel";

describe("Fairy Ship - Royal Vessel", () => {
  it("behaves as a vanilla location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [fairyShipRoyalVessel],
    });

    expect(testEngine.asPlayerOne().getCard(fairyShipRoyalVessel)?.lore).toBe(
      fairyShipRoyalVessel.lore,
    );
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
