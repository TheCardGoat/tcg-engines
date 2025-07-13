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

import type { PlayerState } from "../state/context";

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
  zone?: string;
  owner?: string;
  publicId?: string;
  instanceId?: string;
}

// biome-ignore lint/complexity/noBannedTypes: this is not an actual type, it's a placeholder
export type BaseGameState = {};

// Generic type constraints for type-safe extensions
export type GameSpecificPlayerState = BasePlayerState;
export type GameSpecificCardFilter = BaseCoreCardFilter;
export type GameSpecificGameState = BaseGameState;
export type GameSpecificCardDefinition = CoreCardDefinition;

// Utility types for game developers
export type ExtendPlayerState<State, TurnHistory> = PlayerState<
  State,
  TurnHistory
>;
export type ExtendCardFilter<T> = BaseCoreCardFilter & T;
export type ExtendGameState<T> = BaseGameState & T;
export type ExtendCardDefinition<T> = CoreCardDefinition & T;

/**
 * Type helper to ensure game-specific types meet the required constraints
 */
export type ValidateGameTypes<
  GameState extends GameSpecificGameState,
  CardDefinition extends GameSpecificCardDefinition,
  PlayerState extends GameSpecificPlayerState,
  CardFilter extends GameSpecificCardFilter,
> = {
  gameState: GameState;
  cardDefinition: CardDefinition;
  playerState: PlayerState;
  cardFilter: CardFilter;
};

/**
 * Default implementations
 */
export type DefaultPlayerState = BasePlayerState;
export type DefaultCardFilter = BaseCoreCardFilter;
export type DefaultGameState = BaseGameState;
export type DefaultCardDefinition = CoreCardDefinition;
