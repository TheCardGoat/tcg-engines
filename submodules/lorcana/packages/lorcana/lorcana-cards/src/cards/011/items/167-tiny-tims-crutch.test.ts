import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tinyTimsCrutch } from "./167-tiny-tims-crutch";

const supportedAlly = createMockCharacter({
  id: "tiny-tims-crutch-supported-ally",
  name: "Supported Ally",
  cost: 2,
});

describe("Tiny Tim's Crutch", () => {
  it("gives the chosen character Support this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [tinyTimsCrutch, supportedAlly],
      },
      {
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(tinyTimsCrutch, {
        targets: [supportedAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(supportedAlly, "Support")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(supportedAlly, "Support")).toBe(false);
  });
});
