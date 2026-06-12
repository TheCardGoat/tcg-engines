import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { baymaxLowBattery } from "./087-baymax-low-battery";

describe("Baymax - Low Battery", () => {
  it("SHHHHH - Enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [{ card: baymaxLowBattery }],
      inkwell: Array.from({ length: 2 }).map(() => ({ card: baymaxLowBattery })),
    });

    const baymaxId = testEngine.findCardInstanceId(baymaxLowBattery, "hand");

    // Play Baymax
    testEngine.asPlayerOne().playCard(baymaxId);

    // Baymax should be in play and exerted
    const baymax = testEngine.asServer().getCard(baymaxId);
    expect(baymax.zone).toBe("play");
    expect(baymax.exerted).toBe(true);
  });
});
