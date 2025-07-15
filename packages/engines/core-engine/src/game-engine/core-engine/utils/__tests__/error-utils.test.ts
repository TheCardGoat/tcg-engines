// Mock the logger
import { logger } from "../../../../shared/logger";
import { describe, expect, it, mock, spyOn } from "../../__tests__/test-utils";
import { CardNotFoundError } from "../../errors/domain-errors";
import {
  EngineError,
  MoveExecutionError,
  PlayerValidationError,
} from "../../errors/engine-errors";
import {
  createErrorResult,
  createSuccessResult,
  ErrorFormatters,
  executeOperation,
  executeOperationAsync,
  getErrorContext,
  isEngineError,
  isErrorOfType,
  safeExecute,
  safeExecuteAsync,
} from "../error-utils";

// Create spies for logger methods
const errorSpy = spyOn(logger, "error");
const logSpy = spyOn(logger, "log");

describe("Error Utilities", () => {
  describe("ErrorFormatters", () => {
    it("should format validation errors correctly", () => {
      const message = ErrorFormatters.validation(
        "playerID",
        "valid player",
        "invalid",
      );
      expect(message).toBe(
        "Expected valid player for playerID, but got invalid",
      );
    });

    it("should format not found errors correctly", () => {
      const message = ErrorFormatters.notFound("Card", "card123");
      expect(message).toBe("Card not found: card123");
    });

    it("should format permission errors correctly", () => {
      const message = ErrorFormatters.permission(
        "Card",
        "card123",
        "played",
        "player1",
        "not owner",
      );
      expect(message).toBe(
        "Card card123 cannot be played by player1: not owner",
      );
    });

    it("should format state errors correctly", () => {
      const message = ErrorFormatters.state(
        "Card",
        "card123",
        "already tapped",
      );
      expect(message).toBe("Invalid state for Card card123: already tapped");
    });

    it("should format execution errors correctly", () => {
      const message = ErrorFormatters.execution(
        "playCard",
        "insufficient resources",
      );
      expect(message).toBe(
        "Failed to execute playCard: insufficient resources",
      );
    });
  });

  describe("safeExecute", () => {
    it("should return the function result when no error occurs", () => {
      const result = safeExecute("test", () => "success");
      expect(result).toBe("success");
    });

    it("should wrap non-EngineErrors in MoveExecutionError", () => {
      expect(() => {
        safeExecute("test", () => {
          throw new Error("Regular error");
        });
      }).toThrow(MoveExecutionError);
    });

    it("should preserve EngineErrors", () => {
      expect(() => {
        safeExecute("test", () => {
          throw new PlayerValidationError("player1", "not active player");
        });
      }).toThrow(PlayerValidationError);
    });

    it("should include context in error", () => {
      try {
        safeExecute(
          "playCard",
          () => {
            throw new Error("Failed");
          },
          { playerID: "player1", moveType: "PLAY_CARD" },
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MoveExecutionError);
        const moveError = error as MoveExecutionError;
        expect(moveError.playerID).toBe("player1");
        expect(moveError.moveType).toBe("PLAY_CARD");
      }
    });
  });

  describe("safeExecuteAsync", () => {
    it("should return the function result when no error occurs", async () => {
      const result = await safeExecuteAsync("test", async () => "success");
      expect(result).toBe("success");
    });

    it("should wrap non-EngineErrors in MoveExecutionError", async () => {
      try {
        await safeExecuteAsync("test", async () => {
          throw new Error("Regular error");
        });
        // Should not reach here
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(MoveExecutionError);
      }
    });

    it("should preserve EngineErrors", async () => {
      try {
        await safeExecuteAsync("test", async () => {
          throw new PlayerValidationError("player1", "not active player");
        });
        // Should not reach here
        expect(false).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(PlayerValidationError);
      }
    });
  });

  describe("isEngineError", () => {
    it("should return true for EngineErrors", () => {
      expect(isEngineError(new PlayerValidationError("player1", "test"))).toBe(
        true,
      );
    });

    it("should return false for non-EngineErrors", () => {
      expect(isEngineError(new Error("test"))).toBe(false);
      expect(isEngineError("string error")).toBe(false);
      expect(isEngineError(null)).toBe(false);
    });
  });

  describe("isErrorOfType", () => {
    it("should return true for matching error types", () => {
      const error = new CardNotFoundError("card123");
      expect(isErrorOfType(error, "CARD_NOT_FOUND")).toBe(true);
    });

    it("should return false for non-matching error types", () => {
      const error = new CardNotFoundError("card123");
      expect(isErrorOfType(error, "PLAYER_VALIDATION")).toBe(false);
    });

    it("should return false for non-EngineErrors", () => {
      expect(isErrorOfType(new Error("test"), "CARD_NOT_FOUND")).toBe(false);
    });
  });

  describe("getErrorContext", () => {
    it("should extract context from EngineErrors", () => {
      const error = new PlayerValidationError("player1", "not active player");
      const context = getErrorContext(error);

      expect(context.type).toBe("PLAYER_VALIDATION");
      expect(context.category).toBe("validation");
      expect(context.message).toContain("player1");
    });

    it("should extract context from regular Errors", () => {
      const error = new Error("test error");
      const context = getErrorContext(error);

      expect(context.name).toBe("Error");
      expect(context.message).toBe("test error");
      expect(context.stack).toBeDefined();
    });

    it("should handle non-Error objects", () => {
      const context = getErrorContext("string error");
      expect(context.value).toBe("string error");
    });

    it("should handle nested errors with causes", () => {
      const cause = new Error("cause error");
      const error = new MoveExecutionError("PLAY_CARD", "player1", cause);

      const context = getErrorContext(error);
      expect(context.cause).toBeDefined();
      expect(context.cause?.message).toBe("cause error");
    });
  });

  describe("Result handling", () => {
    it("should create success results", () => {
      const result = createSuccessResult("data");
      expect(result.success).toBe(true);
      expect(result.data).toBe("data");
    });

    it("should create error results", () => {
      const error = new CardNotFoundError("card123");
      const result = createErrorResult(error, "findCard");

      expect(result.success).toBe(false);
      expect(result.error.type).toBe("CARD_NOT_FOUND");
      expect(result.error.message).toContain("card123");
      expect(result.error.details.operation).toBe("findCard");
    });

    it("should execute operations and return success results", () => {
      const result = executeOperation("test", () => "success");
      expect(result.success).toBe(true);
      expect(result.data).toBe("success");
    });

    it("should execute operations and return error results", () => {
      const result = executeOperation("test", () => {
        throw new CardNotFoundError("card123");
      });

      expect(result.success).toBe(false);
      expect(result.error.type).toBe("CARD_NOT_FOUND");
    });

    it("should execute async operations and return success results", async () => {
      const result = await executeOperationAsync("test", async () => "success");
      expect(result.success).toBe(true);
      expect(result.data).toBe("success");
    });

    it("should execute async operations and return error results", async () => {
      const result = await executeOperationAsync("test", async () => {
        throw new CardNotFoundError("card123");
      });

      expect(result.success).toBe(false);
      expect(result.error.type).toBe("CARD_NOT_FOUND");
    });
  });
});
