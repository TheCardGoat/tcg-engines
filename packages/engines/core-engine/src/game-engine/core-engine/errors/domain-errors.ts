/**
 * Domain-specific error types for each core entity
 */

import { EngineError } from "./engine-errors";

// ========== CARD ERRORS ==========

export abstract class CardError extends EngineError {
  readonly category = "validation" as const;
}

export class CardNotFoundError extends CardError {
  readonly type = "CARD_NOT_FOUND" as const;

  constructor(public readonly cardId: string) {
    super(`Card not found: ${cardId}`);
  }
}

export class CardEnrichmentError extends CardError {
  readonly type = "CARD_ENRICHMENT" as const;

  constructor(
    public readonly cardId: string,
    public readonly cause: Error,
  ) {
    super(`Failed to enrich card ${cardId}: ${cause.message}`);
    this.cause = cause;
  }
}

export class InvalidCardStateError extends CardError {
  readonly type = "INVALID_CARD_STATE" as const;

  constructor(
    public readonly cardId: string,
    public readonly property: string,
    public readonly expectedValue: unknown,
    public readonly actualValue: unknown,
  ) {
    super(
      `Invalid card state for ${cardId}.${property}: expected ${expectedValue}, got ${actualValue}`,
    );
  }
}

// ========== ZONE ERRORS ==========

export abstract class ZoneError extends EngineError {
  readonly category = "validation" as const;
}

export class ZoneNotFoundError extends ZoneError {
  readonly type = "ZONE_NOT_FOUND" as const;

  constructor(public readonly zoneId: string) {
    super(`Zone not found: ${zoneId}`);
  }
}

export class CardNotInZoneError extends ZoneError {
  readonly type = "CARD_NOT_IN_ZONE" as const;

  constructor(
    public readonly cardId: string,
    public readonly zoneId: string,
  ) {
    super(`Card ${cardId} not found in zone ${zoneId}`);
  }
}

export class ZoneSizeLimitError extends ZoneError {
  readonly type = "ZONE_SIZE_LIMIT" as const;

  constructor(
    public readonly zoneId: string,
    public readonly currentSize: number,
    public readonly maxSize: number,
  ) {
    super(`Zone ${zoneId} is at capacity: ${currentSize}/${maxSize}`);
  }
}

export class InvalidZoneIdError extends ZoneError {
  readonly type = "INVALID_ZONE_ID" as const;

  constructor(
    public readonly zoneId: string,
    public readonly reason: string,
  ) {
    super(`Invalid zone ID ${zoneId}: ${reason}`);
  }
}

export class ZoneMoveValidationError extends ZoneError {
  readonly type = "ZONE_MOVE_VALIDATION" as const;

  constructor(
    public readonly cardId: string,
    public readonly fromZone: string,
    public readonly toZone: string,
    public readonly reason: string,
  ) {
    super(
      `Cannot move card ${cardId} from ${fromZone} to ${toZone}: ${reason}`,
    );
  }
}

// ========== MODIFIER ERRORS ==========

/**
 * @internal
 * Base class for modifier-related errors
 * Reserved for future implementation of the modifier system
 */
export abstract class ModifierError extends EngineError {
  readonly category = "execution" as const;
}

/**
 * @internal
 * Reserved for future implementation of the modifier system
 */
export class ModifierCreationError extends ModifierError {
  readonly type = "MODIFIER_CREATION" as const;

  constructor(
    public readonly reason: string,
    public readonly params?: Record<string, unknown>,
  ) {
    super(`Failed to create modifier: ${reason}`);
  }
}

/**
 * @internal
 * Reserved for future implementation of the modifier system
 */
export class ModifierApplicationError extends ModifierError {
  readonly type = "MODIFIER_APPLICATION" as const;

  constructor(
    public readonly modifierId: string,
    public readonly targetId: string,
    public readonly cause: Error,
  ) {
    super(
      `Failed to apply modifier ${modifierId} to ${targetId}: ${cause.message}`,
    );
    this.cause = cause;
  }
}

/**
 * @internal
 * Reserved for future implementation of the modifier system
 */
export class ModifierNotFoundError extends ModifierError {
  readonly type = "MODIFIER_NOT_FOUND" as const;

  constructor(public readonly modifierId: string) {
    super(`Modifier not found: ${modifierId}`);
  }
}

/**
 * @internal
 * Reserved for future implementation of the modifier system
 */
export class ModifierCleanupError extends ModifierError {
  readonly type = "MODIFIER_CLEANUP" as const;

  constructor(
    public readonly modifierId: string,
    public readonly reason: string,
  ) {
    super(`Failed to cleanup modifier ${modifierId}: ${reason}`);
  }
}

/**
 * @internal
 * Reserved for future implementation of the modifier system
 */
export class LayerProcessingError extends ModifierError {
  readonly type = "LAYER_PROCESSING" as const;

  constructor(
    public readonly layer: string,
    public readonly modifierCount: number,
    public readonly cause: Error,
  ) {
    super(
      `Failed to process layer ${layer} with ${modifierCount} modifiers: ${cause.message}`,
    );
    this.cause = cause;
  }
}

// ========== CONTEXT ERRORS ==========

export abstract class ContextError extends EngineError {
  readonly category = "state" as const;
}

export class ContextValidationError extends ContextError {
  readonly type = "CONTEXT_VALIDATION" as const;

  constructor(
    public readonly property: string,
    public readonly reason: string,
  ) {
    super(`Context validation failed for ${property}: ${reason}`);
  }
}

export class ContextUpdateError extends ContextError {
  readonly type = "CONTEXT_UPDATE" as const;

  constructor(
    public readonly updateType: string,
    public readonly cause: Error,
  ) {
    super(`Failed to update context during ${updateType}: ${cause.message}`);
    this.cause = cause;
  }
}

export class PlayerPositionError extends ContextError {
  readonly type = "PLAYER_POSITION" as const;

  constructor(
    public readonly position: number,
    public readonly maxPosition: number,
    public readonly positionType: "turn" | "priority",
  ) {
    super(
      `Invalid player position for ${positionType}: ${position} (max: ${maxPosition})`,
    );
  }
}

// ========== SERIALIZATION ERRORS ==========

/**
 * @internal
 * Base class for serialization-related errors
 * Reserved for future implementation of serialization features
 */
export abstract class SerializationError extends EngineError {
  readonly category = "system" as const;
}

/**
 * @internal
 * Reserved for future implementation of serialization features
 */
export class SerializationFailedError extends SerializationError {
  readonly type = "SERIALIZATION_FAILED" as const;

  constructor(
    public readonly dataType: string,
    public readonly cause: Error,
  ) {
    super(`Failed to serialize ${dataType}: ${cause.message}`);
    this.cause = cause;
  }
}

/**
 * @internal
 * Reserved for future implementation of serialization features
 */
export class DeserializationFailedError extends SerializationError {
  readonly type = "DESERIALIZATION_FAILED" as const;

  constructor(
    public readonly dataType: string,
    public readonly cause: Error,
  ) {
    super(`Failed to deserialize ${dataType}: ${cause.message}`);
    this.cause = cause;
  }
}

/**
 * @internal
 * Reserved for future implementation of serialization features
 */
export class SchemaValidationError extends SerializationError {
  readonly type = "SCHEMA_VALIDATION" as const;

  constructor(
    public readonly schemaName: string,
    public readonly validationErrors: readonly string[],
  ) {
    super(
      `Schema validation failed for ${schemaName}: ${validationErrors.join(", ")}`,
    );
  }
}

// ========== COMPLETE ERROR TYPE UNION ==========

/**
 * Type union of all domain-specific errors
 * Note: @internal error types are excluded from this union
 */
export type AnyDomainError =
  | CardNotFoundError
  | CardEnrichmentError
  | InvalidCardStateError
  | ZoneNotFoundError
  | CardNotInZoneError
  | ZoneSizeLimitError
  | InvalidZoneIdError
  | ZoneMoveValidationError
  | ContextValidationError
  | ContextUpdateError
  | PlayerPositionError;
// ModifierError classes excluded as they're marked @internal
// SerializationError classes excluded as they're marked @internal

/**
 * Complete union of all engine errors
 */
export type AllEngineErrors = AnyDomainError;
