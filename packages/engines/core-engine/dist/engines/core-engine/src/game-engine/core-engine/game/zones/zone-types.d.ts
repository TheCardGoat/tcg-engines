/**
 * Zone types and interfaces for multi-zone game state management
 */
/**
 * Zone visibility and access type
 */
export type ZoneType = "secret" | "private" | "public" | "shared";
/**
 * Zone rules for card management
 */
export interface ZoneRules<T = any> {
    canAdd?: (card: T, zone: Zone<T>) => boolean;
    canRemove?: (card: T, zone: Zone<T>) => boolean;
    onAdd?: (card: T, zone: Zone<T>) => void;
    onRemove?: (card: T, zone: Zone<T>) => void;
}
/**
 * Zone interface for managing cards in different game areas
 */
export interface Zone<T = any> {
    id: string;
    name: string;
    type: ZoneType;
    owner?: string;
    cards: T[];
    maxSize?: number;
    rules?: ZoneRules<T>;
}
/**
 * Zone configuration for game setup
 */
export interface ZoneConfiguration {
    zones: {
        [zoneId: string]: {
            type: ZoneType;
            perPlayer: boolean;
            maxSize?: number;
            rules?: ZoneRules;
        };
    };
}
/**
 * Card location reference
 */
export interface CardLocation {
    zoneId: string;
    index: number;
    owner?: string;
}
/**
 * Zone state snapshot for game state
 */
export interface ZoneState<T = any> {
    [zoneId: string]: Zone<T>;
}
/**
 * Move card operation result
 */
export interface MoveCardResult {
    success: boolean;
    fromZone?: string;
    toZone?: string;
    cardId?: string;
    error?: string;
}
/**
 * Zone query options
 */
export interface ZoneQuery {
    type?: ZoneType;
    owner?: string;
    hasCards?: boolean;
    minCards?: number;
    maxCards?: number;
}
/**
 * Zone statistics
 */
export interface ZoneStats {
    zoneId: string;
    cardCount: number;
    isFull: boolean;
    isEmpty: boolean;
    percentFull?: number;
}
//# sourceMappingURL=zone-types.d.ts.map