import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { woodyTownSheriff } from "./013-woody-town-sheriff";

const opposingCharacter = createMockCharacter({
  id: "woody-town-sheriff-opposing",
  name: "Opposing Character",
  cost: 2,
});

describe("Woody - Town Sheriff", () => {
  it("prevents the chosen opposing character from challenging and makes them quest if able", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [woodyTownSheriff],
        inkwell: woodyTownSheriff.cost,
      },
      {
        play: [opposingCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(woodyTownSheriff, {
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(woodyTownSheriff, {
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().hasTemporaryRestriction(opposingCharacter, "cant-challenge"),
    ).toBe(true);
    expect(testEngine.asPlayerTwo().hasTemporaryRestriction(opposingCharacter, "must-quest")).toBe(
      true,
    );
  });
});
