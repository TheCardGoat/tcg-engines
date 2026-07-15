import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { wreckitRalphHamHands } from "./190-wreck-it-ralph-ham-hands";

const mockItem = createMockItem({
  id: "ralph-mock-item",
  name: "Mock Item",
  cost: 2,
});

const mockLocation = createMockLocation({
  id: "ralph-mock-location",
  name: "Mock Location",
  cost: 3,
  moveCost: 1,
  willpower: 4,
  lore: 1,
});

describe("Wreck-It Ralph - Ham Hands", () => {
  describe("I WRECK THINGS - Whenever this character quests, you may banish chosen item or location to gain 2 lore.", () => {
    it("triggers an optional bag effect when Ralph quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: wreckitRalphHamHands, isDrying: false }, mockItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(wreckitRalphHamHands)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("banishes chosen item and gains 2 lore when you accept the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: wreckitRalphHamHands, isDrying: false }, mockItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(wreckitRalphHamHands)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(wreckitRalphHamHands, {
          resolveOptional: true,
          targets: [mockItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockItem)).toBe("discard");
      // Ralph has lore 3 from questing + 2 from the ability = 5 total
      expect(testEngine.getLore(PLAYER_ONE)).toBe(wreckitRalphHamHands.lore + 2);
    });

    it("banishes a chosen location and gains 2 lore when you accept the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: wreckitRalphHamHands, isDrying: false }, mockLocation],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(wreckitRalphHamHands)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(wreckitRalphHamHands, {
          resolveOptional: true,
          targets: [mockLocation],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockLocation)).toBe("discard");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(wreckitRalphHamHands.lore + 2);
    });

    it("does not banish anything and does not gain 2 lore when you decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: wreckitRalphHamHands, isDrying: false }, mockItem],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().quest(wreckitRalphHamHands)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(wreckitRalphHamHands, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mockItem)).toBe("play");
      // Only Ralph's base lore from questing (3), no bonus
      expect(testEngine.getLore(PLAYER_ONE)).toBe(wreckitRalphHamHands.lore);
    });

    it("can banish an opponent's item and gain 2 lore", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: wreckitRalphHamHands, isDrying: false }],
          deck: 1,
        },
        {
          play: [mockItem],
        },
      );

      expect(testEngine.asPlayerOne().quest(wreckitRalphHamHands)).toBeSuccessfulCommand();

      const bagEffect = testEngine.asPlayerOne().getBagEffects()[0]!;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(wreckitRalphHamHands, {
          resolveOptional: true,
          targets: [mockItem],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(mockItem)).toBe("discard");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(wreckitRalphHamHands.lore + 2);
    });
  });
});
