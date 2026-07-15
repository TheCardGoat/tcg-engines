import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { bellesHouseMauricesWorkshop } from "./168-belles-house-maurices-workshop";

const workshopHelper = createMockCharacter({
  id: "workshop-helper",
  name: "Workshop Helper",
  cost: 2,
});

const cheapItem = createMockItem({
  id: "cheap-item",
  name: "Cheap Item",
  cost: 1,
});

const expensiveItem = createMockItem({
  id: "expensive-item",
  name: "Expensive Item",
  cost: 3,
});

describe("Belle's House - Maurice's Workshop", () => {
  it("reduces item costs by 1 while you have a character at this location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [expensiveItem],
      play: [
        bellesHouseMauricesWorkshop,
        { card: workshopHelper, atLocation: bellesHouseMauricesWorkshop },
      ],
      inkwell: 2,
    });

    // Item costs 3, but with reduction it costs 2
    expect(testEngine.asPlayerOne().canPlayCard(expensiveItem)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(expensiveItem)).toBeSuccessfulCommand();
  });

  it("does NOT reduce item costs when no character is at the location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapItem],
      play: [bellesHouseMauricesWorkshop, workshopHelper],
      inkwell: 0,
    });

    // Item costs 1, no reduction because character is not at the location
    expect(testEngine.asPlayerOne().canPlayCard(cheapItem)).toBe(false);
  });

  it("makes a 1-cost item free when a character is at the location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapItem],
      play: [
        bellesHouseMauricesWorkshop,
        { card: workshopHelper, atLocation: bellesHouseMauricesWorkshop },
      ],
      inkwell: 0,
    });

    // Item costs 1, with reduction it costs 0 - playable with no ink
    expect(testEngine.asPlayerOne().canPlayCard(cheapItem)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(cheapItem)).toBeSuccessfulCommand();
  });
});
