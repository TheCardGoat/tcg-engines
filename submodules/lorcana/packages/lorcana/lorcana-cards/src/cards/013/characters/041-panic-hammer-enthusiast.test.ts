import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { panicHammerEnthusiast } from "./041-panic-hammer-enthusiast";

describe("Panic - Hammer Enthusiast", () => {
  it("has Rush", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [panicHammerEnthusiast],
    });

    expect(testEngine.asPlayerOne().hasKeyword(panicHammerEnthusiast, "Rush")).toBe(true);
  });
});
