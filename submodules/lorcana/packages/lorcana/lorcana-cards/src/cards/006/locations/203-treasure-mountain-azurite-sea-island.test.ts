import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { treasureMountainAzuriteSeaIsland } from "./203-treasure-mountain-azurite-sea-island";

const mountainResidentOne = createMockCharacter({
  id: "treasure-mountain-1",
  name: "Resident One",
  cost: 2,
});
const mountainResidentTwo = createMockCharacter({
  id: "treasure-mountain-2",
  name: "Resident Two",
  cost: 2,
});

describe("Treasure Mountain - Azurite Sea Island", () => {
  it("deals damage equal to the number of characters here to a chosen character or location at the start of your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          treasureMountainAzuriteSeaIsland,
          { card: mountainResidentOne, atLocation: treasureMountainAzuriteSeaIsland },
          { card: mountainResidentTwo, atLocation: treasureMountainAzuriteSeaIsland },
        ],
        deck: 1,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(treasureMountainAzuriteSeaIsland, {
        targets: [treasureMountainAzuriteSeaIsland],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(treasureMountainAzuriteSeaIsland)?.damage).toBe(2);
  });
});
