import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { wreckitRalphHamHandsEnchanted } from "./220-wreck-it-ralph-ham-hands-enchanted";

const targetItem = createMockItem({
  id: "ham-hands-enchanted-target-item",
  name: "Target Item",
  cost: 2,
});

const ownItem = createMockItem({
  id: "ham-hands-enchanted-own-item",
  name: "Own Item",
  cost: 1,
});

const targetLocation = createMockLocation({
  id: "ham-hands-enchanted-target-location",
  name: "Target Location",
  cost: 2,
});

describe("Wreck-It Ralph - Ham Hands (Enchanted)", () => {
  describe("I WRECK THINGS — Whenever this character quests, you may banish chosen item or location to gain 2 lore.", () => {
    it("banishes a chosen item and gains 2 lore when the optional is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: wreckitRalphHamHandsEnchanted, isDrying: false }],
          deck: 3,
        },
        {
          play: [targetItem],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().quest(wreckitRalphHamHandsEnchanted)).toBeSuccessfulCommand();

      // Resolve the triggered ability — accept and target the item
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(wreckitRalphHamHandsEnchanted, { targets: [targetItem] }),
      ).toBeSuccessfulCommand();

      // Item should be banished
      expect(testEngine.asPlayerTwo().getCardZone(targetItem)).toBe("discard");

      // Quest lore (3) + ability lore (2) = 5
      expect(testEngine.getLore(PLAYER_ONE)).toBe(wreckitRalphHamHandsEnchanted.lore + 2);
    });

    it("banishes a chosen location and gains 2 lore when the optional is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: wreckitRalphHamHandsEnchanted, isDrying: false }],
          deck: 3,
        },
        {
          play: [targetLocation],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().quest(wreckitRalphHamHandsEnchanted)).toBeSuccessfulCommand();

      // Resolve the triggered ability — accept and target the location
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(wreckitRalphHamHandsEnchanted, { targets: [targetLocation] }),
      ).toBeSuccessfulCommand();

      // Location should be banished
      expect(testEngine.asPlayerTwo().getCardZone(targetLocation)).toBe("discard");

      // Quest lore (3) + ability lore (2) = 5
      expect(testEngine.getLore(PLAYER_ONE)).toBe(wreckitRalphHamHandsEnchanted.lore + 2);
    });

    it("can target own item in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: wreckitRalphHamHandsEnchanted, isDrying: false }, ownItem],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(wreckitRalphHamHandsEnchanted)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(wreckitRalphHamHandsEnchanted, { targets: [ownItem] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("discard");
      expect(testEngine.getLore(PLAYER_ONE)).toBe(wreckitRalphHamHandsEnchanted.lore + 2);
    });

    it("does not banish and does not gain 2 lore when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: wreckitRalphHamHandsEnchanted, isDrying: false }],
          deck: 3,
        },
        {
          play: [targetItem],
          deck: 3,
        },
      );

      expect(testEngine.asPlayerOne().quest(wreckitRalphHamHandsEnchanted)).toBeSuccessfulCommand();

      // Decline the optional ability
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(wreckitRalphHamHandsEnchanted, { resolveOptional: false });

      // Item should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(targetItem)).toBe("play");

      // Only quest lore gained (no ability bonus)
      expect(testEngine.getLore(PLAYER_ONE)).toBe(wreckitRalphHamHandsEnchanted.lore);
    });

    it("still gains only quest lore when no items or locations are in play and optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: wreckitRalphHamHandsEnchanted, isDrying: false }],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().quest(wreckitRalphHamHandsEnchanted)).toBeSuccessfulCommand();

      // The optional ability may still be queued; resolve or decline it
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(wreckitRalphHamHandsEnchanted, { resolveOptional: false });
      }

      // Only quest lore gained
      expect(testEngine.getLore(PLAYER_ONE)).toBe(wreckitRalphHamHandsEnchanted.lore);
    });

    it("gains quest lore regardless of whether optional is accepted or declined", () => {
      const testEngineAccepted = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: wreckitRalphHamHandsEnchanted, isDrying: false }],
          deck: 3,
        },
        {
          play: [targetItem],
          deck: 3,
        },
      );

      expect(
        testEngineAccepted.asPlayerOne().quest(wreckitRalphHamHandsEnchanted),
      ).toBeSuccessfulCommand();
      testEngineAccepted
        .asPlayerOne()
        .resolvePendingByCard(wreckitRalphHamHandsEnchanted, { targets: [targetItem] });

      // Quest lore (3) + 2 bonus lore
      expect(testEngineAccepted.getLore(PLAYER_ONE)).toBe(wreckitRalphHamHandsEnchanted.lore + 2);

      const testEngineDeclined = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: wreckitRalphHamHandsEnchanted, isDrying: false }],
          deck: 3,
        },
        {
          play: [targetItem],
          deck: 3,
        },
      );

      expect(
        testEngineDeclined.asPlayerOne().quest(wreckitRalphHamHandsEnchanted),
      ).toBeSuccessfulCommand();
      testEngineDeclined
        .asPlayerOne()
        .resolvePendingByCard(wreckitRalphHamHandsEnchanted, { resolveOptional: false });

      // Only quest lore (3), no bonus
      expect(testEngineDeclined.getLore(PLAYER_ONE)).toBe(wreckitRalphHamHandsEnchanted.lore);
    });
  });
});
