import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { simbaSonOfMufasa } from "./192-simba-son-of-mufasa";

const mockItem = createMockItem({
  id: "simba-mock-item",
  name: "Mock Item",
  cost: 2,
});

const mockLocation = createMockLocation({
  id: "simba-mock-location",
  name: "Mock Location",
  cost: 3,
  moveCost: 1,
  willpower: 4,
  lore: 1,
});

describe("Simba - Son of Mufasa", () => {
  describe("FEARSOME ROAR - When you play this character, you may banish chosen item or location.", () => {
    it("triggers an optional bag effect when Simba is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: simbaSonOfMufasa.cost,
        hand: [simbaSonOfMufasa],
        play: [mockItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(simbaSonOfMufasa)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("banishes chosen item when you accept the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: simbaSonOfMufasa.cost,
        hand: [simbaSonOfMufasa],
        play: [mockItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(simbaSonOfMufasa)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(simbaSonOfMufasa, {
          resolveOptional: true,
          targets: [mockItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockItem)).toBe("discard");
    });

    it("banishes chosen location when you accept the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: simbaSonOfMufasa.cost,
        hand: [simbaSonOfMufasa],
        play: [mockLocation],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(simbaSonOfMufasa)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(simbaSonOfMufasa, {
          resolveOptional: true,
          targets: [mockLocation],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockLocation)).toBe("discard");
    });

    it("does not banish anything when you decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: simbaSonOfMufasa.cost,
        hand: [simbaSonOfMufasa],
        play: [mockItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().playCard(simbaSonOfMufasa)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(simbaSonOfMufasa, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockItem)).toBe("play");
    });

    it("can banish an opponent's item", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: simbaSonOfMufasa.cost,
          hand: [simbaSonOfMufasa],
          deck: 1,
        },
        {
          play: [mockItem],
        },
      );

      expect(testEngine.asPlayerOne().playCard(simbaSonOfMufasa)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(simbaSonOfMufasa, {
          resolveOptional: true,
          targets: [mockItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(mockItem)).toBe("discard");
    });

    it("regression: can target items and locations (not just characters)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: simbaSonOfMufasa.cost,
          hand: [simbaSonOfMufasa],
          deck: 1,
        },
        {
          play: [mockItem, mockLocation],
        },
      );

      expect(testEngine.asPlayerOne().playCard(simbaSonOfMufasa)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      // Should be able to target the location
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(simbaSonOfMufasa, {
          resolveOptional: true,
          targets: [mockLocation],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(mockLocation)).toBe("discard");
      // Item should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(mockItem)).toBe("play");
    });
  });
});
