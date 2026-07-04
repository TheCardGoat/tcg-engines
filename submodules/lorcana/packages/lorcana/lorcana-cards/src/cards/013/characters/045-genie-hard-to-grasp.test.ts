import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { genieHardToGrasp } from "./045-genie-hard-to-grasp";

describe("Genie - Hard to Grasp", () => {
  it("has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [genieHardToGrasp],
    });

    expect(testEngine.asPlayerOne().hasKeyword(genieHardToGrasp, "Evasive")).toBe(true);
  });
});
