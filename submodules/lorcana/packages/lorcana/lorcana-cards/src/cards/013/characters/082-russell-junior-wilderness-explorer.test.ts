import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { russellJuniorWildernessExplorer } from "./082-russell-junior-wilderness-explorer";

const otherCharacter = createMockCharacter({
  id: "russell-junior-other",
  name: "Other Character",
  cost: 2,
});

const locationA = createMockLocation({
  id: "russell-junior-location-a",
  name: "Location A",
  cost: 2,
  moveCost: 1,
});

const locationB = createMockLocation({
  id: "russell-junior-location-b",
  name: "Location B",
  cost: 2,
  moveCost: 1,
});

describe("Russell - Junior Wilderness Explorer", () => {
  it("moves Russell and another character to a chosen location for free when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: russellJuniorWildernessExplorer, isDrying: false }, otherCharacter, locationA],
    });

    expect(testEngine.asPlayerOne().quest(russellJuniorWildernessExplorer)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(russellJuniorWildernessExplorer, {
        resolveOptional: true,
        targets: [otherCharacter, locationA],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: russellJuniorWildernessExplorer,
      location: locationA,
    });
    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: otherCharacter,
      location: locationA,
    });
  });

  it("moves Russell from one location to another when he is already at a location (bugrepQloz6x)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        {
          card: russellJuniorWildernessExplorer,
          isDrying: false,
          atLocation: locationA,
        },
        otherCharacter,
        locationA,
        locationB,
      ],
    });

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: russellJuniorWildernessExplorer,
      location: locationA,
    });

    expect(testEngine.asPlayerOne().quest(russellJuniorWildernessExplorer)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(russellJuniorWildernessExplorer, {
        resolveOptional: true,
        targets: [otherCharacter, locationB],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: otherCharacter,
      location: locationB,
    });
    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: russellJuniorWildernessExplorer,
      location: locationB,
    });
  });
});
