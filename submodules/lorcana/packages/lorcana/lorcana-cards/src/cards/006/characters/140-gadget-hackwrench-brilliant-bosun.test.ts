import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { gadgetHackwrenchBrilliantBosun } from "./140-gadget-hackwrench-brilliant-bosun";

const inventorCharacter = createMockCharacter({
  id: "gadget-brilliant-bosun-inventor",
  name: "Test Inventor",
  cost: 5,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Inventor"],
});

const nonInventorCharacter = createMockCharacter({
  id: "gadget-brilliant-bosun-non-inventor",
  name: "Test Non-Inventor",
  cost: 5,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const item1 = createMockItem({ id: "gadget-bosun-item1", name: "Item 1", cost: 1 });
const item2 = createMockItem({ id: "gadget-bosun-item2", name: "Item 2", cost: 1 });
const item3 = createMockItem({ id: "gadget-bosun-item3", name: "Item 3", cost: 1 });

describe("Gadget Hackwrench - Brilliant Bosun", () => {
  it("reduces cost of Inventor characters by 1 when you have 3+ items in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gadgetHackwrenchBrilliantBosun, item1, item2, item3],
      hand: [inventorCharacter],
      inkwell: inventorCharacter.cost - 1,
    });

    expect(testEngine.asPlayerOne().playCard(inventorCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(inventorCharacter)).toBe("play");
  });

  it("does not reduce cost when fewer than 3 items are in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gadgetHackwrenchBrilliantBosun, item1, item2],
      hand: [inventorCharacter],
      inkwell: inventorCharacter.cost - 1,
    });

    expect(testEngine.asPlayerOne().playCard(inventorCharacter).success).toBe(false);
  });

  it("does not reduce cost of non-Inventor characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gadgetHackwrenchBrilliantBosun, item1, item2, item3],
      hand: [nonInventorCharacter],
      inkwell: nonInventorCharacter.cost - 1,
    });

    expect(testEngine.asPlayerOne().playCard(nonInventorCharacter).success).toBe(false);
  });
});
