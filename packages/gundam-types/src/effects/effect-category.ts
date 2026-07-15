/**
 * Effect Categories
 *
 * Classification of effects based on how they are activated and controlled.
 * See Official Rules Section 11-2.
 *
 * - **keyword**: Passive abilities defined by game rules (Repair, Breach, Support, etc.)
 * - **triggered**: Effects that automatically activate when a specific condition occurs
 * - **activated**: Effects that a player chooses to activate, usually with a cost
 * - **command**: Effects from Command cards that resolve when played
 * - **constant**: Continuous effects that are always active while the card is in play
 */
export type EffectCategory = "keyword" | "triggered" | "activated" | "command" | "constant";
