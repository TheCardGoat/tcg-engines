/**
 * Gundam Card Game - Card Definitions
 *
 * This directory contains all card definitions for the Gundam Card Game.
 * Cards are defined declaratively using the @tcg/core card definition system.
 *
 * Organization:
 * - sets/           - Cards organized by set (ST01, ST02, GD01, etc.)
 * - tokens/         - Special token cards (EX Base, etc.)
 * - card-types.ts   - Type definitions for card properties
 *
 * @example Unit Card Definition
 * ```typescript
 * import { defineCard } from "@tcg/core";
 * import type { UnitCard } from "./card-types";
 *
 * export const RX78_2Gundam: UnitCard = defineCard({
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
 * });
 * ```
 *
 * @example Pilot Card Definition
 * ```typescript
 * export const AmuroRay: PilotCard = defineCard({
 *   id: "gd01-050",
 *   name: "Amuro Ray",
 *   cardType: "PILOT",
 *
 *   level: 2,
 *   cost: 1,
 *   apBonus: 2,
 *   hpBonus: 1,
 *
 *   // Link conditions for becoming a Link Unit
 *   linkConditions: [
 *     { type: "UNIT_NAME", value: "RX-78-2 Gundam" },
 *   ],
 *
 *   abilities: [
 *     {
 *       trigger: "WHEN_ATTACKING",
 *       condition: { type: "IS_LINK_UNIT" },
 *       effect: { type: "DRAW_CARD", count: 1 },
 *     },
 *   ],
 * });
 * ```
 *
 * @example Command Card Definition
 * ```typescript
 * export const BeamRifle: CommandCard = defineCard({
 *   id: "gd01-100",
 *   name: "Beam Rifle",
 *   cardType: "COMMAND",
 *   timing: "[Action]",
 *
 *   level: 1,
 *   cost: 1,
 *
 *   effect: {
 *     type: "DAMAGE",
 *     target: { type: "OPPONENT_UNIT" },
 *     amount: 3,
 *   },
 *
 *   // Alternative use
 *   burstEffect: {
 *     description: "[Burst] Deal 2 damage to target Unit.",
 *     effect: {
 *       type: "DAMAGE",
 *       target: { type: "ANY_UNIT" },
 *       amount: 2,
 *     },
 *   },
 * });
 * ```
 *
 * @example Base Card Definition
 * ```typescript
 * export const NahelArgama: BaseCard = defineCard({
 *   id: "gd01-123",
 *   name: "Nahel Argama",
 *   cardType: "BASE",
 *
 *   level: 2,
 *   cost: 1,
 *   hp: 8,
 *
 *   abilities: [
 *     {
 *       trigger: "CONSTANT",
 *       effect: {
 *         type: "MODIFY_STATS",
 *         target: { type: "YOUR_UNITS", filter: { color: "GREEN" } },
 *         modification: { ap: 1 },
 *       },
 *     },
 *   ],
 * });
 * ```
 */

// Card definitions will go here
// export * from "./sets/st01";
// export * from "./sets/st02";
// export * from "./sets/gd01";
// export * from "./tokens";

