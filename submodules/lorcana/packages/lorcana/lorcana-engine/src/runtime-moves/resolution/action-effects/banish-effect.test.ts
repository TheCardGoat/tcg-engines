import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockLocation,
} from "../../../testing";

const mockLocation = createMockLocation({
  id: "mock-location",
  name: "Mock Location",
  cost: 3,
  moveCost: 1,
  willpower: 4,
  lore: 1,
});

const mockCharacter = createMockCharacter({
  id: "mock-char",
  name: "Mock Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const banishAllLocationsAction = createMockAction({
  id: "banish-all-locations",
  name: "Banish All Locations",
  cost: 4,
  text: "Banish all locations.",
  abilities: [
    {
      type: "action",
      text: "Banish all locations.",
      effect: {
        type: "banish",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["location"],
        },
      },
    },
  ],
});

describe("banish-effect: location banishment", () => {
  it("clears atLocationId on characters when their location is banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [banishAllLocationsAction],
      inkwell: banishAllLocationsAction.cost,
      play: [{ card: mockCharacter, atLocation: mockLocation }, mockLocation],
    });

    // Verify the character is at the location before the banish
    const charBefore = testEngine.asPlayerOne().getCard(mockCharacter);
    expect(charBefore.atLocationId).toBeDefined();

    const result = testEngine.asPlayerOne().playCard(banishAllLocationsAction);
    expect(result.success).toBe(true);

    // Location should be banished (in discard)
    expect(testEngine.asPlayerOne().getCardZone(mockLocation)).toBe("discard");

    // Character should still be in play but no longer at a location
    expect(testEngine.asPlayerOne().getCardZone(mockCharacter)).toBe("play");
    const charAfter = testEngine.asPlayerOne().getCard(mockCharacter);
    expect(charAfter.atLocationId).toBeUndefined();
  });
});
