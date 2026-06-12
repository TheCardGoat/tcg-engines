import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { pepaMadrigalWeatherMaker } from "./053-pepa-madrigal-weather-maker";

const opponentCharacter = createMockCharacter({
  id: "pepa-test-opp",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const testLocation = createMockLocation({
  id: "pepa-test-location",
  name: "Test Location",
  cost: 2,
  moveCost: 1,
  lore: 1,
  willpower: 10,
});

describe("Pepa Madrigal - Weather Maker", () => {
  describe("IT LOOKS LIKE RAIN - When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless they're at a location.", () => {
    it("exerts chosen opposing character and applies cant-ready restriction", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pepaMadrigalWeatherMaker],
          inkwell: pepaMadrigalWeatherMaker.cost,
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: false }],
          deck: 2,
        },
      );

      expect(testEngine.isExerted(opponentCharacter)).toBe(false);

      expect(testEngine.asPlayerOne().playCard(pepaMadrigalWeatherMaker)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pepaMadrigalWeatherMaker, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(true);
    });

    it("cant-ready restriction prevents readying at start of opponent's next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pepaMadrigalWeatherMaker],
          inkwell: pepaMadrigalWeatherMaker.cost,
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: false }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(pepaMadrigalWeatherMaker)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pepaMadrigalWeatherMaker, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(true);

      // Pass player one's turn; opponent's turn starts but character can't ready
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
    });

    it("cant-ready restriction is removed after opponent's turn starts", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pepaMadrigalWeatherMaker],
          inkwell: pepaMadrigalWeatherMaker.cost,
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: false }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(pepaMadrigalWeatherMaker)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pepaMadrigalWeatherMaker, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(true);

      // Pass both turns - restriction should be removed
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(false);
    });

    it("ability is optional - can decline to exert", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pepaMadrigalWeatherMaker],
          inkwell: pepaMadrigalWeatherMaker.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(pepaMadrigalWeatherMaker)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(pepaMadrigalWeatherMaker, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharacter)).toBe(false);
      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(false);
    });

    it("cant-ready restriction does not apply if target is at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [pepaMadrigalWeatherMaker],
          inkwell: pepaMadrigalWeatherMaker.cost,
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: false }, testLocation],
          inkwell: testLocation.moveCost,
          deck: 2,
        },
      );

      // Move opponent character to the location first
      const oppCharId = testEngine.findCardInstanceId(opponentCharacter, "play", "player_two");
      const locationId = testEngine.findCardInstanceId(testLocation, "play", "player_two");

      // Player one needs to pass turn first so player two can move
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().moveCharacterToLocation(oppCharId, locationId),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Now player one plays Pepa and targets the character at a location
      expect(testEngine.asPlayerOne().playCard(pepaMadrigalWeatherMaker)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(pepaMadrigalWeatherMaker, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      // The character should be exerted (exert always applies)
      expect(testEngine.isExerted(opponentCharacter)).toBe(true);

      // Pass player one's turn; opponent's turn starts
      // Since the character is at a location, the cant-ready restriction should NOT prevent readying
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Character at a location should be able to ready
      expect(testEngine.isExerted(opponentCharacter)).toBe(false);
    });
  });
});
