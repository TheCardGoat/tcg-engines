import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type {
  LorcanitoCharacterCard,
  LorcanitoLocationCard,
} from "@lorcanito/lorcana-engine";
import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
import { taffytaMuttonfudgeSourSpeedster } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { LorcanaTestEngine } from "../testing/lorcana-test-engine";
import { mockCharacterCard, mockLocationCard } from "../testing/mockCards";

const testCharacterCard: LorcanitoCharacterCard = {
  ...mockCharacterCard,
  id: "test-character-basic",
  name: "Test Character",
};

const testOpponentCharacterCard: LorcanitoCharacterCard = {
  ...mockCharacterCard,
  id: "test-character-opponent",
  name: "Test Character (Opponent)",
};

// Test location cards for testing move functionality
const testLocationCard: LorcanitoLocationCard = {
  ...mockLocationCard,
  id: "test-location-basic",
  name: "Test Location",
  moveCost: 1, // Cost to move a character to this location
  lore: 1,
};

const expensiveLocationCard: LorcanitoLocationCard = {
  ...mockLocationCard,
  id: "test-location-expensive",
  name: "Expensive Location",
  cost: 3,
  moveCost: 3, // High cost to move characters here
  lore: 2,
};

const freeLocationCard: LorcanitoLocationCard = {
  ...mockLocationCard,
  id: "test-location-free",
  name: "Free Location",
  title: "Zero Move Cost",
  cost: 1,
  moveCost: 0, // Free to move characters here
  lore: 0,
};

const twentyLoreLocationCard: LorcanitoLocationCard = {
  ...mockLocationCard,
  id: "test-location-twenty-lore",
  name: "Twenty Lore Location",
  cost: 1,
  moveCost: 0, // Free to move characters here
  lore: 20, // High lore gain for testing
};

const freeOpponentLocationCard: LorcanitoLocationCard = {
  ...mockLocationCard,
  id: "test-location-free-opponent",
  name: "Free Location (Opponent)",
  cost: 1,
  moveCost: 0, // Free to move characters here
  lore: 2,
};

describe("Move: Move Character to Location", () => {
  let testEngine: LorcanaTestEngine;

  beforeEach(() => {
    // Set up game in main phase with characters and locations in play
    testEngine = new LorcanaTestEngine(
      {
        play: [testCharacterCard, testLocationCard, expensiveLocationCard], // Character and location in play
        inkwell: expensiveLocationCard.moveCost + testLocationCard.moveCost,
        deck: 5,
      },
      {
        play: [testOpponentCharacterCard, freeOpponentLocationCard],
      },
    );

    // Verify we're in the main game phase
    expect(testEngine.getGameSegment()).toBe("duringGame");
    expect(testEngine.getGamePhase()).toBe("mainPhase");
    expect(testEngine.getTurnPlayer()).toBe("player_one");

    // Make sure player_one is active
    testEngine.changeActivePlayer("player_one");
  });

  afterEach(() => {
    testEngine.dispose();
  });

  describe("Basic functionality", () => {
    it("should have moveToLocation method defined", () => {
      expect(testEngine.moveToLocation).toBeDefined();
      expect(typeof testEngine.moveToLocation).toBe("function");
    });
  });

  describe("**4.3.7.1** Ownership validation - Player can move only their characters to their locations", () => {
    it("should allow moving own character to own location", () => {
      const character = testEngine.getCardModel(testCharacterCard);
      const location = testEngine.getCardModel(testLocationCard);

      expect(character.isAtLocation(location)).toBeFalsy();
      expect(location.containsCharacter(character)).toBeFalsy();

      testEngine.moveToLocation({
        character,
        location,
      });

      expect(character.isAtLocation(location)).toBeTrue();
      expect(location.containsCharacter(character)).toBeTrue();
    });

    it("should prevent moving opponent's character", async () => {
      const character = testEngine.getCardModel(testOpponentCharacterCard);
      const location = testEngine.getCardModel(testLocationCard);

      const { result } = testEngine.moveToLocation({
        character,
        location,
        doNotThrow: true,
      });

      expect(result.success).toBeFalsy();
      expect(character.isAtLocation(location)).toBeFalsy();
      expect(location.containsCharacter(character)).toBeFalsy();
    });

    it("should prevent moving character to opponent's location", async () => {
      const character = testEngine.getCardModel(testCharacterCard);
      const location = testEngine.getCardModel(freeOpponentLocationCard);

      const { result } = testEngine.moveToLocation({
        character,
        location,
        doNotThrow: true,
      });

      expect(result.success).toBeFalsy();
      expect(character.isAtLocation(location)).toBeFalsy();
      expect(location.containsCharacter(character)).toBeFalsy();
    });
  });

  describe("**4.3.7.3** Character and location selection", () => {
    it("should also move exerted characters", async () => {
      const character = testEngine.getCardModel(testCharacterCard);
      const location = testEngine.getCardModel(testLocationCard);

      testEngine.exertCard({ card: character });
      expect(character.isExerted).toBeTrue();

      testEngine.moveToLocation({
        character,
        location,
      });

      expect(character.isAtLocation(location)).toBeTrue();
      expect(location.containsCharacter(character)).toBeTrue();
    });

    it("should prevent moving to the same location twice", async () => {
      const character = testEngine.getCardModel(testCharacterCard);
      const location = testEngine.getCardModel(testLocationCard);

      testEngine.moveToLocation({
        character,
        location,
      });

      expect(character.isAtLocation(location)).toBeTrue();
      expect(location.containsCharacter(character)).toBeTrue();

      const { result } = testEngine.moveToLocation({
        character,
        location,
        doNotThrow: true,
      });

      expect(result.success).toBeFalse();
    });

    it("should be able to move multiple times during one turn", async () => {
      const character = testEngine.getCardModel(testCharacterCard);
      const location = testEngine.getCardModel(testLocationCard);
      const anotherLocation = testEngine.getCardModel(expensiveLocationCard);

      testEngine.moveToLocation({
        character,
        location,
      });

      expect(character.isAtLocation(location)).toBeTrue();
      expect(location.containsCharacter(character)).toBeTrue();

      testEngine.moveToLocation({
        character,
        location: anotherLocation,
      });

      expect(character.isAtLocation(location)).toBeFalsy();
      expect(location.containsCharacter(character)).toBeFalsy();
      expect(character.isAtLocation(anotherLocation)).toBeTrue();
      expect(anotherLocation.containsCharacter(character)).toBeTrue();
    });
  });

  describe("**4.3.7.4** Move cost payment", () => {
    it("should require sufficient ink to pay move cost", async () => {
      // Create test engine with expensive location and insufficient ink
      const tempEngine = new LorcanaTestEngine(
        {
          play: [testCharacterCard, expensiveLocationCard], // Expensive location (cost 3)
          inkwell: expensiveLocationCard.moveCost - 1,
          deck: 5,
        },
        undefined,
      );

      tempEngine.changeActivePlayer("player_one");

      const character = tempEngine.getCardModel(testCharacterCard);
      const location = tempEngine.getCardModel(expensiveLocationCard);

      const { result } = tempEngine.moveToLocation({
        character,
        location: location,
        doNotThrow: true,
      });

      expect(result.success).toBeFalse();
      expect(JSON.stringify(result)).toContain("INSUFFICIENT_INK");

      tempEngine.dispose();
    });

    it("should allow move when sufficient ink is available", async () => {
      // Create test engine with sufficient ink for expensive location
      const tempEngine = new LorcanaTestEngine({
        play: [testCharacterCard, expensiveLocationCard],
        inkwell: expensiveLocationCard.moveCost + 1,
      });

      const character = tempEngine.getCardModel(testCharacterCard);
      const location = tempEngine.getCardModel(expensiveLocationCard);

      tempEngine.moveToLocation({
        character,
        location: location,
      });

      expect(character.location?.isEqual(location)).toBeTrue();

      expect(tempEngine.getTotalInk("player_one")).toBe(4);
      expect(tempEngine.getAvailableInk("player_one")).toBe(1);

      tempEngine.dispose();
    });
  });

  describe("**4.3.7.5** Triggered effects", () => {
    it("should trigger effects when character moves to location", () => {
      const testEngine = new LorcanaTestEngine({
        inkwell: hiddenCoveTranquilHaven.moveCost * 2,
        play: [hiddenCoveTranquilHaven, taffytaMuttonfudgeSourSpeedster],
      });

      expect(testEngine.getLoreForPlayer("player_one")).toBe(0);

      testEngine.moveToLocation({
        location: hiddenCoveTranquilHaven,
        character: taffytaMuttonfudgeSourSpeedster,
      });

      expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
    });
  });

  describe("Gaining Lore From Location", () => {
    it("On Start of Turn, it should get lore", () => {
      const testEngine = new LorcanaTestEngine({
        play: [expensiveLocationCard, freeLocationCard, testLocationCard], // Expensive location (cost 3)
      });

      testEngine.changeActivePlayer("player_one");
      testEngine.passTurn();

      expect(testEngine.getTurnPlayer()).toEqual("player_two");
      expect(testEngine.getPriorityPlayers()).toContain("player_two");

      expect(testEngine.getPlayerLore("player_one")).toBe(0);
      expect(testEngine.getPlayerLore("player_two")).toBe(0);

      testEngine.changeActivePlayer("player_two");
      testEngine.passTurn();
      expect(testEngine.getTurnPlayer()).toEqual("player_one");

      expect(testEngine.getPlayerLore("player_one")).toBe(
        (expensiveLocationCard.lore || 0) +
          (freeLocationCard.lore || 0) +
          (testLocationCard.lore || 0),
      );
      expect(testEngine.getPlayerLore("player_two")).toBe(0);
    });

    it("On Start of Turn, if you win lore and pass 20 lore you win the game", async () => {
      const testEngine = new LorcanaTestEngine({
        play: [twentyLoreLocationCard],
      });

      testEngine.changeActivePlayer("player_one");
      testEngine.passTurn();

      testEngine.changeActivePlayer("player_two");
      testEngine.passTurn();

      expect(testEngine.getPlayerLore("player_one")).toBe(
        twentyLoreLocationCard.lore,
      );

      expect(testEngine.isGameOver()).toBeTrue();
      expect(testEngine.getWinner()).toBe("player_one");
    });
  });

  describe("Edge cases and validation", () => {
    it("should handle free locations (move cost 0)", async () => {
      const testEngine = new LorcanaTestEngine({
        inkwell: 0,
        play: [freeLocationCard, testCharacterCard],
      });

      const { character, location } = testEngine.moveToLocation({
        location: freeLocationCard,
        character: testCharacterCard,
      });

      expect(character.isAtLocation(location)).toBe(true);
    });

    it("should validate character is in play zone", async () => {
      const testEngine = new LorcanaTestEngine({
        inkwell: 0,
        play: [freeLocationCard],
        hand: [testCharacterCard],
      });

      const { character, location, result } = testEngine.moveToLocation({
        location: freeLocationCard,
        character: testCharacterCard,
        doNotThrow: true,
      });

      expect(character.isAtLocation(location)).toBeFalsy();
      expect(location.containsCharacter(character)).toBeFalsy();
      expect(result.success).toBeFalsy();
    });

    it("should validate location is in play zone", async () => {
      const testEngine = new LorcanaTestEngine({
        inkwell: 0,
        play: [testCharacterCard],
        hand: [freeLocationCard],
      });

      const { character, location, result } = testEngine.moveToLocation({
        location: freeLocationCard,
        character: testCharacterCard,
        doNotThrow: true,
      });

      expect(character.isAtLocation(location)).toBeFalsy();
      expect(location.containsCharacter(character)).toBeFalsy();
      expect(result.success).toBeFalsy();
    });
  });
});
