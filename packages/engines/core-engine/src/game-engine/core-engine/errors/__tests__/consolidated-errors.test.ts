import { describe, expect, it } from "../../__tests__/test-utils";
import {
  EntityNotFoundError,
  MoveValidationFailedError,
  PermissionDeniedError,
  StateUpdateFailedError,
  SystemFailureError,
  ValidationFailedError,
} from "../consolidated-errors";
import { EngineError } from "../engine-errors";

describe("Consolidated Error Types", () => {
  describe("ValidationFailedError", () => {
    it("should create a validation error with the correct properties", () => {
      const error = new ValidationFailedError(
        "card",
        "card123",
        "strength",
        "positive number",
        -5,
      );

      expect(error).toBeInstanceOf(EngineError);
      expect(error.category).toBe("validation");
      expect(error.type).toBe("VALIDATION_FAILED");
      expect(error.message).toBe(
        "card validation failed: expected 'strength' to be positive number, got -5",
      );
      expect(error.entityType).toBe("card");
      expect(error.entityId).toBe("card123");
      expect(error.property).toBe("strength");
      expect(error.expectedValue).toBe("positive number");
      expect(error.actualValue).toBe(-5);
    });

    it("should handle validation errors without actual value", () => {
      const error = new ValidationFailedError(
        "state",
        "game",
        "playerOrder",
        "non-empty array",
      );

      expect(error.message).toBe(
        "state 'game' validation failed: playerOrder: non-empty array",
      );
      expect(error.actualValue).toBeUndefined();
    });
  });

  describe("EntityNotFoundError", () => {
    it("should create a not found error with the correct properties", () => {
      const error = new EntityNotFoundError("card", "card123", {
        playerId: "player1",
      });

      expect(error).toBeInstanceOf(EngineError);
      expect(error.category).toBe("validation");
      expect(error.type).toBe("ENTITY_NOT_FOUND");
      expect(error.message).toBe("card 'card123' not found");
      expect(error.entityType).toBe("card");
      expect(error.entityId).toBe("card123");
      expect(error.context).toEqual({ playerId: "player1" });
    });
  });

  describe("StateUpdateFailedError", () => {
    it("should create a state update error with the correct properties", () => {
      const cause = new Error("Database connection failed");
      const error = new StateUpdateFailedError("context", "save", cause);

      expect(error).toBeInstanceOf(EngineError);
      expect(error.category).toBe("state");
      expect(error.type).toBe("STATE_UPDATE_FAILED");
      expect(error.message).toBe(
        "failed to update 'context' state during 'save': Database connection failed",
      );
      expect(error.stateType).toBe("context");
      expect(error.updateType).toBe("save");
      expect(error.cause).toBe(cause);
    });
  });

  describe("MoveValidationFailedError", () => {
    it("should create a move validation error with the correct properties", () => {
      const error = new MoveValidationFailedError(
        "PLAY_CARD",
        "insufficient resources",
        { requiredInk: 5, availableInk: 3 },
      );

      expect(error).toBeInstanceOf(EngineError);
      expect(error.category).toBe("validation");
      expect(error.type).toBe("MOVE_VALIDATION_FAILED");
      expect(error.message).toBe(
        "move 'PLAY_CARD' validation failed: insufficient resources",
      );
      expect(error.moveType).toBe("PLAY_CARD");
      expect(error.reason).toBe("insufficient resources");
      expect(error.context).toEqual({ requiredInk: 5, availableInk: 3 });
    });
  });

  describe("PermissionDeniedError", () => {
    it("should create a permission error with the correct properties", () => {
      const error = new PermissionDeniedError(
        "player1",
        "play card",
        "not your turn",
      );

      expect(error).toBeInstanceOf(EngineError);
      expect(error.category).toBe("validation");
      expect(error.type).toBe("PERMISSION_DENIED");
      expect(error.message).toBe(
        "player 'player1' cannot 'play card': not your turn",
      );
      expect(error.playerID).toBe("player1");
      expect(error.action).toBe("play card");
      expect(error.reason).toBe("not your turn");
    });
  });

  describe("SystemFailureError", () => {
    it("should create a system error with the correct properties", () => {
      const cause = new Error("Out of memory");
      const error = new SystemFailureError(
        "card-repository",
        "load-cards",
        cause,
      );

      expect(error).toBeInstanceOf(EngineError);
      expect(error.category).toBe("system");
      expect(error.type).toBe("SYSTEM_FAILURE");
      expect(error.message).toBe(
        "system failure in 'card-repository' during 'load-cards': Out of memory",
      );
      expect(error.component).toBe("card-repository");
      expect(error.operation).toBe("load-cards");
      expect(error.cause).toBe(cause);
    });

    it("should handle string cause", () => {
      const error = new SystemFailureError(
        "engine",
        "initialization",
        "Configuration missing",
      );

      expect(error.message).toBe(
        "system failure in 'engine' during 'initialization': Configuration missing",
      );
      expect(error.cause).toBeUndefined();
    });
  });
});
