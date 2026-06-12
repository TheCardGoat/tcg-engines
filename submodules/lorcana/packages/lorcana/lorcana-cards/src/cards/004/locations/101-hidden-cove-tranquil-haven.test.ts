import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { hiddenCoveTranquilHaven } from "./101-hidden-cove-tranquil-haven";

const coveGuest = createMockCharacter({
  id: "hidden-cove-guest",
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

  it("does not buff characters at a different location", () => {
    const otherLocation = createMockLocation({
      id: "other-location",
      name: "Other Location",
      cost: 1,
      moveCost: 1,
    });
    const otherGuest = createMockCharacter({
      id: "other-guest",
      name: "Other Guest",
      cost: 2,
      strength: 3,
      willpower: 3,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hiddenCoveTranquilHaven, coveGuest, otherLocation, otherGuest],
      inkwell: 2,
    });

    testEngine.asPlayerOne().moveCharacterToLocation(coveGuest, hiddenCoveTranquilHaven);
    testEngine.asPlayerOne().moveCharacterToLocation(otherGuest, otherLocation);

    const coveCard = testEngine.asPlayerOne().getCard(coveGuest);
    expect(coveCard?.strength).toBe(coveGuest.strength + 1);
    expect(coveCard?.willpower).toBe(coveGuest.willpower + 1);

    const otherCard = testEngine.asPlayerOne().getCard(otherGuest);
    expect(otherCard?.strength).toBe(otherGuest.strength);
    expect(otherCard?.willpower).toBe(otherGuest.willpower);
  });
});
