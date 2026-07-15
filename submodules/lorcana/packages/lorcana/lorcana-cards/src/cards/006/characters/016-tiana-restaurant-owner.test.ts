import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  createMockLocation,
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { tianaRestaurantOwner } from "./016-tiana-restaurant-owner";

const ally = createMockCharacter({
  id: "tiana-restaurant-owner-ally",
  name: "Ally",
  cost: 2,
  strength: 1,
  willpower: 6,
});

const attacker = createMockCharacter({
  id: "tiana-restaurant-owner-attacker",
  name: "Attacker",
  cost: 3,
  strength: 4,
  willpower: 3,
});

const locationTarget = createMockLocation({
  id: "tiana-restaurant-owner-location",
  name: "Test Location",
  cost: 2,
  moveCost: 1,
  willpower: 6,
  lore: 1,
});

describe("Tiana - Restaurant Owner", () => {
  describe("SPECIAL RESERVATION - Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.", () => {
    it("lets the challenging player pay 3 ink to prevent the strength reduction", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: tianaRestaurantOwner, exerted: true },
            { card: ally, exerted: true },
          ],
          deck: 2,
        },
        {
          play: [{ card: attacker, exerted: false, isDrying: false }],
          inkwell: 3,
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().challenge(attacker, ally)).toBeSuccessfulCommand();

      // Player one resolves Tiana from the bag, then the challenging player chooses.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tianaRestaurantOwner),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCard(attacker).strength).toBe(attacker.strength);
      expect(testEngine.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
    });

    it("applies -3 strength when the challenging player cannot pay 3 ink", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: tianaRestaurantOwner, exerted: true },
            { card: ally, exerted: true },
          ],
          deck: 2,
        },
        {
          play: [{ card: attacker, exerted: false, isDrying: false }],
          inkwell: 2,
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().challenge(attacker, ally)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tianaRestaurantOwner),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCard(attacker).strength).toBe(attacker.strength - 3);
      expect(testEngine.asServer().getAvailableInk(PLAYER_TWO)).toBe(2);
    });

    it("should apply -3 strength to the challenging character when Tiana is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: tianaRestaurantOwner, exerted: true },
            { card: ally, exerted: true },
          ],
          deck: 2,
        },
        {
          play: [{ card: attacker, exerted: false, isDrying: false }],
          deck: 2,
        },
      );

      // Pass priority to player two so they can challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().challenge(attacker, ally)).toBeSuccessfulCommand();

      // Resolve Tiana's triggered ability from the bag (owned by player one)
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(tianaRestaurantOwner),
        ).toBeSuccessfulCommand();
        expect(testEngine.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();
      }

      // Attacker should have -3 strength applied (4 - 3 = 1)
      expect(testEngine.asPlayerTwo().getCard(attacker).strength).toBe(attacker.strength - 3);
    });

    it("applies the -3 strength before challenge damage is dealt", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: tianaRestaurantOwner, exerted: true },
            { card: ally, exerted: true },
          ],
          deck: 2,
        },
        {
          play: [{ card: attacker, exerted: false, isDrying: false }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().challenge(attacker, ally)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(tianaRestaurantOwner),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(ally)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(attacker)).toBe(1);
      expect(testEngine.asPlayerOne().getCardZone(ally)).toBe("play");
      expect(testEngine.asPlayerTwo().getCardZone(attacker)).toBe("play");
    });

    it("should NOT even enter the bag when Tiana is NOT exerted (phantom-trigger regression)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: tianaRestaurantOwner, exerted: false },
            { card: ally, exerted: true },
          ],
          deck: 2,
        },
        {
          play: [{ card: attacker, exerted: false, isDrying: false }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().challenge(attacker, ally)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("should NOT apply -3 strength when Tiana is NOT exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: tianaRestaurantOwner, exerted: false },
            { card: ally, exerted: true },
          ],
          deck: 2,
        },
        {
          play: [{ card: attacker, exerted: false, isDrying: false }],
          deck: 2,
        },
      );

      // Pass priority to player two so they can challenge
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().challenge(attacker, ally)).toBeSuccessfulCommand();

      // No modifier should be applied since Tiana is not exerted
      expect(testEngine.asPlayerTwo().getCard(attacker).strength).toBe(attacker.strength);
    });

    it("regression: should NOT trigger when a location is challenged (only triggers for characters)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: tianaRestaurantOwner, exerted: true }, locationTarget],
          deck: 2,
        },
        {
          play: [{ card: attacker, exerted: false, isDrying: false }],
          deck: 2,
        },
      );

      // Pass priority to player two so they can challenge the location
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().challenge(attacker, locationTarget)).toBeSuccessfulCommand();

      // Tiana's ability should NOT trigger for location challenges
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Attacker strength should be unchanged
      expect(testEngine.asPlayerTwo().getCard(attacker).strength).toBe(attacker.strength);
    });
  });
});
