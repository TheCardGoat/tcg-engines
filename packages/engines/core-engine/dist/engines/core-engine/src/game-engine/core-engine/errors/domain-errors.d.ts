/**
 * Domain-specific error types for each core entity
 */
import { EngineError } from "./engine-errors";
export declare abstract class CardError extends EngineError {
    readonly category: "validation";
}
export declare class CardNotFoundError extends CardError {
    readonly cardId: string;
    readonly type: "CARD_NOT_FOUND";
    constructor(cardId: string);
}
export declare class CardEnrichmentError extends CardError {
    readonly cardId: string;
    readonly cause: Error;
    readonly type: "CARD_ENRICHMENT";
    constructor(cardId: string, cause: Error);
}
export declare class InvalidCardStateError extends CardError {
    readonly cardId: string;
    readonly property: string;
    readonly expectedValue: unknown;
    readonly actualValue: unknown;
    readonly type: "INVALID_CARD_STATE";
    constructor(cardId: string, property: string, expectedValue: unknown, actualValue: unknown);
}
export declare abstract class ZoneError extends EngineError {
    readonly category: "validation";
}
export declare class ZoneNotFoundError extends ZoneError {
    readonly zoneId: string;
    readonly type: "ZONE_NOT_FOUND";
    constructor(zoneId: string);
}
export declare class CardNotInZoneError extends ZoneError {
    readonly cardId: string;
    readonly zoneId: string;
    readonly type: "CARD_NOT_IN_ZONE";
    constructor(cardId: string, zoneId: string);
}
export declare class ZoneSizeLimitError extends ZoneError {
    readonly zoneId: string;
    readonly currentSize: number;
    readonly maxSize: number;
    readonly type: "ZONE_SIZE_LIMIT";
    constructor(zoneId: string, currentSize: number, maxSize: number);
}
export declare class InvalidZoneIdError extends ZoneError {
    readonly zoneId: string;
    readonly reason: string;
    readonly type: "INVALID_ZONE_ID";
    constructor(zoneId: string, reason: string);
}
export declare class ZoneMoveValidationError extends ZoneError {
    readonly cardId: string;
    readonly fromZone: string;
    readonly toZone: string;
    readonly reason: string;
    readonly type: "ZONE_MOVE_VALIDATION";
    constructor(cardId: string, fromZone: string, toZone: string, reason: string);
}
export declare abstract class ModifierError extends EngineError {
    readonly category: "execution";
}
export declare class ModifierCreationError extends ModifierError {
    readonly reason: string;
    readonly params?: Record<string, unknown>;
    readonly type: "MODIFIER_CREATION";
    constructor(reason: string, params?: Record<string, unknown>);
}
export declare class ModifierApplicationError extends ModifierError {
    readonly modifierId: string;
    readonly targetId: string;
    readonly cause: Error;
    readonly type: "MODIFIER_APPLICATION";
    constructor(modifierId: string, targetId: string, cause: Error);
}
export declare class ModifierNotFoundError extends ModifierError {
    readonly modifierId: string;
    readonly type: "MODIFIER_NOT_FOUND";
    constructor(modifierId: string);
}
export declare class ModifierCleanupError extends ModifierError {
    readonly modifierId: string;
    readonly reason: string;
    readonly type: "MODIFIER_CLEANUP";
    constructor(modifierId: string, reason: string);
}
export declare class LayerProcessingError extends ModifierError {
    readonly layer: string;
    readonly modifierCount: number;
    readonly cause: Error;
    readonly type: "LAYER_PROCESSING";
    constructor(layer: string, modifierCount: number, cause: Error);
}
export declare abstract class ContextError extends EngineError {
    readonly category: "state";
}
export declare class ContextValidationError extends ContextError {
    readonly property: string;
    readonly reason: string;
    readonly type: "CONTEXT_VALIDATION";
    constructor(property: string, reason: string);
}
export declare class ContextUpdateError extends ContextError {
    readonly updateType: string;
    readonly cause: Error;
    readonly type: "CONTEXT_UPDATE";
    constructor(updateType: string, cause: Error);
}
export declare class PlayerPositionError extends ContextError {
    readonly position: number;
    readonly maxPosition: number;
    readonly positionType: "turn" | "priority";
    readonly type: "PLAYER_POSITION";
    constructor(position: number, maxPosition: number, positionType: "turn" | "priority");
}
export declare abstract class SerializationError extends EngineError {
    readonly category: "system";
}
export declare class SerializationFailedError extends SerializationError {
    readonly dataType: string;
    readonly cause: Error;
    readonly type: "SERIALIZATION_FAILED";
    constructor(dataType: string, cause: Error);
}
export declare class DeserializationFailedError extends SerializationError {
    readonly dataType: string;
    readonly cause: Error;
    readonly type: "DESERIALIZATION_FAILED";
    constructor(dataType: string, cause: Error);
}
export declare class SchemaValidationError extends SerializationError {
    readonly schemaName: string;
    readonly validationErrors: readonly string[];
    readonly type: "SCHEMA_VALIDATION";
    constructor(schemaName: string, validationErrors: readonly string[]);
}
export type AnyDomainError = CardNotFoundError | CardEnrichmentError | InvalidCardStateError | ZoneNotFoundError | CardNotInZoneError | ZoneSizeLimitError | InvalidZoneIdError | ZoneMoveValidationError | ModifierCreationError | ModifierApplicationError | ModifierNotFoundError | ModifierCleanupError | LayerProcessingError | ContextValidationError | ContextUpdateError | PlayerPositionError | SerializationFailedError | DeserializationFailedError | SchemaValidationError;
/**
 * Complete union of all engine errors
 */
export type AllEngineErrors = AnyDomainError;
//# sourceMappingURL=domain-errors.d.ts.map