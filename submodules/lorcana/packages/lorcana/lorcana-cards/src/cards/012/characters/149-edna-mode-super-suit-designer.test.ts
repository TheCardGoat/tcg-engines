import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { ednaModeSuperSuitDesigner } from "./149-edna-mode-super-suit-designer";
import { superSuit } from "../items/066-super-suit";

const mockItem = createMockItem({
  id: "edna-mock-item",
  name: "Mock Item",
  cost: 2,
});

describe("Edna Mode - Super Suit Designer", () => {
  describe("KEY ACCESSORY - {E} — Ready chosen item.", () => {
    it("readies an exerted item when activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: ednaModeSuperSuitDesigner, isDrying: false },
          { card: mockItem, exerted: true },
        ],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().isExerted(mockItem)).toBe(true);

      const mockItemId = testEngine.findCardInstanceId(mockItem, "play", "player_one");
      expect(
        testEngine.asPlayerOne().activateAbility(ednaModeSuperSuitDesigner, {
          ability: "KEY ACCESSORY",
          targets: [mockItemId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(mockItem)).toBe(false);
      expect(testEngine.asPlayerOne().isExerted(ednaModeSuperSuitDesigner)).toBe(true);
    });
  });

  describe("ALL THE BASICS - While you have an item named Super Suit in play, this character gains Ward.", () => {
    it("gains Ward while Super Suit is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ednaModeSuperSuitDesigner, superSuit],
        deck: 3,
      });

      expect(testEngine.hasKeyword(ednaModeSuperSuitDesigner, "Ward")).toBe(true);
    });

    it("does not have Ward without a Super Suit in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ednaModeSuperSuitDesigner],
        deck: 3,
      });

      expect(testEngine.hasKeyword(ednaModeSuperSuitDesigner, "Ward")).toBe(false);
    });

    it("does not gain Ward from a different item in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ednaModeSuperSuitDesigner, mockItem],
        deck: 3,
      });

      expect(testEngine.hasKeyword(ednaModeSuperSuitDesigner, "Ward")).toBe(false);
    });
  });
});
