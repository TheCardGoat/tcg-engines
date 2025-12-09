/**
 * # Lorcana TCG Generic Type Definitions
 *
 * This module defines the game-specific types for Lorcana TCG that extend
 * the CoreEngine's generic type system with Lorcana-specific properties.
 */
import type { LorcanitoCard } from "@lorcanito/lorcana-engine";
import type { ExtendCardDefinition, ExtendCardFilter, ExtendGameState, ExtendPlayerState } from "~/game-engine/core-engine/types/game-specific-types";
/**
 * Lorcana-specific player state extending the base player state
 */
export type LorcanaPlayerState = ExtendPlayerState<{
    lore: number;
    ink: number;
    questProgress: Record<string, number>;
    turnHistory?: PlayerTurnHistory[];
}>;
export interface PlayerTurnHistory {
    turnNumber: number;
    playedCards: string[];
    inkwell: string[];
    challenged: string[];
    quested: string[];
}
/**
 * Lorcana-specific game state extending the base game state
 */
export type LorcanaGameState = ExtendGameState<{
    effects: LayerItem[];
    bag: LayerItem[];
}>;
/**
 * Lorcana-specific card definition extending the base card definition
 */
export type LorcanaCardDefinition = ExtendCardDefinition<LorcanitoCard & {
    inkwell?: boolean;
    name: string;
}>;
/**
 * Lorcana-specific card filter extending the base card filter
 */
export type LorcanaCardFilter = ExtendCardFilter<{
    cost?: {
        min?: number;
        max?: number;
        exact?: number;
    };
    ink?: string[];
    inkable?: boolean;
    strength?: {
        min?: number;
        max?: number;
        exact?: number;
    };
    willpower?: {
        min?: number;
        max?: number;
        exact?: number;
    };
    lore?: {
        min?: number;
        max?: number;
        exact?: number;
    };
    exerted?: boolean;
    damaged?: boolean;
    banished?: boolean;
    cardType?: "character" | "action" | "item" | "location";
    hasKeyword?: string[];
    abilities?: string[];
    canQuest?: boolean;
    canChallenge?: boolean;
    canSing?: boolean;
    canBePlayed?: boolean;
    moveCost?: {
        min?: number;
        max?: number;
        exact?: number;
    };
    canTarget?: string;
    attachedTo?: string;
    playedThisTurn?: boolean;
    questedThisTurn?: boolean;
    challengedThisTurn?: boolean;
    set?: string;
    rarity?: "common" | "uncommon" | "rare" | "super_rare" | "legendary" | "enchanted";
    nameContains?: string;
    textContains?: string;
}>;
export type Zone = "deck" | "hand" | "play" | "inkwell" | "discard" | "bag";
export type LayerItem = {
    id: string;
    sourceCardId: string;
    controllerId: string;
    ability: Ability;
    targets: Target[];
    timestamp: number;
    optional: boolean;
};
export type Ability = {
    id: string;
    type: "activated" | "triggered" | "static" | "keyword";
    text: string;
    cost?: AbilityCost;
    effect: Effect;
    timing?: TriggerTiming;
};
export type Duration = {
    type: "endOfTurn";
} | {
    type: "untilLeaves";
} | {
    type: "turns";
    count: number;
} | {
    type: "permanent";
};
export type AbilityCost = {
    exert?: boolean;
    ink?: number;
    banish?: boolean;
    discard?: number;
    damage?: number;
};
export type Effect = {
    type: string;
    parameters: Record<string, any>;
};
export type Target = {
    type: "card" | "player";
    id: string;
};
export type TriggerTiming = "onPlay" | "onQuest" | "onChallenge" | "onBanish" | "onDamage" | "onMove" | "startOfTurn" | "endOfTurn";
/**
 * Type validation helpers for runtime type checking
 */
export declare const isLorcanaCardFilter: (filter: any) => filter is LorcanaCardFilter;
export declare const isLorcanaPlayerState: (state: any) => state is LorcanaPlayerState;
//# sourceMappingURL=lorcana-generic-types.d.ts.map