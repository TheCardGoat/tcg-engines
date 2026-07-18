import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { hiddenCoveTranquilHaven } from "./102-hidden-cove-tranquil-haven";

const coveGuest = createMockCharacter({
  id: "set9-hidden-cove-guest",
  name: "Cove Guest",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const destination = createMockLocation({
  id: "set9-hidden-cove-destination",
  name: "Destination",
  cost: 1,
  moveCost: 1,
  willpower: 5,
  lore: 0,
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

  it("banishes a lethally damaged character when it moves away and loses +1 willpower", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        hiddenCoveTranquilHaven,
        destination,
        { card: coveGuest, atLocation: hiddenCoveTranquilHaven, damage: coveGuest.willpower },
      ],
      inkwell: destination.moveCost,
    });

    expect(testEngine.asPlayerOne().getCardZone(coveGuest)).toBe("play");
    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(coveGuest, destination),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(coveGuest)).toBe("discard");
  });
});
