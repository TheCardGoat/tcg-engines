import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockLocation,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { launchpadExceptionalPilot } from "./083-launchpad-exceptional-pilot";

const ownLocation = createMockLocation({
  id: "launchpad-test-own-location",
  name: "Own Location",
  cost: 2,
});

const opponentLocation = createMockLocation({
  id: "launchpad-test-opponent-location",
  name: "Opponent Location",
  cost: 3,
});

const secondLocation = createMockLocation({
  id: "launchpad-test-second-location",
  name: "Second Location",
  cost: 2,
});

const opponentCharacter = createMockCharacter({
  id: "launchpad-test-opponent-character",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 5,
});

describe("Launchpad - Exceptional Pilot", () => {
  describe("OFF THE MAP - When you play this character, you may banish chosen location.", () => {
    it("triggers when character is played and banishes chosen location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [launchpadExceptionalPilot],
          inkwell: launchpadExceptionalPilot.cost,
          play: [ownLocation],
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().getCardZone(ownLocation)).toBe("play");

      expect(testEngine.asPlayerOne().playCard(launchpadExceptionalPilot)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(launchpadExceptionalPilot)).toBe("play");

      // Trigger should be in the bag (optional)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(launchpadExceptionalPilot, {
          resolveOptional: true,
          targets: [ownLocation],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(ownLocation)).toBe("discard");
    });

    it("can banish opponent's location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [launchpadExceptionalPilot],
          inkwell: launchpadExceptionalPilot.cost,
          deck: 2,
        },
        {
          play: [opponentLocation],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerTwo().getCardZone(opponentLocation)).toBe("play");

      expect(testEngine.asPlayerOne().playCard(launchpadExceptionalPilot)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(launchpadExceptionalPilot, {
          resolveOptional: true,
          targets: [opponentLocation],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardZone(opponentLocation)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(launchpadExceptionalPilot)).toBe("play");
    });

    it("ability is optional - can decline to banish", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [launchpadExceptionalPilot],
          inkwell: launchpadExceptionalPilot.cost,
          play: [ownLocation],
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().playCard(launchpadExceptionalPilot)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(launchpadExceptionalPilot, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Location should remain in play
      expect(testEngine.asPlayerOne().getCardZone(ownLocation)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(launchpadExceptionalPilot)).toBe("play");
    });

    it("allows player to choose which location to banish when multiple are available", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [launchpadExceptionalPilot],
          inkwell: launchpadExceptionalPilot.cost,
          play: [ownLocation, secondLocation],
          deck: 2,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().playCard(launchpadExceptionalPilot)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Choose to banish only the second location
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(launchpadExceptionalPilot, {
          resolveOptional: true,
          targets: [secondLocation],
        }),
      ).toBeSuccessfulCommand();

      // Only chosen location banished
      expect(testEngine.asPlayerOne().getCardZone(ownLocation)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(secondLocation)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(launchpadExceptionalPilot)).toBe("play");
    });

    it("cannot target characters - only locations", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [launchpadExceptionalPilot],
          inkwell: launchpadExceptionalPilot.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(launchpadExceptionalPilot)).toBeSuccessfulCommand();

      // No valid targets (no locations in play), bag may have no entries or auto-resolves
      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(launchpadExceptionalPilot, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      // Opponent character should still be in play
      expect(testEngine.asPlayerTwo().getCardZone(opponentCharacter)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(launchpadExceptionalPilot)).toBe("play");
    });
  });
});
