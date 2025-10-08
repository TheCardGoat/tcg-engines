/**
 * Gundam Card Game - Card Definitions
 *
 * This directory contains all card definitions for the Gundam Card Game.
 * In @tcg/core, cards are plain data objects - no helper functions needed.
 *
 * Organization:
 * - sets/           - Cards organized by set (ST01, ST02, GD01, etc.)
 * - tokens/         - Special token cards (EX Base, etc.)
 * - card-types.ts   - Type definitions for card properties
 *
 * @example Unit Card Definition
 * ```typescript
 * import type { CardId } from "@tcg/core";
 *
 * // Card definition type (static data)
 * type UnitCardDefinition = {
 *   id: string;
 *   name: string;
 *   setCode: string;
 *   cardNumber: string;
 *   cardType: "UNIT";
 *
 *   // Base stats
 *   level: number;
 *   cost: number;
 *   ap: number;
 *   hp: number;
 *
 *   // Keyword abilities
 *   keywords: string[];
 *
 *   // Triggered/Activated abilities
 *   abilities: Array<{
 *     trigger?: "ON_DEPLOY" | "ON_ATTACK" | "ON_DEFENSE";
 *     activated?: { cost: string };
 *     description: string;
 *     effect: {
 *       type: string;
 *       // ... effect data
 *     };
 *   }>;
 *
 *   // Flavor and metadata
 *   flavor?: string;
 *   illustrator?: string;
 * };
 *
 * // Card definition (plain object)
 * export const RX78_2Gundam: UnitCardDefinition = {
 *   id: "gd01-001",
 *   name: "RX-78-2 Gundam",
 *   setCode: "GD01",
 *   cardNumber: "001",
 *   cardType: "UNIT",
 *
 *   // Base stats
 *   level: 3,
 *   cost: 2,
 *   ap: 5,
 *   hp: 6,
 *
 *   // Keyword abilities
 *   keywords: ["<First Strike>"],
 *
 *   // Triggered/Activated abilities
 *   abilities: [
 *     {
 *       trigger: "ON_DEPLOY",
 *       description: "[Deploy] Search your deck for a Pilot card named 'Amuro Ray' and add it to your hand.",
 *       effect: {
 *         type: "SEARCH_DECK",
 *         filter: { type: "PILOT", name: "Amuro Ray" },
 *         destination: "HAND",
 *         count: 1,
 *       },
 *     },
 *   ],
 *
 *   // Flavor and metadata
 *   flavor: "The legendary mobile suit that changed the course of the One Year War.",
 *   illustrator: "Hajime Katoki",
 * };
 *
 * // Card lookup table
 * export const GUNDAM_CARDS = {
 *   "gd01-001": RX78_2Gundam,
 *   // ... more cards
 * };
 * ```
 *
 * @example Card Instance in Game State
 * ```typescript
 * import type { CardId, PlayerId } from "@tcg/core";
 *
 * // Card instance (runtime state)
 * type UnitCardInstance = {
 *   id: CardId;                    // Unique instance ID
 *   definitionId: string;          // References card definition ("gd01-001")
 *   ownerId: PlayerId;             // Current owner
 *   tapped: boolean;               // Tapped state
 *   damage: number;                // Damage counters
 *   counters: Record<string, number>; // Custom counters
 *   pairedPilotId?: CardId;        // Paired pilot (Gundam-specific)
 * };
 *
 * // In game state:
 * type GundamGameState = {
 *   // ... other state
 *   cards: Record<CardId, UnitCardInstance>;
 * };
 *
 * // Helper to get card definition
 * function getCardDefinition(instance: UnitCardInstance) {
 *   return GUNDAM_CARDS[instance.definitionId];
 * }
 *
 * // Usage in move reducer
 * reducer: (draft, context) => {
 *   const cardInstance = draft.cards[cardId];
 *   if (cardInstance) {
 *     const definition = GUNDAM_CARDS[cardInstance.definitionId];
 *     // Check definition.cost, etc.
 *   }
 * }
 * ```
 *
 * Key Points:
 * - NO defineCard() helper - cards are plain objects
 * - Card definitions = static data (name, cost, abilities)
 * - Card instances = runtime state (tapped, damage, owner)
 * - Store definitions in a lookup object
 * - Reference definitions from instances via definitionId
 *
 * See template-engine package for examples.
 */

// Card definitions will go here once card types are defined
