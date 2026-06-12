import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hiddenCoveTranquilHaven } from "./102-hidden-cove-tranquil-haven";

const coveGuest = createMockCharacter({
  id: "set9-hidden-cove-guest",
  name: "Cove Guest",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Hidden Cove - Tranquil Haven", () => {
  it("gives characters here +1 strength and +1 willpower", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hiddenCoveTranquilHaven, coveGuest],
      inkwell: hiddenCoveTranquilHaven.moveCost,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(coveGuest, hiddenCoveTranquilHaven).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCard(coveGuest)?.strength).toBe(coveGuest.strength + 1);
    expect(testEngine.asPlayerOne().getCard(coveGuest)?.willpower).toBe(coveGuest.willpower + 1);
  });
});
