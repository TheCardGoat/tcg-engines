import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { captainAmeliaFirstInCommand } from "./138-captain-amelia-first-in-command";

describe("Captain Amelia - First in Command", () => {
  it("gains Evasive during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [captainAmeliaFirstInCommand],
    });

    expect(testEngine.asPlayerOne().hasKeyword(captainAmeliaFirstInCommand, "Evasive")).toBe(true);
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(captainAmeliaFirstInCommand, "Evasive")).toBe(false);
  });
});
