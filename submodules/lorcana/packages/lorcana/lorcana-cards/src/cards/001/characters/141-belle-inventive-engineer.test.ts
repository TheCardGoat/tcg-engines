import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockItem,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { belleInventiveEngineer } from "./141-belle-inventive-engineer";

const testItem = createMockItem({
  id: "belle-test-item",
  name: "Test Item",
  cost: 3,
});

const testCharacter = createMockCharacter({
  id: "belle-test-character",
  name: "Test Character",
  cost: 3,
});

describe("Belle - Inventive Engineer", () => {
  it("TINKER - Whenever this character quests, you pay 1 less for the next item you play this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: testItem.cost - 1,
      play: [{ card: belleInventiveEngineer }],
      hand: [testItem],
      deck: 1,
    });

    // Before questing, can't afford the item (cost - 1 ink)
    expect(testEngine.asPlayerOne().canPlayCard(testItem)).toBe(false);

    // Quest with Belle
    expect(testEngine.asPlayerOne().quest(belleInventiveEngineer)).toBeSuccessfulCommand();

    // After questing, should be able to play item with 1 ink reduction
    expect(testEngine.asPlayerOne().canPlayCard(testItem)).toBe(true);
    expect(testEngine.asPlayerOne().playCard(testItem)).toBeSuccessfulCommand();
  });

  it("TINKER - only reduces cost for items, not characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: testCharacter.cost - 1,
      play: [{ card: belleInventiveEngineer }],
      hand: [testCharacter],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(belleInventiveEngineer)).toBeSuccessfulCommand();

    // Character should NOT get the reduction
    expect(testEngine.asPlayerOne().canPlayCard(testCharacter)).toBe(false);
  });

  it("TINKER - only reduces cost for the NEXT item, not subsequent ones", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: testItem.cost * 2 - 1,
      play: [{ card: belleInventiveEngineer }],
      hand: [testItem, testItem],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(belleInventiveEngineer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(testItem)).toBeSuccessfulCommand();

    // Second item should NOT get the reduction
    expect(testEngine.asPlayerOne().canPlayCard(testItem)).toBe(false);
  });
});
