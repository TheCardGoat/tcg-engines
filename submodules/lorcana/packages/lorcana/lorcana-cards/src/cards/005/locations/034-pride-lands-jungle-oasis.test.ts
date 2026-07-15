import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { prideLandsJungleOasis } from "./034-pride-lands-jungle-oasis";

const residentOne = createMockCharacter({
  id: "pride-resident-1",
  name: "Pride Resident 1",
  cost: 1,
});
const residentTwo = createMockCharacter({
  id: "pride-resident-2",
  name: "Pride Resident 2",
  cost: 1,
});
const residentThree = createMockCharacter({
  id: "pride-resident-3",
  name: "Pride Resident 3",
  cost: 1,
});
const discardedLion = createMockCharacter({
  id: "pride-discarded-lion",
  name: "Discarded Lion",
  cost: 4,
});

describe("Pride Lands - Jungle Oasis", () => {
  it("can banish itself to play a character from your discard for free once you have 3 characters here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        prideLandsJungleOasis,
        { card: residentOne, atLocation: prideLandsJungleOasis },
        { card: residentTwo, atLocation: prideLandsJungleOasis },
        { card: residentThree, atLocation: prideLandsJungleOasis },
      ],
      discard: [discardedLion],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().activateAbility(prideLandsJungleOasis)).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolveNextPending({ resolveOptional: true, targets: [discardedLion] }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(prideLandsJungleOasis)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(discardedLion)).toBe("play");
  });

  it("cannot activate the ability if fewer than 3 characters are at the location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        prideLandsJungleOasis,
        { card: residentOne, atLocation: prideLandsJungleOasis },
        { card: residentTwo, atLocation: prideLandsJungleOasis },
      ],
      discard: [discardedLion],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().activateAbility(prideLandsJungleOasis).success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(prideLandsJungleOasis)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(discardedLion)).toBe("discard");
  });
});
