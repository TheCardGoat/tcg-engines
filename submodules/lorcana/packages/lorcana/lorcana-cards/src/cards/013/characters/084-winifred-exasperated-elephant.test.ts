import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { winifredExasperatedElephant } from "./084-winifred-exasperated-elephant";

describe("Winifred - Exasperated Elephant", () => {
  it("has Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [winifredExasperatedElephant],
    });

    expect(testEngine.asPlayerOne().hasKeyword(winifredExasperatedElephant, "Ward")).toBe(true);
  });
});
