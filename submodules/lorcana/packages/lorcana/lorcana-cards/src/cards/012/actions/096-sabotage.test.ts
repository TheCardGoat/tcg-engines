import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { sabotage } from "./096-sabotage";

const chosenCompass = createMockItem({
  id: "sabotage-chosen-compass",
  name: "Magic Compass",
  cost: 1,
});

const otherCompass = createMockItem({
  id: "sabotage-other-compass",
  name: "Magic Compass",
  cost: 1,
});

const otherItem = createMockItem({
  id: "sabotage-other-item",
  name: "Random Trinket",
  cost: 1,
});

const matchingLocation = createMockLocation({
  id: "sabotage-matching-location",
  name: "Magic Compass",
  cost: 2,
});

const unrelatedLocation = createMockLocation({
  id: "sabotage-unrelated-location",
  name: "Lost Tomb",
  cost: 2,
});

describe("Sabotage", () => {
  it("banishes chosen item and all other items/locations with the same name", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [sabotage],
        inkwell: sabotage.cost,
        play: [chosenCompass, otherItem],
      },
      {
        play: [otherCompass, matchingLocation, unrelatedLocation],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(sabotage, {
        targets: [chosenCompass],
      }),
    ).toBeSuccessfulCommand();

    // Chosen item and all same-named items/locations are banished
    expect(testEngine.asPlayerOne().getCardZone(chosenCompass)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(otherCompass)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(matchingLocation)).toBe("discard");

    // Items/locations with other names are untouched
    expect(testEngine.asPlayerOne().getCardZone(otherItem)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(unrelatedLocation)).toBe("play");
  });

  it("banishes just the chosen card when no others share its name", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [sabotage],
        inkwell: sabotage.cost,
        play: [chosenCompass, otherItem],
      },
      {
        play: [unrelatedLocation],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(sabotage, {
        targets: [chosenCompass],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(chosenCompass)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(otherItem)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(unrelatedLocation)).toBe("play");
  });
});
