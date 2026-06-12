import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { banzaiGluttonousPredator } from "./080-banzai-gluttonous-predator";

describe("Banzai - Gluttonous Predator", () => {
  it("is a vanilla 2/3/2/2 character", () => {
    expect(banzaiGluttonousPredator.cost).toBe(2);
    expect(banzaiGluttonousPredator.strength).toBe(3);
    expect(banzaiGluttonousPredator.willpower).toBe(2);
    expect(banzaiGluttonousPredator.lore).toBe(2);
    expect(banzaiGluttonousPredator.vanilla).toBe(true);
    expect(banzaiGluttonousPredator.inkable).toBe(false);
  });

  it("can quest for 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [banzaiGluttonousPredator],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(banzaiGluttonousPredator)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 2);
  });
});
