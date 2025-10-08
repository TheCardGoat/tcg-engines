/**
 * Gundam Card Game Type Definitions
 *
 * This file defines all game-specific types that extend the @tcg/core framework types.
 * These types provide strong typing for game state, moves, cards, and other game entities.
 *
 * Key Type Categories:
 * 1. Game State - Extends core GameState with Gundam-specific properties
 * 2. Moves - All possible player actions in the game
 * 3. Cards - Card types and their properties
 * 4. Zones - Zone-specific data structures
 * 5. Game Entities - Pilots, Units, Bases, etc.
 *
 * @example State Extension
 * ```typescript
 * import type { GameState, PlayerId, CardId } from "@tcg/core";
 *
 * export type GundamGameState = GameState & {
 *   gundam: {
 *     // Shield cards for each player (max 6)
 *     shields: Record<PlayerId, CardId[]>;
 *
 *     // Base card in Shield Area (max 1 per player)
 *     bases: Record<PlayerId, CardId | null>;
 *
 *     // Battle Area positions (max 6 per player)
 *     battlePositions: Record<PlayerId, BattlePosition[]>;
 *
 *     // Active (untapped) resource count
 *     activeResources: Record<PlayerId, number>;
 *
 *     // Current attack sequence (if in attack)
 *     currentAttack: AttackSequence | null;
 *   };
 * };
 * ```
 *
 * @example Move Types
 * ```typescript
 * import type { Move } from "@tcg/core";
 *
 * export type PlayResourceMove = Move<{
 *   type: "PLAY_RESOURCE";
 *   playerId: PlayerId;
 * }>;
 *
 * export type DeployUnitMove = Move<{
 *   type: "DEPLOY_UNIT";
 *   playerId: PlayerId;
 *   cardId: CardId;
 *   position?: number;
 * }>;
 *
 * export type GundamMove =
 *   | PlayResourceMove
 *   | DeployUnitMove
 *   | PairPilotMove
 *   | AttackMove
 *   | ActivateAbilityMove;
 * ```
 *
 * @example Card Types
 * ```typescript
 * import type { Card } from "@tcg/core";
 *
 * export type UnitCard = Card & {
 *   cardType: "UNIT";
 *   level: number;
 *   cost: number;
 *   ap: number;
 *   hp: number;
 *   keywords: KeywordAbility[];
 *   linkConditions?: LinkCondition[];
 * };
 *
 * export type PilotCard = Card & {
 *   cardType: "PILOT";
 *   level: number;
 *   cost: number;
 *   apBonus?: number;
 *   hpBonus?: number;
 * };
 * ```
 */

// Type definitions will go here

