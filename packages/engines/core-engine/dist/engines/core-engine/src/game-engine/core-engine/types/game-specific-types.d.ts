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
interface CoreCardDefinition {
    id: string;
}
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
export type BaseGameState = {};
export type GameSpecificPlayerState = BasePlayerState;
export type GameSpecificCardFilter = BaseCoreCardFilter;
export type GameSpecificGameState = BaseGameState;
export type GameSpecificCardDefinition = CoreCardDefinition;
export type ExtendPlayerState<T> = BasePlayerState & T;
export type ExtendCardFilter<T> = BaseCoreCardFilter & T;
export type ExtendGameState<T> = BaseGameState & T;
export type ExtendCardDefinition<T> = CoreCardDefinition & T;
/**
 * Type helper to ensure game-specific types meet the required constraints
 */
export type ValidateGameTypes<GameState extends GameSpecificGameState, CardDefinition extends GameSpecificCardDefinition, PlayerState extends GameSpecificPlayerState, CardFilter extends GameSpecificCardFilter> = {
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
export {};
//# sourceMappingURL=game-specific-types.d.ts.map