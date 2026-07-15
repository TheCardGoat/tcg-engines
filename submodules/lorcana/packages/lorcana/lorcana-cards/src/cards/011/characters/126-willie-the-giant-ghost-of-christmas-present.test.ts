import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { willieTheGiantGhostOfChristmasPresent } from "./126-willie-the-giant-ghost-of-christmas-present";

describe("Willie the Giant - Ghost of Christmas Present", () => {
  it("is playable and enters play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [willieTheGiantGhostOfChristmasPresent],
      inkwell: willieTheGiantGhostOfChristmasPresent.cost,
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(willieTheGiantGhostOfChristmasPresent),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(willieTheGiantGhostOfChristmasPresent)).toBe(
      "play",
    );
  });

  it.todo("regression: should use cards put under via external effects like Lonely Grave for THE FOOD OF GENEROSITY check", () => {});
});
