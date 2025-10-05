/**
 * # Game-Specific Type System
 *
 * This module defines the generic type system that allows games to extend
 * CoreEngine with their own specific types while maintaining type safety.
 *
 * ## Architecture
 * - Base types define the minimum required interface
 * - Game-specific types extend these bases with additional properties
 * - Generic constraints ensure type safety across the engine
 */

// CoreCardDefinition interface moved to core-card-instance-store.ts
interface CoreCardDefinition {
  id: string;
}

// Base types that all games must implement
export interface BasePlayerState {
  id: string;
  name: string;
}

/**
 * Serializable numeric comparison for attribute filtering
 * This is the NEW format for rich filtering with explicit operators
 */
export type NumericComparison = {
  readonly operator: "eq" | "gt" | "gte" | "lt" | "lte";
  readonly value: number;
};

/**
 * Legacy numeric range format for backward compatibility
 * Used by existing Lorcana and One-Piece implementations
 */
export type NumericRange = {
  readonly min?: number;
  readonly max?: number;
  readonly exact?: number;
};

/**
 * Serializable string comparison for name/text filtering
 */
export type StringComparison = {
  readonly operator: "eq" | "includes" | "startsWith" | "endsWith";
  readonly value: string | readonly string[];
  readonly caseInsensitive?: boolean;
};

/**
 * Enhanced base card filter with rich filtering capabilities.
 * All properties are optional, readonly, and serializable to JSON.
 *
 * This interface provides the foundation for type-safe, immutable,
 * and serializable card filtering across all TCG implementations.
 *
 * NOTE: cost and strength accept BOTH NumericComparison (new format)
 * and NumericRange (legacy format) for backward compatibility.
 */
export interface BaseCoreCardFilter {
  // Basic identification filters
  readonly zone?: string | readonly string[];
  readonly owner?: string;
  readonly publicId?: string;
  readonly instanceId?: string;
  readonly type?: string | readonly string[];

  // Status filters (boolean flags)
  readonly ready?: boolean;
  readonly exerted?: boolean;
  readonly damaged?: boolean;

  // Attribute comparison filters (serializable)
  // Accept both new (NumericComparison) and legacy (NumericRange) formats
  readonly cost?: NumericComparison | NumericRange;
  readonly strength?: NumericComparison | NumericRange;
  readonly name?: StringComparison;

  // Keyword/Ability filters
  readonly withKeyword?: string | readonly string[];
  readonly withoutKeyword?: string | readonly string[];

  // Characteristics filters with AND/OR logic
  readonly withCharacteristics?: readonly string[];
  readonly characteristicsMode?: "all" | "any";

  // Quantity and selection modifiers
  readonly count?: number | "all";
  readonly upTo?: boolean;
  readonly random?: boolean;
  readonly excludeSelf?: boolean;

  // Extensibility for game-specific filters
  readonly custom?: Readonly<Record<string, any>>;
}

// biome-ignore lint/complexity/noBannedTypes: this is not an actual type, it's a placeholder
export type BaseGameState = {};

/**
 * Base card metadata type that all games can extend
 * This stores dynamic, mutable properties of card instances
 */
export type BaseCardMeta = Record<string, any>;

// Generic type constraints for type-safe extensions
export type GameSpecificPlayerState = BasePlayerState;
export type GameSpecificCardFilter = BaseCoreCardFilter;
export type GameSpecificGameState = BaseGameState;
export type GameSpecificCardDefinition = CoreCardDefinition;
export type GameSpecificCardMeta = BaseCardMeta;

// Utility types for game developers
export type ExtendPlayerState<T> = BasePlayerState & T;
export type ExtendCardFilter<T> = BaseCoreCardFilter & T;
export type ExtendGameState<T> = BaseGameState & T;
export type ExtendCardDefinition<T> = CoreCardDefinition & T;
export type ExtendCardMeta<T> = BaseCardMeta & T;

/**
 * Type helper to ensure game-specific types meet the required constraints
 */
export type ValidateGameTypes<
  GameState extends GameSpecificGameState,
  CardDefinition extends GameSpecificCardDefinition,
  PlayerState extends GameSpecificPlayerState,
  CardFilter extends GameSpecificCardFilter,
  CardMeta extends GameSpecificCardMeta = BaseCardMeta,
> = {
  gameState: GameState;
  cardDefinition: CardDefinition;
  playerState: PlayerState;
  cardFilter: CardFilter;
  cardMeta: CardMeta;
};

/**
 * Default implementations
 */
export type DefaultPlayerState = BasePlayerState;
export type DefaultCardFilter = BaseCoreCardFilter;
export type DefaultGameState = BaseGameState;
export type DefaultCardDefinition = CoreCardDefinition;
export type DefaultCardMeta = BaseCardMeta;
