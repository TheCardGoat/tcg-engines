import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { youCanFly } from "../../002/actions/133-you-can-fly";
import { buzzLightyearGrounded } from "./076-buzz-lightyear-grounded";

describe("Buzz Lightyear - Grounded", () => {
  it("does not gain Evasive from an action", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [buzzLightyearGrounded],
      hand: [youCanFly],
      inkwell: youCanFly.cost,
      deck: [],
    });

    expect(testEngine.asPlayerOne().hasKeyword(buzzLightyearGrounded, "Evasive")).toBe(false);

    expect(
      testEngine.asPlayerOne().playCard(youCanFly, {
        targets: [buzzLightyearGrounded],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(buzzLightyearGrounded, "Evasive")).toBe(false);
  });
});
