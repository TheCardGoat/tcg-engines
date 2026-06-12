import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { billyBonesSpaceSailor } from "./185-billy-bones-space-sailor";

const attacker = createMockCharacter({
  id: "billy-bones-attacker",
  name: "Billy Bones Attacker",
  cost: 4,
  strength: 4,
  willpower: 5,
});

const mockLocation = createMockLocation({
  id: "billy-bones-mock-location",
  name: "Billy Bones Mock Location",
  cost: 2,
});

describe("Billy Bones - Space Sailor", () => {
  it("banishes a chosen location when this character is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: billyBonesSpaceSailor, exerted: true }],
        deck: 2,
      },
      {
        play: [{ card: attacker, exerted: true }, mockLocation],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().challenge(attacker, billyBonesSpaceSailor),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(billyBonesSpaceSailor)).toBe("discard");

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(billyBonesSpaceSailor, {
        resolveOptional: true,
        targets: [mockLocation],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(mockLocation)).toBe("discard");
  });
});
