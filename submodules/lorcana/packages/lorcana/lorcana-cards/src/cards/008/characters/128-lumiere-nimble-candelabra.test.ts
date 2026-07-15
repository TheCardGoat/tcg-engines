import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { lumiereNimbleCandelabra } from "./128-lumiere-nimble-candelabra";

const mockItem = createMockItem({
  id: "lumiere-test-item",
  name: "Test Item",
  cost: 1,
});

const mockCharacter = createMockCharacter({
  id: "lumiere-test-character",
  name: "Test Character",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Lumiere - Nimble Candelabra", () => {
  it("has correct base stats", () => {
    expect(lumiereNimbleCandelabra).toMatchObject({
      cardType: "character",
      name: "Lumiere",
      version: "Nimble Candelabra",
      cost: 2,
      strength: 1,
      willpower: 1,
      lore: 2,
      inkable: true,
      inkType: ["ruby"],
    });
  });

  describe("QUICK-STEP - While you have an item card in your discard, this character gains Evasive.", () => {
    it("does NOT have Evasive when no items are in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereNimbleCandelabra],
        deck: 1,
      });

      expect(testEngine.hasKeyword(lumiereNimbleCandelabra, "Evasive")).toBe(false);
    });

    it("does NOT have Evasive when only characters are in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereNimbleCandelabra],
        discard: [mockCharacter],
        deck: 1,
      });

      expect(testEngine.hasKeyword(lumiereNimbleCandelabra, "Evasive")).toBe(false);
    });

    it("gains Evasive when an item card is in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereNimbleCandelabra],
        discard: [mockItem],
        deck: 1,
      });

      expect(testEngine.hasKeyword(lumiereNimbleCandelabra, "Evasive")).toBe(true);
    });

    it("gains Evasive when multiple item cards are in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereNimbleCandelabra],
        discard: [mockItem, createMockItem({ id: "item-2", name: "Item 2", cost: 2 })],
        deck: 1,
      });

      expect(testEngine.hasKeyword(lumiereNimbleCandelabra, "Evasive")).toBe(true);
    });

    it("gains Evasive when both items and characters are in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [lumiereNimbleCandelabra],
        discard: [mockItem, mockCharacter],
        deck: 1,
      });

      expect(testEngine.hasKeyword(lumiereNimbleCandelabra, "Evasive")).toBe(true);
    });
  });
});
