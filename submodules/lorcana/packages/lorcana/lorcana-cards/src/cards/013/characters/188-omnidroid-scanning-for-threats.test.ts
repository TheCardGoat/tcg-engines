import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { omnidroidScanningForThreats } from "./188-omnidroid-scanning-for-threats";

describe("Omnidroid - Scanning for Threats", () => {
  it("gets +2 strength while it has no damage", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [omnidroidScanningForThreats],
    });

    expect(testEngine.getCard(omnidroidScanningForThreats).strength).toBe(
      omnidroidScanningForThreats.strength + 2,
    );
  });
});
