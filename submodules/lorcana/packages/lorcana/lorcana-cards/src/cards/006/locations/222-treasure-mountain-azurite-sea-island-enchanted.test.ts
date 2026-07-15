import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { treasureMountainAzuriteSeaIslandEnchanted } from "./222-treasure-mountain-azurite-sea-island-enchanted";

const mountainResidentOne = createMockCharacter({
  id: "treasure-mountain-enchanted-1",
  name: "Resident One",
  cost: 2,
});
const mountainResidentTwo = createMockCharacter({
  id: "treasure-mountain-enchanted-2",
  name: "Resident Two",
  cost: 2,
});

describe("Treasure Mountain - Azurite Sea Island (Enchanted)", () => {
  it("deals damage equal to the number of characters here to a chosen character or location at the start of your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          treasureMountainAzuriteSeaIslandEnchanted,
          { card: mountainResidentOne, atLocation: treasureMountainAzuriteSeaIslandEnchanted },
          { card: mountainResidentTwo, atLocation: treasureMountainAzuriteSeaIslandEnchanted },
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
      testEngine.asPlayerOne().resolvePendingByCard(treasureMountainAzuriteSeaIslandEnchanted, {
        targets: [treasureMountainAzuriteSeaIslandEnchanted],
      }).success,
    ).toBe(true);

    expect(
      testEngine.asPlayerOne().getCard(treasureMountainAzuriteSeaIslandEnchanted)?.damage,
    ).toBe(2);
  });

  it("deals damage equal to the number of characters here to a chosen character at the start of your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          treasureMountainAzuriteSeaIslandEnchanted,
          { card: mountainResidentOne, atLocation: treasureMountainAzuriteSeaIslandEnchanted },
          { card: mountainResidentTwo, atLocation: treasureMountainAzuriteSeaIslandEnchanted },
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
      testEngine.asPlayerOne().resolvePendingByCard(treasureMountainAzuriteSeaIslandEnchanted, {
        targets: [mountainResidentOne],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(mountainResidentOne)?.damage).toBe(2);
  });

  it("deals 1 damage when there is exactly one character at the location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          treasureMountainAzuriteSeaIslandEnchanted,
          { card: mountainResidentOne, atLocation: treasureMountainAzuriteSeaIslandEnchanted },
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
      testEngine.asPlayerOne().resolvePendingByCard(treasureMountainAzuriteSeaIslandEnchanted, {
        targets: [mountainResidentOne],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(mountainResidentOne)?.damage).toBe(1);
  });
});
