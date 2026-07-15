import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { arthurWart } from "./190-arthur-wart";

describe("Arthur - Wart", () => {
  it("is a vanilla 2/2/2/2 character", () => {
    expect(arthurWart.cost).toBe(2);
    expect(arthurWart.strength).toBe(2);
    expect(arthurWart.willpower).toBe(2);
    expect(arthurWart.lore).toBe(2);
    expect(arthurWart.vanilla).toBe(true);
  });

  it("can quest for 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arthurWart],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(arthurWart)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 2);
  });
});
