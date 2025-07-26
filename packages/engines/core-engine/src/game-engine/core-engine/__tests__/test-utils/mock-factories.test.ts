/**
 * Tests for mock factory functions
 */
import {
  createMockCardInstance,
  createMockEngine,
  createMockGameCard,
  createMockMove,
  createMockMoveValidationError,
  createMockNotFoundError,
  createMockPermissionError,
  createMockPlayer,
  createMockStateUpdateError,
  createMockSystemError,
  createMockValidationError,
  createMockZone,
  createStandardTestContextConfig,
  createStandardTestEngineConfig,
  describe,
  expect,
  it,
} from "./index";

describe("Mock Factory Functions", () => {
  describe("Player Mocks", () => {
    it("should create a mock player with default properties", () => {
      const player = createMockPlayer("player1");

      expect(player.id).toBe("player1");
      expect(player.name).toBe("Player player1");
      expect(player.resources).toBe(0);
      expect(player.active).toBe(true);
    });

    it("should override default properties", () => {
      const player = createMockPlayer("player2", {
        name: "Custom Name",
        resources: 5,
        active: false,
        customProp: "value",
      });

      expect(player.id).toBe("player2");
      expect(player.name).toBe("Custom Name");
      expect(player.resources).toBe(5);
      expect(player.active).toBe(false);
      expect(player.customProp).toBe("value");
    });
  });

  describe("Card Mocks", () => {
    it("should create a mock card instance", () => {
      const card = createMockCardInstance("card1", "player1", "CARD_001");

      expect(card.instanceId).toBe("card1");
      expect(card.ownerId).toBe("player1");
      expect(card.publicId).toBe("CARD_001");
    });

    it("should create a mock game card", () => {
      type TestCardDefinition = {
        id: string;
        name?: string;
        strength: number;
        health: number;
      };

      const card = createMockGameCard<TestCardDefinition>(
        "card1",
        "player1",
        "CARD_001",
        {
          definition: {
            id: "CARD_001",
            strength: 5,
            health: 10,
          },
        },
      );

      expect(card.instanceId).toBe("card1");
      expect(card.ownerId).toBe("player1");
      expect(card.publicId).toBe("CARD_001");
      expect(card.definition.strength).toBe(5);
      expect(card.definition.health).toBe(10);
    });
  });

  describe("Zone Mocks", () => {
    it("should create a mock zone with default properties", () => {
      const zone = createMockZone("hand1", "player1");

      expect(zone.id).toBe("hand1");
      expect(zone.name).toBe("hand1");
      expect(zone.owner).toBe("player1");
      expect(zone.cards).toEqual([]);
      expect(zone.visibility).toBe("public");
    });

    it("should create a mock zone with cards", () => {
      const zone = createMockZone("hand1", "player1", ["card1", "card2"]);

      expect(zone.id).toBe("hand1");
      expect(zone.cards).toEqual(["card1", "card2"]);
    });

    it("should override default properties", () => {
      const zone = createMockZone("hand1", "player1", [], {
        name: "Player 1 Hand",
        visibility: "private",
        maxSize: 7,
      });

      expect(zone.id).toBe("hand1");
      expect(zone.name).toBe("Player 1 Hand");
      expect(zone.visibility).toBe("private");
      expect(zone.maxSize).toBe(7);
    });
  });

  describe("Move Mocks", () => {
    it("should create a mock move with default properties", () => {
      const move = createMockMove("player1", "PLAY_CARD");

      expect(move.playerId).toBe("player1");
      expect(move.type).toBe("PLAY_CARD");
      expect(move.data).toEqual({});
      expect(move.moveId).toMatch(/^move-\d+$/);
      expect(move.timestamp).toBeGreaterThan(0);
    });

    it("should create a mock move with custom data", () => {
      const move = createMockMove(
        "player1",
        "PLAY_CARD",
        { cardId: "card1", targetZone: "play1" },
        "move-123",
      );

      expect(move.playerId).toBe("player1");
      expect(move.type).toBe("PLAY_CARD");
      expect(move.data).toEqual({ cardId: "card1", targetZone: "play1" });
      expect(move.moveId).toBe("move-123");
    });
  });

  describe("Engine Mocks", () => {
    it("should create a mock engine with default methods", () => {
      const engine = createMockEngine();

      expect(engine.gameId).toBe("test-game");
      expect(engine.playerOrder).toEqual(["player1", "player2"]);
      expect(typeof engine.moveCard).toBe("function");
      expect(typeof engine.getCardZone).toBe("function");
      expect(typeof engine.getCard).toBe("function");
      expect(typeof engine.queryCards).toBe("function");
    });

    it("should create a mock engine with custom methods", () => {
      const moveCard = () => true;
      const getCard = (id: string) => ({ id });

      const engine = createMockEngine({
        moveCard,
        getCard,
        customMethod: () => "custom",
      });

      expect(engine.moveCard).toBe(moveCard);
      expect(engine.getCard).toBe(getCard);
      expect(engine.customMethod()).toBe("custom");
    });
  });

  describe("Error Mocks", () => {
    it("should create a mock validation error", () => {
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
      expect(error.message).toBe(
        "card validation failed: expected 'health' to be positive, got -5",
      );
    });

    it("should create a mock not found error", () => {
      const error = createMockNotFoundError("card", "card1", { zone: "hand1" });

      expect(error.entityType).toBe("card");
      expect(error.entityId).toBe("card1");
      expect(error.context).toEqual({ zone: "hand1" });
      expect(error.message).toBe("card 'card1' not found");
    });

    it("should create a mock move validation error", () => {
      const error = createMockMoveValidationError(
        "PLAY_CARD",
        "insufficient resources",
        { required: 5, available: 3 },
      );

      expect(error.moveType).toBe("PLAY_CARD");
      expect(error.reason).toBe("insufficient resources");
      expect(error.context).toEqual({ required: 5, available: 3 });
      expect(error.message).toBe(
        "move 'PLAY_CARD' validation failed: insufficient resources",
      );
    });

    it("should create a mock permission error", () => {
      const error = createMockPermissionError(
        "player1",
        "play card",
        "not your turn",
      );

      expect(error.playerID).toBe("player1");
      expect(error.action).toBe("play card");
      expect(error.reason).toBe("not your turn");
      expect(error.message).toBe(
        "player 'player1' cannot 'play card': not your turn",
      );
    });

    it("should create a mock state update error", () => {
      const error = createMockStateUpdateError(
        "game",
        "transition",
        "invalid state",
      );

      expect(error.stateType).toBe("game");
      expect(error.updateType).toBe("transition");
      expect(error.cause).toBeInstanceOf(Error);
      expect(error.cause.message).toBe("invalid state");
      expect(error.message).toBe(
        "failed to update 'game' state during 'transition': invalid state",
      );
    });

    it("should create a mock system error", () => {
      const error = createMockSystemError(
        "engine",
        "initialization",
        "configuration missing",
      );

      expect(error.component).toBe("engine");
      expect(error.operation).toBe("initialization");
      expect(error.message).toBe(
        "system failure in 'engine' during 'initialization': configuration missing",
      );
    });
  });

  describe("Configuration Mocks", () => {
    it("should create a standard test engine configuration", () => {
      const config = createStandardTestEngineConfig();

      expect(config.gameId).toBe("test-game");
      expect(config.playerCount).toBe(2);
      expect(config.initialState.playerOrder).toEqual(["player1", "player2"]);
      expect(config.initialState.turnPlayerPos).toBe(0);
      expect(config.initialState.currentSegment).toBe("setup");
    });

    it("should override standard test engine configuration", () => {
      const config = createStandardTestEngineConfig({
        gameId: "custom-game",
        playerCount: 4,
        initialState: {
          playerOrder: ["p1", "p2", "p3", "p4"],
          turnPlayerPos: 1,
          currentSegment: "main",
        },
      });

      expect(config.gameId).toBe("custom-game");
      expect(config.playerCount).toBe(4);
      expect(config.initialState.playerOrder).toEqual(["p1", "p2", "p3", "p4"]);
      expect(config.initialState.turnPlayerPos).toBe(1);
      expect(config.initialState.currentSegment).toBe("main");
    });

    it("should create a standard test context configuration", () => {
      const config = createStandardTestContextConfig();

      expect(config.gameId).toBe("test-game");
      expect(config.playerOrder).toEqual(["player1", "player2"]);
      expect(config.turnPlayerPos).toBe(0);
      expect(config.currentSegment).toBe("setup");
      expect(config.cards).toEqual({ player1: {}, player2: {} });
      expect(config.cardZones).toEqual({});
    });

    it("should override standard test context configuration", () => {
      const config = createStandardTestContextConfig({
        gameId: "custom-game",
        playerOrder: ["p1", "p2", "p3"],
        turnPlayerPos: 1,
        currentSegment: "main",
      });

      expect(config.gameId).toBe("custom-game");
      expect(config.playerOrder).toEqual(["p1", "p2", "p3"]);
      expect(config.turnPlayerPos).toBe(1);
      expect(config.currentSegment).toBe("main");
    });
  });
});
