import { describe, expect, it } from "bun:test";
import type { CoreEngineState } from "~/game-engine/core-engine/game-configuration";
import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import type { GameCards } from "~/game-engine/core-engine/types";
import { createContext } from "~/game-engine/core-engine/utils/context-factory";
import type {
  EnumerableMove,
  GameMoveConstraint,
  MoveConstraintFailure,
  TargetSpec,
} from "../move-types";
import {
  createEnumerableMove,
  createInvalidMove,
  isInvalidMove,
} from "../move-types";

describe("Move Types - Enumerable Move System", () => {
  // Mock types for testing
  type TestGameState = { turnActions?: { testAction?: boolean } };
  type TestCoreOps = {
    getCtx: () => CoreCtx;
    state: CoreEngineState<TestGameState>;
    getCurrentTurnPlayer: () => string;
    moveCard: (options: unknown) => void;
  };
  type TestGameOps = {
    processMove: (move: string) => void;
    validateMove: (move: string) => boolean;
  };
  type TestContext = {
    G: TestGameState;
    ctx: CoreCtx;
    coreOps: TestCoreOps;
    gameOps: TestGameOps;
    playerID: string;
    _getUpdatedState: () => CoreEngineState<TestGameState>;
  };

  // Helper function to create mock context
  function createMockContext(): CoreCtx {
    return createContext({
      playerOrder: ["player1", "player2"],
      cards: {} as GameCards,
      players: {
        player1: { id: "player1", name: "Player 1" },
        player2: { id: "player2", name: "Player 2" },
      },
      initialPhase: "mainPhase",
      gameId: "test-game",
      matchId: "test-match",
    });
  }

  // Helper function to create mock core operations
  function createMockCoreOps(gameState: TestGameState): TestCoreOps {
    const mockCtx = createMockContext();
    const mockState: CoreEngineState<TestGameState> = {
      G: gameState,
      ctx: mockCtx,
      _undo: [],
      _redo: [],
      _stateID: 0,
    };

    return {
      getCtx: () => mockCtx,
      state: mockState,
      getCurrentTurnPlayer: () => "player1",
      moveCard: () => {},
    };
  }

  // Helper function to create mock game operations
  function createMockGameOps(): TestGameOps {
    return {
      processMove: () => {},
      validateMove: () => true,
    };
  }

  describe("InvalidMoveResult", () => {
    it("should create a structured invalid move result with reason and message key", () => {
      const result = createInvalidMove("TEST_ERROR", "test.error.key");

      expect(result.type).toBe("INVALID_MOVE");
      expect(result.reason).toBe("TEST_ERROR");
      expect(result.messageKey).toBe("test.error.key");
    });

    it("should include context when provided", () => {
      const context = { playerId: "player1", cardId: "card1" };
      const result = createInvalidMove("TEST_ERROR", "test.error.key", context);

      expect(result.context).toEqual(context);
    });

    it("isInvalidMove should correctly identify invalid move results", () => {
      const validResult = createInvalidMove("TEST", "test.key");
      const invalidResult = { type: "VALID_MOVE" };
      const notObject = "not an object";

      expect(isInvalidMove(validResult)).toBe(true);
      expect(isInvalidMove(invalidResult)).toBe(false);
      expect(isInvalidMove(notObject)).toBe(false);
      expect(isInvalidMove(null)).toBe(false);
    });
  });

  describe("Move execution with proper mocks", () => {
    it("should handle test move with proper context objects", () => {
      const mockCtx = createMockContext();
      const passContext: TestContext = {
        G: { turnActions: { testAction: false } },
        ctx: mockCtx,
        coreOps: createMockCoreOps({ turnActions: { testAction: false } }),
        gameOps: createMockGameOps(),
        playerID: "player1",
        _getUpdatedState: () => ({
          G: { turnActions: { testAction: false } },
          ctx: mockCtx,
          _undo: [],
          _redo: [],
          _stateID: 0,
        }),
      };

      const failContext: TestContext = {
        G: { turnActions: { testAction: true } },
        ctx: mockCtx,
        coreOps: createMockCoreOps({ turnActions: { testAction: true } }),
        gameOps: createMockGameOps(),
        playerID: "player1",
        _getUpdatedState: () => ({
          G: { turnActions: { testAction: true } },
          ctx: mockCtx,
          _undo: [],
          _redo: [],
          _stateID: 0,
        }),
      };

      // Test that contexts are properly created
      expect(passContext.ctx.playerOrder).toEqual(["player1", "player2"]);
      expect(passContext.coreOps.getCurrentTurnPlayer()).toBe("player1");
      expect(failContext.gameOps.validateMove("test")).toBe(true);
    });
  });

  describe("GameMoveConstraint", () => {
    it("should define constraint structure correctly", () => {
      const constraint: GameMoveConstraint = {
        id: "test-constraint",
        check: () => true,
        failureReason: "Action already used this turn",
        messageKey: "game.error.action_already_used",
        context: { action: "testAction" },
      };

      expect(constraint.id).toBe("test-constraint");
      expect(typeof constraint.check).toBe("function");
      expect(constraint.failureReason).toBe("Action already used this turn");
      expect(constraint.messageKey).toBe("game.error.action_already_used");
      expect(constraint.context).toEqual({ action: "testAction" });
    });

    it("should validate constraint evaluation", () => {
      const mockCtx = createMockContext();
      const passContext: TestContext = {
        G: { turnActions: { testAction: false } },
        ctx: mockCtx,
        coreOps: createMockCoreOps({ turnActions: { testAction: false } }),
        gameOps: createMockGameOps(),
        playerID: "player1",
        _getUpdatedState: () =>
          ({
            G: { turnActions: { testAction: false } },
            ctx: mockCtx,
          }) as CoreEngineState<TestGameState>,
      };

      const failContext: TestContext = {
        G: { turnActions: { testAction: true } },
        ctx: mockCtx,
        coreOps: createMockCoreOps({ turnActions: { testAction: true } }),
        gameOps: createMockGameOps(),
        playerID: "player1",
        _getUpdatedState: () =>
          ({
            G: { turnActions: { testAction: true } },
            ctx: mockCtx,
          }) as CoreEngineState<TestGameState>,
      };

      // Simple constraint that always passes for test
      const constraint: GameMoveConstraint = {
        id: "test-constraint",
        check: (context: any) => context.G.turnActions?.testAction !== true,
        failureReason: "Action already used",
        messageKey: "test.key",
      };

      expect(constraint.check(passContext as any)).toBe(true);
      expect(constraint.check(failContext as any)).toBe(false);
    });
  });

  describe("TargetSpec", () => {
    it("should define card target specification", () => {
      const cardTarget: TargetSpec<TestContext, any> = {
        id: "target-card",
        parameterIndex: 0,
        required: true,
        targetType: "card",
        cardFilter: { name: "Test Card" },
        description: "Select a card to target",
        messageKey: "game.target.select_card",
      };

      expect(cardTarget.targetType).toBe("card");
      expect(cardTarget.parameterIndex).toBe(0);
      expect(cardTarget.required).toBe(true);
      expect(cardTarget.cardFilter).toEqual({ name: "Test Card" });
    });

    it("should define player target specification", () => {
      const playerTarget: TargetSpec<TestContext, any> = {
        id: "target-player",
        parameterIndex: 1,
        required: false,
        targetType: "player",
        playerFilter: (context, playerId) => playerId !== context.playerID,
        description: "Select a player to target",
        messageKey: "game.target.select_player",
      };

      expect(playerTarget.targetType).toBe("player");
      expect(playerTarget.required).toBe(false);
      expect(typeof playerTarget.playerFilter).toBe("function");
    });

    it("should define choice target specification", () => {
      const choiceTarget: TargetSpec<TestContext, any> = {
        id: "target-choice",
        parameterIndex: 0,
        required: true,
        targetType: "choice",
        choices: ["option1", "option2", "option3"],
        description: "Choose an option",
        messageKey: "game.target.choose_option",
      };

      expect(choiceTarget.targetType).toBe("choice");
      expect(choiceTarget.choices).toEqual(["option1", "option2", "option3"]);
    });
  });

  describe("EnumerableMove", () => {
    it("should create minimal enumerable move with just execute function", () => {
      const mockExecute = ({ G }: any) => G;

      const move: EnumerableMove<TestGameState, any, any, any, any> = {
        execute: mockExecute,
      };

      expect(move.execute).toBe(mockExecute);
      expect(move.getConstraints).toBeUndefined();
      expect(move.getTargetSpecs).toBeUndefined();
      expect(move.getPriority).toBeUndefined();
    });

    it("should create full enumerable move with all optional methods", () => {
      const mockExecute = ({ G }: any) => G;
      const mockConstraints = () => [];
      const mockTargetSpecs = () => [];
      const mockPriority = () => 10;

      const move: EnumerableMove<TestGameState, any, any, any, any> = {
        execute: mockExecute,
        getConstraints: mockConstraints,
        getTargetSpecs: mockTargetSpecs,
        getPriority: mockPriority,
      };

      expect(move.execute).toBe(mockExecute);
      expect(move.getConstraints).toBe(mockConstraints);
      expect(move.getTargetSpecs).toBe(mockTargetSpecs);
      expect(move.getPriority).toBe(mockPriority);
    });

    it("should work with createEnumerableMove helper", () => {
      const move = createEnumerableMove({
        execute: ({ G }: any) => G,
        getPriority: () => 5,
      });

      expect(typeof move.execute).toBe("function");
      expect(typeof move.getPriority).toBe("function");
      expect(move.getPriority!({} as any)).toBe(5);
    });
  });
});
