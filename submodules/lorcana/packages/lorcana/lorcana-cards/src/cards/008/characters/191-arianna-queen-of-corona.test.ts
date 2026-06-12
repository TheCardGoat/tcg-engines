import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { ariannaQueenOfCorona } from "./191-arianna-queen-of-corona";

describe("Arianna - Queen of Corona", () => {
  it("is a vanilla 5/5/5/2 character", () => {
    expect(ariannaQueenOfCorona.cost).toBe(5);
    expect(ariannaQueenOfCorona.strength).toBe(5);
    expect(ariannaQueenOfCorona.willpower).toBe(5);
    expect(ariannaQueenOfCorona.lore).toBe(2);
    expect(ariannaQueenOfCorona.vanilla).toBe(true);
  });

  it("can quest for 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ariannaQueenOfCorona],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(ariannaQueenOfCorona)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 2);
  });
});
