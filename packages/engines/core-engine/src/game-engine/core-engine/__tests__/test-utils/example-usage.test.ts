/**
 * Example usage of consolidated test utilities
 * This file demonstrates how to use the test utilities in your tests
 */
import {
  addCardToPlayer,
  addCardToZone,
  assertCardInZone,
  assertCardNotInZone,
  assertGamePhase,
  assertPlayerHasCard,
  assertPlayerIsTurnPlayer,
  createMinimalTestContext,
  createMockCardInstance,
  createMockEngine,
  createMockMove,
  createMockMoveValidationError,
  createMockNotFoundError,
  createMockPermissionError,
  createMockPlayer,
  createMockValidationError,
  createMockZone,
  createStandardTestContextConfig,
  createStandardTestEngineConfig,
  createTestContextWithCards,
  createTestContextWithPhase,
  createTestContextWithTurnState,
  createZone,
  describe,
  expect,
  expectToThrowMoveValidationError,
  expectToThrowNotFoundError,
  expectToThrowPermissionError,
  expectToThrowValidationError,
  it,
  moveCardBetweenZones,
} from "./index";

// Removed unused imports

describe("Test Utilities Example Usage", () => {
  describe("Context Creation Utilities", () => {
    it("should create a minimal test context", () => {
      const ctx = createMinimalTestContext();

      expect(ctx.gameId).toBe("test-game");
      expect(ctx.playerOrder).toEqual(["player1", "player2"]);
      expect(ctx.turnPlayerPos).toBe(0);
    });

    it("should create a context with cards in zones", () => {
      const ctx = createTestContextWithCards(
        {
          player1: {
            card1: { definition: "CARD_001" },
            card2: { definition: "CARD_002" },
          },
          player2: {
            card3: { definition: "CARD_001" },
          },
        },
        [
          { zoneId: "hand1", owner: "player1", cards: ["card1"] },
          { zoneId: "play1", owner: "player1", cards: ["card2"] },
          { zoneId: "hand2", owner: "player2", cards: ["card3"] },
        ],
      );

      expect(ctx.cards.player1.card1).toBeDefined();
      expect(ctx.cardZones?.hand1.cards).toContain("card1");
      expect(ctx.cardZones?.play1.cards).toContain("card2");
    });

    it("should create a context with specific phase", () => {
      const ctx = createTestContextWithPhase(
        "mainPhase",
        "action",
        "playerAction",
      );

      expect(ctx.currentSegment).toBe("mainPhase");
      expect(ctx.currentPhase).toBe("action");
      expect(ctx.currentStep).toBe("playerAction");
    });

    it("should create a context with specific turn state", () => {
      const ctx = createTestContextWithTurnState("player2", "player1");

      expect(ctx.playerOrder[ctx.turnPlayerPos]).toBe("player2");
      expect(ctx.playerOrder[ctx.priorityPlayerPos]).toBe("player1");
    });

    it("should use standard test context configuration", () => {
      const config = createStandardTestContextConfig({
        currentSegment: "main",
        currentPhase: "action",
      });

      expect(config.gameId).toBe("test-game");
      expect(config.currentSegment).toBe("main");
      expect(config.currentPhase).toBe("action");
    });
  });

  describe("Mock Object Creation", () => {
    it("should create mock players", () => {
      const player = createMockPlayer("player1", {
        resources: 5,
        customProp: "value",
      });

      expect(player.id).toBe("player1");
      expect(player.name).toBe("Player player1");
      expect(player.resources).toBe(5);
      expect(player.customProp).toBe("value");
    });

    it("should create mock card instances", () => {
      const card = createMockCardInstance("card1", "player1", "CARD_001", {
        strength: 5,
        health: 10,
      });

      expect(card.instanceId).toBe("card1");
      expect(card.ownerId).toBe("player1");
      expect(card.publicId).toBe("CARD_001");
      // Using type assertion to access custom properties
      expect((card as any).strength).toBe(5);
      expect((card as any).health).toBe(10);
    });

    it("should create mock zones", () => {
      const zone = createMockZone("hand1", "player1", ["card1", "card2"], {
        visibility: "private",
        maxSize: 7,
      });

      expect(zone.id).toBe("hand1");
      expect(zone.owner).toBe("player1");
      expect(zone.cards).toEqual(["card1", "card2"]);
      expect(zone.visibility).toBe("private");
      expect(zone.maxSize).toBe(7);
    });

    it("should create mock moves", () => {
      const move = createMockMove(
        "player1",
        "PLAY_CARD",
        { cardId: "card1" },
        "move-123",
      );

      expect(move.playerId).toBe("player1");
      expect(move.type).toBe("PLAY_CARD");
      expect(move.data).toEqual({ cardId: "card1" });
      expect(move.moveId).toBe("move-123");
    });

    it("should create mock engines", () => {
      const getCard = (id: string) => ({ id, name: "Test Card" });
      const engine = createMockEngine({
        getCard,
        customMethod: () => "custom result",
      });

      expect(engine.gameId).toBe("test-game");
      expect(engine.getCard("card1")).toEqual({
        id: "card1",
        name: "Test Card",
      });
      expect(engine.customMethod()).toBe("custom result");
    });

    it("should use standard test engine configuration", () => {
      const config = createStandardTestEngineConfig({
        gameId: "custom-game",
        playerCount: 4,
      });

      expect(config.gameId).toBe("custom-game");
      expect(config.playerCount).toBe(4);
      expect(config.initialState.playerOrder).toEqual(["player1", "player2"]);
    });
  });

  describe("Card Utilities", () => {
    it("should add cards to players and zones", () => {
      let ctx = createMinimalTestContext();

      // Add a card to a player
      ctx = addCardToPlayer(ctx, "player1", "card1", "CARD_001", { cost: 3 });

      // Create a zone
      ctx = createZone(ctx, "hand1", "player1");

      // Add the card to the zone
      ctx = addCardToZone(ctx, "hand1", "card1", "player1");

      // Move the card between zones
      ctx = createZone(ctx, "play1", "player1");
      ctx = moveCardBetweenZones(ctx, "card1", "hand1", "play1");

      // Assertions
      assertPlayerHasCard(ctx, "player1", "card1");
      assertCardNotInZone(ctx, "card1", "hand1");
      assertCardInZone(ctx, "card1", "play1");
    });
  });

  describe("Assertion Utilities", () => {
    it("should use assertion utilities", () => {
      let ctx = createMinimalTestContext();

      // Ensure the context has the expected phase
      ctx.currentSegment = "setup";

      // Setup test data
      ctx = addCardToPlayer(ctx, "player1", "card1", "CARD_001");
      ctx = createZone(ctx, "hand1", "player1");
      ctx = addCardToZone(ctx, "hand1", "card1", "player1");

      // Use assertions
      assertPlayerHasCard(ctx, "player1", "card1");
      assertCardInZone(ctx, "card1", "hand1");
      assertPlayerIsTurnPlayer(ctx, "player1");
      assertGamePhase(ctx, "setup"); // Default phase in minimal context
    });
  });

  describe("Error Testing Utilities", () => {
    it("should create and test validation errors", () => {
      const error = createMockValidationError(
        "card",
        "card1",
        "health",
        "positive",
        -5,
      );

      expect(error.entityType).toBe("card");
      expect(error.entityId).toBe("card1");
      expect(error.property).toBe("health");
      expect(error.expectedValue).toBe("positive");
      expect(error.actualValue).toBe(-5);

      // Test that a function throws a validation error
      const throwingFn = () => {
        throw error;
      };
      const caughtError = expectToThrowValidationError(
        throwingFn,
        "card",
        "health",
      );
      expect(caughtError.actualValue).toBe(-5);
    });

    it("should create and test not found errors", () => {
      const error = createMockNotFoundError("card", "card1", { zone: "hand" });

      expect(error.entityType).toBe("card");
      expect(error.entityId).toBe("card1");
      expect(error.context?.zone).toBe("hand");

      // Test that a function throws a not found error
      const throwingFn = () => {
        throw error;
      };
      const caughtError = expectToThrowNotFoundError(
        throwingFn,
        "card",
        "card1",
      );
      expect(caughtError.context?.zone).toBe("hand");
    });

    it("should create and test move validation errors", () => {
      const error = createMockMoveValidationError(
        "PLAY_CARD",
        "insufficient resources",
        { required: 5, available: 3 },
      );

      expect(error.moveType).toBe("PLAY_CARD");
      expect(error.reason).toBe("insufficient resources");
      expect(error.context).toEqual({ required: 5, available: 3 });

      // Test that a function throws a move validation error
      const throwingFn = () => {
        throw error;
      };
      expectToThrowMoveValidationError(throwingFn, "PLAY_CARD");
    });

    it("should create and test permission errors", () => {
      const error = createMockPermissionError(
        "player1",
        "play card",
        "not your turn",
      );

      expect(error.playerID).toBe("player1");
      expect(error.action).toBe("play card");
      expect(error.reason).toBe("not your turn");

      // Test that a function throws a permission error
      const throwingFn = () => {
        throw error;
      };
      expectToThrowPermissionError(throwingFn, "player1", "play card");
    });
  });
});
