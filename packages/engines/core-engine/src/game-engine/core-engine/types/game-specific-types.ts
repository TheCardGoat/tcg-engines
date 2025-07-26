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

export interface BaseCoreCardFilter {
  zone?: string | string[];
  owner?: string;
  publicId?: string;
  instanceId?: string;
  type?: string | string[];
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
