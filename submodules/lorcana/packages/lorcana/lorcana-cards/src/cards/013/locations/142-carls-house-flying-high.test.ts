import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { carlsHouseFlyingHigh } from "./142-carls-house-flying-high";

const carlsDestination = createMockLocation({
  id: "carls-house-destination",
  name: "Carl's Destination",
  cost: 2,
  moveCost: 2,
});

const carlsTraveler = createMockCharacter({
  id: "carls-house-traveler",
  name: "Carl's Traveler",
  cost: 2,
});

describe("Carl's House - Flying High", () => {
  it("moves a character from here to another location for free and gains 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        carlsHouseFlyingHigh,
        carlsDestination,
        { card: carlsTraveler, atLocation: carlsHouseFlyingHigh },
      ],
    });

    expect(testEngine.asPlayerOne().activateAbility(carlsHouseFlyingHigh)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: {
          kind: "move-to-location",
          subject: [testEngine.findCardInstanceId(carlsTraveler, "play", "p1")],
          location: [testEngine.findCardInstanceId(carlsDestination, "play", "p1")],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: carlsTraveler,
      location: carlsDestination,
    });
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("auto-resolves without effect when there is no other location to move to", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [carlsHouseFlyingHigh, { card: carlsTraveler, atLocation: carlsHouseFlyingHigh }],
    });

    expect(testEngine.asPlayerOne().activateAbility(carlsHouseFlyingHigh)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHavePendingEffectCount(1);
    expect(
      testEngine.asPlayerOne().resolveNextPending({ resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHavePendingEffectCount(0);
    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: carlsTraveler,
      location: carlsHouseFlyingHigh,
    });
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });

  it("auto-resolves without effect when no character is at Carl's House", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [carlsHouseFlyingHigh, carlsDestination, carlsTraveler],
    });

    expect(testEngine.asPlayerOne().activateAbility(carlsHouseFlyingHigh)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHavePendingEffectCount(1);
    expect(
      testEngine.asPlayerOne().resolveNextPending({ resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHavePendingEffectCount(0);
    expect(testEngine.asPlayerOne().getCardLocationId(carlsTraveler)).toBeUndefined();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
