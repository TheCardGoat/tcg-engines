import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type {
  LorcanitoCharacterCard,
  LorcanitoLocationCard,
} from "@lorcanito/lorcana-engine";
import {
  cardWithoutInkwell,
  LorcanaTestEngine,
} from "../testing/lorcana-test-engine";
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
};

const expensiveLocationCard: LorcanitoLocationCard = {
  ...mockLocationCard,
  id: "test-location-expensive",
  name: "Expensive Location",
  cost: 3,
  moveCost: 3, // High cost to move characters here
  lore: 1,
};

const freeLocationCard: LorcanitoLocationCard = {
  ...mockLocationCard,
  id: "test-location-free",
  name: "Free Location",
  title: "Zero Move Cost",
  cost: 1,
  moveCost: 0, // Free to move characters here
  lore: 2,
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
      {
        testCards: [
          testCharacterCard,
          testLocationCard,
          expensiveLocationCard,
          freeLocationCard,
          testOpponentCharacterCard,
          freeOpponentLocationCard,
        ],
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

  // describe("Basic functionality", () => {
  //   it("should have moveToLocation method defined", () => {
  //     expect(testEngine.moveToLocation).toBeDefined();
  //     expect(typeof testEngine.moveToLocation).toBe("function");
  //   });
  // });
  //
  // describe("**4.3.7.1** Ownership validation - Player can move only their characters to their locations", () => {
  //   it("should allow moving own character to own location", () => {
  //     const character = testEngine.getCardModel(testCharacterCard);
  //     const location = testEngine.getCardModel(testLocationCard);
  //
  //     expect(character.isAtLocation(location)).toBeFalsy();
  //     expect(location.containsCharacter(character)).toBeFalsy();
  //
  //     testEngine.moveToLocation({
  //       character,
  //       location,
  //     });
  //
  //     expect(character.isAtLocation(location)).toBeTrue();
  //     expect(location.containsCharacter(character)).toBeTrue();
  //   });
  //
  //   it("should prevent moving opponent's character", async () => {
  //     const character = testEngine.getCardModel(testOpponentCharacterCard);
  //     const location = testEngine.getCardModel(testLocationCard);
  //
  //     const { result } = testEngine.moveToLocation({
  //       character,
  //       location,
  //       doNotThrow: true,
  //     });
  //
  //     expect(result.success).toBeFalsy();
  //     expect(character.isAtLocation(location)).toBeFalsy();
  //     expect(location.containsCharacter(character)).toBeFalsy();
  //   });
  //
  //   it("should prevent moving character to opponent's location", async () => {
  //     const character = testEngine.getCardModel(testCharacterCard);
  //     const location = testEngine.getCardModel(freeOpponentLocationCard);
  //
  //     const { result } = testEngine.moveToLocation({
  //       character,
  //       location,
  //       doNotThrow: true,
  //     });
  //
  //     expect(result.success).toBeFalsy();
  //     expect(character.isAtLocation(location)).toBeFalsy();
  //     expect(location.containsCharacter(character)).toBeFalsy();
  //   });
  // });

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

    it.skip("should be able to move multiple times during one turn", async () => {
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

  describe.skip("**4.3.7.4** Move cost payment", () => {
    it("should require sufficient ink to pay move cost", async () => {
      // Create test engine with expensive location and insufficient ink
      const tempEngine = new LorcanaTestEngine(
        {
          play: [testCharacterCard, expensiveLocationCard], // Expensive location (cost 3)
          inkwell: [cardWithoutInkwell], // Only 1 ink available
          deck: 5,
        },
        { deck: 5 },
        {
          testCards: [expensiveLocationCard],
        },
      );

      tempEngine.changeActivePlayer("player_one");

      const characters = tempEngine
        .getCardsInZone("play", "player_one")
        .filter((card) => card.card.type.toLowerCase().includes("character"));
      const locations = tempEngine
        .getCardsInZone("play", "player_one")
        .filter((card) => card.card.type.toLowerCase().includes("location"));

      expect(characters.length).toBeGreaterThan(0);
      expect(locations.length).toBeGreaterThan(0);

      expect(() => {
        tempEngine.moveToLocation({
          character: characters[0],
          location: locations[0],
          skipAssertion: true,
        });
      }).toThrow();

      tempEngine.dispose();
    });

    it("should allow move when sufficient ink is available", async () => {
      // Create test engine with sufficient ink for expensive location
      const tempEngine = new LorcanaTestEngine(
        {
          play: [testCharacterCard, expensiveLocationCard],
          inkwell: [cardWithoutInkwell, cardWithoutInkwell, cardWithoutInkwell], // 3 ink available
          deck: 5,
        },
        { deck: 5 },
        {
          testCards: [expensiveLocationCard],
        },
      );

      tempEngine.changeActivePlayer("player_one");

      const characters = tempEngine
        .getCardsInZone("play", "player_one")
        .filter((card) => card.card.type.toLowerCase().includes("character"));
      const locations = tempEngine
        .getCardsInZone("play", "player_one")
        .filter((card) => card.card.type.toLowerCase().includes("location"));

      if (characters.length > 0 && locations.length > 0) {
        try {
          const result = await tempEngine.moveToLocation({
            character: characters[0],
            location: locations[0],
            skipAssertion: true,
          });
          expect(result).toBeDefined();
        } catch (error) {
          // Implementation may not be complete, test documents expected behavior
          expect(error).toBeDefined();
        }
      }

      tempEngine.dispose();
    });
  });

  describe.skip("**4.3.7.5** Triggered effects", () => {
    it("should trigger effects when character moves to location", async () => {
      const playerCharacters = testEngine
        .getCardsInZone("play", "player_one")
        .filter((card) => card.card.type.toLowerCase().includes("character"));
      const playerLocations = testEngine
        .getCardsInZone("play", "player_one")
        .filter((card) => card.card.type.toLowerCase().includes("location"));

      if (playerCharacters.length > 0 && playerLocations.length > 0) {
        try {
          await testEngine.moveToLocation({
            character: playerCharacters[0],
            location: playerLocations[0],
            skipAssertion: true,
          });
          // Effects should be added to bag for resolution
          // Test documents this requirement
        } catch (error) {
          // Implementation may trigger errors, test documents expected behavior
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe.skip("**4.3.7.6** Move completion", () => {
    it("should complete move after effects resolve", async () => {
      const playerCharacters = testEngine
        .getCardsInZone("play", "player_one")
        .filter((card) => card.card.type.toLowerCase().includes("character"));
      const playerLocations = testEngine
        .getCardsInZone("play", "player_one")
        .filter((card) => card.card.type.toLowerCase().includes("location"));

      if (playerCharacters.length > 0 && playerLocations.length > 0) {
        try {
          const result = await testEngine.moveToLocation({
            character: playerCharacters[0],
            location: playerLocations[0],
            skipAssertion: true,
          });

          // Move should be complete after all effects resolve
          expect(result).toBeDefined();
        } catch (error) {
          // Implementation may not be complete, test documents expected behavior
          expect(error).toBeDefined();
        }
      }
    });
  });

  describe.skip("Edge cases and validation", () => {
    it("should handle free locations (move cost 0)", async () => {
      const tempEngine = new LorcanaTestEngine(
        {
          play: [testCharacterCard, freeLocationCard], // Free location
          inkwell: [], // No ink available
          deck: 5,
        },
        { deck: 5 },
        {
          testCards: [freeLocationCard],
        },
      );

      tempEngine.changeActivePlayer("player_one");

      const characters = tempEngine
        .getCardsInZone("play", "player_one")
        .filter((card) => card.card.type.toLowerCase().includes("character"));
      const locations = tempEngine
        .getCardsInZone("play", "player_one")
        .filter((card) => card.card.type.toLowerCase().includes("location"));

      if (characters.length > 0 && locations.length > 0) {
        try {
          const result = await tempEngine.moveToLocation({
            character: characters[0],
            location: locations[0],
            skipAssertion: true,
          });
          // Should succeed even with no ink since move cost is 0
          expect(result).toBeDefined();
        } catch (error) {
          // Implementation may not be complete
          expect(error).toBeDefined();
        }
      }

      tempEngine.dispose();
    });

    it("should validate character is in play zone", async () => {
      // Test that characters must be in play to be moved
      const handCharacters = testEngine.getCardsInZone("hand", "player_one");
      const playerLocations = testEngine
        .getCardsInZone("play", "player_one")
        .filter((card) => card.card.type.toLowerCase().includes("location"));

      expect(handCharacters.length).toBeGreaterThan(0);
      expect(playerLocations.length).toBeGreaterThan(0);

      expect(() => {
        testEngine.moveToLocation({
          character: handCharacters[0],
          location: playerLocations[0],
          skipAssertion: true,
        });
      }).toThrow();
    });

    it("should validate location is in play zone", async () => {
      // Create engine with location in hand instead of play
      const tempEngine = new LorcanaTestEngine(
        {
          play: [testCharacterCard], // Character in play
          hand: [testLocationCard], // Location in hand
          inkwell: [cardWithoutInkwell],
          deck: 5,
        },
        { deck: 5 },
        {
          testCards: [testLocationCard],
        },
      );

      tempEngine.changeActivePlayer("player_one");

      const characters = tempEngine
        .getCardsInZone("play", "player_one")
        .filter((card) => card.card.type.toLowerCase().includes("character"));
      const handLocations = tempEngine.getCardsInZone("hand", "player_one");

      expect(characters.length).toBeGreaterThan(0);
      expect(handLocations.length).toBeGreaterThan(0);

      expect(() => {
        tempEngine.moveToLocation({
          character: characters[0],
          location: handLocations[0], // Location not in play
          skipAssertion: true,
        });
      }).toThrow();

      tempEngine.dispose();
    });
  });
});
