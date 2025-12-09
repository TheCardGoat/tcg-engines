/**
 * Domain-specific error types for each core entity
 */
import { EngineError } from "./engine-errors";
// ========== CARD ERRORS ==========
export class CardError extends EngineError {
    category = "validation";
}
export class CardNotFoundError extends CardError {
    cardId;
    type = "CARD_NOT_FOUND";
    constructor(cardId) {
        super(`Card not found: ${cardId}`);
        this.cardId = cardId;
    }
}
export class CardEnrichmentError extends CardError {
    cardId;
    cause;
    type = "CARD_ENRICHMENT";
    constructor(cardId, cause) {
        super(`Failed to enrich card ${cardId}: ${cause.message}`);
        this.cardId = cardId;
        this.cause = cause;
        this.cause = cause;
    }
}
export class InvalidCardStateError extends CardError {
    cardId;
    property;
    expectedValue;
    actualValue;
    type = "INVALID_CARD_STATE";
    constructor(cardId, property, expectedValue, actualValue) {
        super(`Invalid card state for ${cardId}.${property}: expected ${expectedValue}, got ${actualValue}`);
        this.cardId = cardId;
        this.property = property;
        this.expectedValue = expectedValue;
        this.actualValue = actualValue;
    }
}
// ========== ZONE ERRORS ==========
export class ZoneError extends EngineError {
    category = "validation";
}
export class ZoneNotFoundError extends ZoneError {
    zoneId;
    type = "ZONE_NOT_FOUND";
    constructor(zoneId) {
        super(`Zone not found: ${zoneId}`);
        this.zoneId = zoneId;
    }
}
export class CardNotInZoneError extends ZoneError {
    cardId;
    zoneId;
    type = "CARD_NOT_IN_ZONE";
    constructor(cardId, zoneId) {
        super(`Card ${cardId} not found in zone ${zoneId}`);
        this.cardId = cardId;
        this.zoneId = zoneId;
    }
}
export class ZoneSizeLimitError extends ZoneError {
    zoneId;
    currentSize;
    maxSize;
    type = "ZONE_SIZE_LIMIT";
    constructor(zoneId, currentSize, maxSize) {
        super(`Zone ${zoneId} is at capacity: ${currentSize}/${maxSize}`);
        this.zoneId = zoneId;
        this.currentSize = currentSize;
        this.maxSize = maxSize;
    }
}
export class InvalidZoneIdError extends ZoneError {
    zoneId;
    reason;
    type = "INVALID_ZONE_ID";
    constructor(zoneId, reason) {
        super(`Invalid zone ID ${zoneId}: ${reason}`);
        this.zoneId = zoneId;
        this.reason = reason;
    }
}
export class ZoneMoveValidationError extends ZoneError {
    cardId;
    fromZone;
    toZone;
    reason;
    type = "ZONE_MOVE_VALIDATION";
    constructor(cardId, fromZone, toZone, reason) {
        super(`Cannot move card ${cardId} from ${fromZone} to ${toZone}: ${reason}`);
        this.cardId = cardId;
        this.fromZone = fromZone;
        this.toZone = toZone;
        this.reason = reason;
    }
}
// ========== MODIFIER ERRORS ==========
export class ModifierError extends EngineError {
    category = "execution";
}
export class ModifierCreationError extends ModifierError {
    reason;
    params;
    type = "MODIFIER_CREATION";
    constructor(reason, params) {
        super(`Failed to create modifier: ${reason}`);
        this.reason = reason;
        this.params = params;
    }
}
export class ModifierApplicationError extends ModifierError {
    modifierId;
    targetId;
    cause;
    type = "MODIFIER_APPLICATION";
    constructor(modifierId, targetId, cause) {
        super(`Failed to apply modifier ${modifierId} to ${targetId}: ${cause.message}`);
        this.modifierId = modifierId;
        this.targetId = targetId;
        this.cause = cause;
        this.cause = cause;
    }
}
export class ModifierNotFoundError extends ModifierError {
    modifierId;
    type = "MODIFIER_NOT_FOUND";
    constructor(modifierId) {
        super(`Modifier not found: ${modifierId}`);
        this.modifierId = modifierId;
    }
}
export class ModifierCleanupError extends ModifierError {
    modifierId;
    reason;
    type = "MODIFIER_CLEANUP";
    constructor(modifierId, reason) {
        super(`Failed to cleanup modifier ${modifierId}: ${reason}`);
        this.modifierId = modifierId;
        this.reason = reason;
    }
}
export class LayerProcessingError extends ModifierError {
    layer;
    modifierCount;
    cause;
    type = "LAYER_PROCESSING";
    constructor(layer, modifierCount, cause) {
        super(`Failed to process layer ${layer} with ${modifierCount} modifiers: ${cause.message}`);
        this.layer = layer;
        this.modifierCount = modifierCount;
        this.cause = cause;
        this.cause = cause;
    }
}
// ========== CONTEXT ERRORS ==========
export class ContextError extends EngineError {
    category = "state";
}
export class ContextValidationError extends ContextError {
    property;
    reason;
    type = "CONTEXT_VALIDATION";
    constructor(property, reason) {
        super(`Context validation failed for ${property}: ${reason}`);
        this.property = property;
        this.reason = reason;
    }
}
export class ContextUpdateError extends ContextError {
    updateType;
    cause;
    type = "CONTEXT_UPDATE";
    constructor(updateType, cause) {
        super(`Failed to update context during ${updateType}: ${cause.message}`);
        this.updateType = updateType;
        this.cause = cause;
        this.cause = cause;
    }
}
export class PlayerPositionError extends ContextError {
    position;
    maxPosition;
    positionType;
    type = "PLAYER_POSITION";
    constructor(position, maxPosition, positionType) {
        super(`Invalid player position for ${positionType}: ${position} (max: ${maxPosition})`);
        this.position = position;
        this.maxPosition = maxPosition;
        this.positionType = positionType;
    }
}
// ========== SERIALIZATION ERRORS ==========
export class SerializationError extends EngineError {
    category = "system";
}
export class SerializationFailedError extends SerializationError {
    dataType;
    cause;
    type = "SERIALIZATION_FAILED";
    constructor(dataType, cause) {
        super(`Failed to serialize ${dataType}: ${cause.message}`);
        this.dataType = dataType;
        this.cause = cause;
        this.cause = cause;
    }
}
export class DeserializationFailedError extends SerializationError {
    dataType;
    cause;
    type = "DESERIALIZATION_FAILED";
    constructor(dataType, cause) {
        super(`Failed to deserialize ${dataType}: ${cause.message}`);
        this.dataType = dataType;
        this.cause = cause;
        this.cause = cause;
    }
}
export class SchemaValidationError extends SerializationError {
    schemaName;
    validationErrors;
    type = "SCHEMA_VALIDATION";
    constructor(schemaName, validationErrors) {
        super(`Schema validation failed for ${schemaName}: ${validationErrors.join(", ")}`);
        this.schemaName = schemaName;
        this.validationErrors = validationErrors;
    }
}
//# sourceMappingURL=domain-errors.js.map