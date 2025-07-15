import { describe, expect, it } from "../../__tests__/test-utils";

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
import {
  FlowTemplates,
  NotFoundTemplates,
  PermissionTemplates,
  SerializationTemplates,
  StateTemplates,
  SystemTemplates,
  ValidationTemplates,
} from "../error-templates";

describe("Error Templates", () => {
  describe("ValidationTemplates", () => {
    it("should format property validation messages correctly", () => {
      const message = ValidationTemplates.property(
        "card",
        "card-123",
        "health",
        "> 0",
        "-1",
      );
      expect(message).toBe(
        "card validation failed: expected 'health' to be > 0, got -1",
      );
    });

    it("should format entity validation messages correctly", () => {
      const message = ValidationTemplates.entity(
        "card",
        "card-123",
        "must be in play zone",
      );
      expect(message).toBe(
        "card 'card-123' validation failed: must be in play zone",
      );
    });

    it("should format move validation messages correctly", () => {
      const message = ValidationTemplates.move(
        "play-card",
        "not enough resources",
      );
      expect(message).toBe(
        "move 'play-card' validation failed: not enough resources",
      );
    });
  });

  describe("NotFoundTemplates", () => {
    it("should format entity not found messages correctly", () => {
      const message = NotFoundTemplates.entity("card", "card-123");
      expect(message).toBe("card 'card-123' not found");
    });

    it("should format entity in container not found messages correctly", () => {
      const message = NotFoundTemplates.entityInContainer(
        "card",
        "card-123",
        "zone",
        "hand-p1",
      );
      expect(message).toBe("card 'card-123' not found in zone 'hand-p1'");
    });
  });

  describe("PermissionTemplates", () => {
    it("should format permission denied messages correctly", () => {
      const message = PermissionTemplates.denied(
        "p1",
        "draw card",
        "not their turn",
      );
      expect(message).toBe("player 'p1' cannot 'draw card': not their turn");
    });

    it("should format entity access messages correctly", () => {
      const message = PermissionTemplates.entityAccess(
        "p1",
        "modify",
        "card",
        "card-123",
        "owned by 'p2'",
      );
      expect(message).toBe(
        "player 'p1' cannot modify card 'card-123': owned by 'p2'",
      );
    });
  });

  describe("StateTemplates", () => {
    it("should format state update messages correctly", () => {
      const message = StateTemplates.update(
        "game",
        "transition",
        "invalid state",
      );
      expect(message).toBe(
        "failed to update 'game' state during 'transition': invalid state",
      );
    });

    it("should format state transition messages correctly", () => {
      const message = StateTemplates.transition(
        "game",
        "setup",
        "active",
        "missing required data",
      );
      expect(message).toBe(
        "invalid 'game' state transition from 'setup' to 'active': missing required data",
      );
    });
  });

  describe("FlowTemplates", () => {
    it("should format flow operation messages correctly", () => {
      const message = FlowTemplates.operation(
        "transition",
        "SETUP",
        "invalid event",
      );
      expect(message).toBe(
        "flow 'transition' failed in state 'SETUP': invalid event",
      );
    });
  });

  describe("SystemTemplates", () => {
    it("should format system failure messages correctly", () => {
      const message = SystemTemplates.failure(
        "engine",
        "initialization",
        "configuration invalid",
      );
      expect(message).toBe(
        "system failure in 'engine' during 'initialization': configuration invalid",
      );
    });
  });

  describe("SerializationTemplates", () => {
    it("should format serialization operation messages correctly", () => {
      const message = SerializationTemplates.operation(
        "serialize",
        "game-state",
        "circular reference detected",
      );
      expect(message).toBe(
        "failed to 'serialize' 'game-state': circular reference detected",
      );
    });
  });
});

describe("Consolidated Error Classes with Templates", () => {
  describe("ValidationFailedError", () => {
    it("should use ValidationTemplates.property for errors with actual value", () => {
      const error = new ValidationFailedError(
        "card",
        "card-123",
        "health",
        "> 0",
        "-1",
      );
      expect(error.message).toBe(
        "card validation failed: expected 'health' to be > 0, got -1",
      );
    });

    it("should use ValidationTemplates.entity for errors without actual value", () => {
      const error = new ValidationFailedError(
        "card",
        "card-123",
        "zone",
        "must be in play",
      );
      expect(error.message).toBe(
        "card 'card-123' validation failed: zone: must be in play",
      );
    });
  });

  describe("EntityNotFoundError", () => {
    it("should use NotFoundTemplates.entity for error messages", () => {
      const error = new EntityNotFoundError("card", "card-123");
      expect(error.message).toBe("card 'card-123' not found");
    });
  });

  describe("StateUpdateFailedError", () => {
    it("should use StateTemplates.update for error messages", () => {
      const cause = new Error("invalid state");
      const error = new StateUpdateFailedError("game", "transition", cause);
      expect(error.message).toBe(
        "failed to update 'game' state during 'transition': invalid state",
      );
    });
  });

  describe("MoveValidationFailedError", () => {
    it("should use ValidationTemplates.move for error messages", () => {
      const error = new MoveValidationFailedError(
        "play-card",
        "not enough resources",
      );
      expect(error.message).toBe(
        "move 'play-card' validation failed: not enough resources",
      );
    });
  });

  describe("PermissionDeniedError", () => {
    it("should use PermissionTemplates.denied for error messages", () => {
      const error = new PermissionDeniedError(
        "p1",
        "draw card",
        "not their turn",
      );
      expect(error.message).toBe(
        "player 'p1' cannot 'draw card': not their turn",
      );
    });
  });

  describe("SystemFailureError", () => {
    it("should use SystemTemplates.failure for error messages with string cause", () => {
      const error = new SystemFailureError(
        "engine",
        "initialization",
        "configuration invalid",
      );
      expect(error.message).toBe(
        "system failure in 'engine' during 'initialization': configuration invalid",
      );
    });

    it("should use SystemTemplates.failure for error messages with Error cause", () => {
      const cause = new Error("configuration invalid");
      const error = new SystemFailureError("engine", "initialization", cause);
      expect(error.message).toBe(
        "system failure in 'engine' during 'initialization': configuration invalid",
      );
    });
  });

  describe("FlowFailedError", () => {
    it("should use FlowTemplates.operation for error messages", () => {
      const error = new FlowFailedError("transition", "SETUP", "invalid event");
      expect(error.message).toBe(
        "flow 'transition' failed in state 'SETUP': invalid event",
      );
    });
  });

  describe("SerializationFailedError", () => {
    it("should use SerializationTemplates.operation for error messages", () => {
      const error = new SerializationFailedError(
        "serialize",
        "game-state",
        "circular reference detected",
      );
      expect(error.message).toBe(
        "failed to 'serialize' 'game-state': circular reference detected",
      );
    });
  });
});
