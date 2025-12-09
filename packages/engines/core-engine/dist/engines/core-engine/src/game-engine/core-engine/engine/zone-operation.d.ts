import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import type { PlayerID, CardInstanceID } from "~/game-engine/core-engine/types/core-types";
export type ZonePosition = "top" | "bottom" | number;
export type ZoneVisibility = "public" | "private" | "secret";
/**
 * Core zone configuration interface
 */
export interface ZoneConfig {
    id: string;
    name: string;
    description?: string;
    visibility: ZoneVisibility;
    ordered: boolean;
    sizeLimit?: number;
    ownerRestricted?: boolean;
    initialCards?: CardInstanceID[];
    metadata?: Record<string, unknown>;
}
export interface Zone {
    id: string;
    name: string;
    owner: PlayerID;
    cards: CardInstanceID[];
    visibility: ZoneVisibility;
    ordered?: boolean;
    sizeLimit?: number;
    ownerRestricted?: boolean;
    metadata?: Record<string, unknown>;
}
export interface ZoneMoveEvent {
    type: "ZONE_MOVE";
    cardID: CardInstanceID;
    fromZone: string;
    toZone: string;
    position?: ZonePosition;
    playerID?: PlayerID;
}
export interface ZoneShuffleEvent {
    type: "ZONE_SHUFFLE";
    zoneID: string;
    playerID?: PlayerID;
    seed?: string;
}
export interface ZoneSearchEvent {
    type: "ZONE_SEARCH";
    zoneID: string;
    playerID?: PlayerID;
    predicate: (cardID: CardInstanceID) => boolean;
    limit?: number;
}
export interface ZoneCountEvent {
    type: "ZONE_COUNT";
    zoneID: string;
    playerID?: PlayerID;
}
export interface ZonePeekEvent {
    type: "ZONE_PEEK";
    zoneID: string;
    count: number;
    playerID?: PlayerID;
}
/**
 * Union type for all zone events
 */
export type ZoneEvent = ZoneMoveEvent | ZoneShuffleEvent | ZoneSearchEvent | ZoneCountEvent | ZonePeekEvent;
/**
 * Error result for zone operations
 */
export interface ZoneOperationError {
    type: "ZONE_OPERATION_ERROR";
    reason: string;
    context?: Record<string, unknown>;
}
/**
 * Type guard to check if a result is a zone operation error
 */
export declare function isZoneOperationError(result: unknown): result is ZoneOperationError;
export declare function getCardZone(ctx: CoreCtx, zoneId: string, playerId?: string): Zone | undefined;
export declare function getCardZoneByInstanceId(ctx: CoreCtx, instanceId: string): Zone | undefined;
export declare function shuffleZone(ctx: CoreCtx, zoneId: string): CoreCtx<unknown>;
export declare function moveCardByInstanceId({ ctx, instanceId, playerId, to, from, destination, }: {
    ctx: CoreCtx;
    instanceId: string;
    playerId: string;
    to?: string;
    from?: string;
    origin?: "start" | "end";
    destination?: "start" | "end";
}): CoreCtx | ZoneOperationError;
export declare function move({ ctx, playerId, from, to, origin, destination, }: {
    ctx: CoreCtx;
    playerId: string;
    from?: string;
    to?: string;
    origin?: "start" | "end";
    destination?: "start" | "end";
}): CoreCtx;
//# sourceMappingURL=zone-operation.d.ts.map