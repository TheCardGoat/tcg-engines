import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { auroraRegalPrincess } from "./161-aurora-regal-princess";

describe("Aurora - Regal Princess", () => {
  it("is a vanilla 2/2/2/2 character", () => {
    expect(auroraRegalPrincess.cost).toBe(2);
    expect(auroraRegalPrincess.strength).toBe(2);
    expect(auroraRegalPrincess.willpower).toBe(2);
    expect(auroraRegalPrincess.lore).toBe(2);
    expect(auroraRegalPrincess.vanilla).toBe(true);
  });

  it("can quest for 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [auroraRegalPrincess],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(auroraRegalPrincess)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 2);
  });
});
