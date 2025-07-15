import { describe, expect, it } from "../../__tests__/test-utils";
import { isConsolidatedError, isErrorOfType } from "../../utils/error-utils";
import {
  EntityNotFoundError,
  FlowFailedError,
  MoveValidationFailedError,
  PermissionDeniedError,
  SerializationFailedError,
  StateUpdateFailedError,
  SystemFailureError,
  ValidationFailedError,
} from "../consolidated-errors";
import { EngineError } from "../engine-errors";

describe("New Consolidated Error Types", () => {
  describe("FlowFailedError", () => {
    it("should create a flow error with correct properties", () => {
      const error = new FlowFailedError(
        "transition",
        "IDLE -> ACTIVE",
        "Invalid transition path",
        { additionalContext: "test" },
      );

      expect(error).toBeInstanceOf(EngineError);
      expect(error.category).toBe("execution");
      expect(error.type).toBe("FLOW_FAILED");
      expect(error.operation).toBe("transition");
      expect(error.flowState).toBe("IDLE -> ACTIVE");
      expect(error.reason).toBe("Invalid transition path");
      expect(error.context).toEqual({ additionalContext: "test" });
      expect(error.message).toBe(
        "flow 'transition' failed in state 'IDLE -> ACTIVE': Invalid transition path",
      );
    });

    it("should be identified by type guards", () => {
      const error = new FlowFailedError(
        "event",
        "START_GAME",
        "Game already started",
      );

      expect(isConsolidatedError(error)).toBe(true);
      expect(isErrorOfType(error, "FLOW_FAILED")).toBe(true);
    });
  });

  describe("SerializationFailedError", () => {
    it("should create a serialization error with correct properties", () => {
      const cause = new Error("JSON parse error");
      const error = new SerializationFailedError(
        "deserialize",
        "game-state",
        "Invalid JSON format",
        cause,
      );

      expect(error).toBeInstanceOf(EngineError);
      expect(error.category).toBe("system");
      expect(error.type).toBe("SERIALIZATION_FAILED");
      expect(error.operation).toBe("deserialize");
      expect(error.dataType).toBe("game-state");
      expect(error.reason).toBe("Invalid JSON format");
      expect(error.cause).toBe(cause);
      expect(error.message).toBe(
        "failed to 'deserialize' 'game-state': Invalid JSON format",
      );
    });

    it("should be identified by type guards", () => {
      const error = new SerializationFailedError(
        "serialize",
        "game-state",
        "Failed to stringify",
      );

      expect(isConsolidatedError(error)).toBe(true);
      expect(isErrorOfType(error, "SERIALIZATION_FAILED")).toBe(true);
    });
  });

  describe("Error migration examples", () => {
    it("should migrate FlowTransitionError to FlowFailedError", () => {
      // Old approach would be:
      // throw new FlowTransitionError("Cannot transition from state", "IDLE", "ACTIVE", "Invalid transition path");

      // New approach:
      const error = new FlowFailedError(
        "transition",
        "IDLE -> ACTIVE",
        "Invalid transition path",
      );

      expect(error.message).toBe(
        "flow 'transition' failed in state 'IDLE -> ACTIVE': Invalid transition path",
      );
    });

    it("should migrate StateTransitionError to StateUpdateFailedError", () => {
      // Old approach would be:
      // throw new StateTransitionError("game", "setup", "active", new Error("Missing required configuration"));

      // New approach:
      const cause = new Error("Missing required configuration");
      const error = new StateUpdateFailedError(
        "game",
        "transition:setup->active",
        cause,
      );

      expect(error.message).toBe(
        "failed to update 'game' state during 'transition:setup->active': Missing required configuration",
      );
      expect(error.cause).toBe(cause);
    });

    it("should migrate CardNotInZoneError to ValidationFailedError", () => {
      // Old approach would be:
      // throw new CardNotInZoneError(cardId, zoneId, "Card not found in specified zone");

      // New approach:
      const cardId = "card-123";
      const zoneId = "zone-456";
      const error = new ValidationFailedError(
        "card",
        cardId,
        "zone",
        zoneId,
        "not in zone",
      );

      expect(error.message).toBe(
        "card validation failed: expected 'zone' to be zone-456, got not in zone",
      );
    });

    it("should migrate ModifierCreationError to StateUpdateFailedError", () => {
      // Old approach would be:
      // throw new ModifierCreationError(modifierId, "Failed to create modifier", originalError);

      // New approach:
      const modifierId = "modifier-123";
      const originalError = new Error("Invalid modifier data");
      const error = new StateUpdateFailedError(
        "card", // Using "card" instead of "modifier" to match allowed types
        "creation",
        new Error(
          `Failed to create modifier ${modifierId}: ${originalError.message}`,
        ),
      );

      expect(error.message).toBe(
        "failed to update 'card' state during 'creation': Failed to create modifier modifier-123: Invalid modifier data",
      );
    });
  });
});
