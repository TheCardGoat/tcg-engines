import { describe, expect, it } from "bun:test";
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
  type TestContext = {
    G: TestGameState;
    ctx: any;
    coreOps: any;
    gameOps: any;
    playerID: string;
  };

  describe("InvalidMoveResult", () => {
    it("should create invalid move result with required fields", () => {
      const result = createInvalidMove("TEST_ERROR", "test.error.key");

      expect(result.type).toBe("INVALID_MOVE");
      expect(result.reason).toBe("TEST_ERROR");
      expect(result.messageKey).toBe("test.error.key");
      expect(result.context).toBeUndefined();
    });

    it("should create invalid move result with context", () => {
      const context = { cardId: "test-card", playerId: "player1" };
      const result = createInvalidMove("TEST_ERROR", "test.error.key", context);

      expect(result.context).toEqual(context);
    });

    it("should identify invalid move results correctly", () => {
      const validResult = createInvalidMove("TEST", "test.key");
      const invalidResult = { type: "OTHER_TYPE" };
      const notObject = "string";

      expect(isInvalidMove(validResult)).toBe(true);
      expect(isInvalidMove(invalidResult)).toBe(false);
      expect(isInvalidMove(notObject)).toBe(false);
      expect(isInvalidMove(null)).toBe(false);
    });
  });

  describe("GameMoveConstraint", () => {
    it("should define constraint structure correctly", () => {
      const constraint: GameMoveConstraint<TestContext> = {
        id: "test-constraint",
        check: (context) => context.G.turnActions?.testAction !== true,
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
      const constraint: GameMoveConstraint<TestContext> = {
        id: "test-constraint",
        check: (context) => context.G.turnActions?.testAction !== true,
        failureReason: "Action already used",
        messageKey: "test.key",
      };

      const passContext: TestContext = {
        G: { turnActions: { testAction: false } },
        ctx: {},
        coreOps: {},
        gameOps: {},
        playerID: "player1",
      };

      const failContext: TestContext = {
        G: { turnActions: { testAction: true } },
        ctx: {},
        coreOps: {},
        gameOps: {},
        playerID: "player1",
      };

      expect(constraint.check(passContext)).toBe(true);
      expect(constraint.check(failContext)).toBe(false);
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
      const mockExecute = ({ G }: TestContext) => G;

      const move: EnumerableMove<TestGameState, any, any, any, any, any> = {
        execute: mockExecute,
      };

      expect(move.execute).toBe(mockExecute);
      expect(move.getConstraints).toBeUndefined();
      expect(move.getTargetSpecs).toBeUndefined();
      expect(move.getPriority).toBeUndefined();
    });

    it("should create full enumerable move with all optional methods", () => {
      const mockExecute = ({ G }: TestContext) => G;
      const mockConstraints = () => [];
      const mockTargetSpecs = () => [];
      const mockPriority = () => 10;

      const move: EnumerableMove<TestGameState, any, any, any, any, any> = {
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
        execute: ({ G }: TestContext) => G,
        getPriority: () => 5,
      });

      expect(typeof move.execute).toBe("function");
      expect(typeof move.getPriority).toBe("function");
      expect(move.getPriority!({} as any)).toBe(5);
    });
  });
});
