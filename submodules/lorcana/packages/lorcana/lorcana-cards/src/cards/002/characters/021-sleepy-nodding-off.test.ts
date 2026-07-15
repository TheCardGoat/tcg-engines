import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { sleepyNoddingOff } from "./021-sleepy-nodding-off";

describe("Sleepy - Nodding Off", () => {
  it("YAWN! - Enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sleepyNoddingOff],
      inkwell: sleepyNoddingOff.cost,
    });

    expect(testEngine.asPlayerOne().playCard(sleepyNoddingOff)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(sleepyNoddingOff)).toBe(true);
  });
});
