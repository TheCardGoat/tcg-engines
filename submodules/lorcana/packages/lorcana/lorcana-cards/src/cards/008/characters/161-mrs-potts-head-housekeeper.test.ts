import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockItem,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mrsPottsHeadHousekeeper } from "./161-mrs-potts-head-housekeeper";

const mockItem = createMockItem({
  id: "mock-item",
  name: "Mock Item",
  cost: 1,
});

const mockDeckCard = createMockCharacter({
  id: "mock-deck-card",
  name: "Mock Deck Card",
  cost: 1,
});

describe("Mrs. Potts - Head Housekeeper", () => {
  it("CLEAN UP - exert and banish an item to draw a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mrsPottsHeadHousekeeper, mockItem],
        deck: [mockDeckCard],
      },
      {
        deck: 1,
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(mrsPottsHeadHousekeeper, {
      costs: {
        banishItems: [mockItem],
      },
    });

    expect(result).toBeSuccessfulCommand();

    // Mrs. Potts should be exerted
    expect(testEngine.asPlayerOne().isExerted(mrsPottsHeadHousekeeper)).toBe(true);
    // Item should be banished (in discard)
    expect(testEngine.asPlayerOne().getCardZone(mockItem)).toBe("discard");
    // Should have drawn a card
    expect(testEngine.asPlayerOne().getCardZone(mockDeckCard)).toBe("hand");
  });

  it("CLEAN UP - fails if no item is provided to banish", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mrsPottsHeadHousekeeper],
        deck: [mockDeckCard],
      },
      {
        deck: 1,
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(mrsPottsHeadHousekeeper, {
      costs: {
        banishItems: [],
      },
    });

    expect(result).not.toBeSuccessfulCommand();
  });

  it("CLEAN UP - fails if no items are in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mrsPottsHeadHousekeeper],
        deck: [mockDeckCard],
      },
      {
        deck: 1,
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(mrsPottsHeadHousekeeper, {
      costs: {
        banishItems: [mockItem],
      },
    });

    expect(result).not.toBeSuccessfulCommand();
  });
});
