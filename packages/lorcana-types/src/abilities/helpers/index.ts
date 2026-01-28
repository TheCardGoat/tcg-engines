/**
 * Lorcana Ability Helpers
 *
 * Fluent API for building ability definitions with type safety.
 * These helpers provide a convenient way to construct abilities without
 * manually creating nested objects.
 *
 * @example
 * ```typescript
 * import { Abilities, Triggers, Effects, Targets, Conditions, Costs } from "@tcg/lorcana-types";
 *
 * // Simple keyword
 * const rush = Abilities.Keyword("Rush");
 *
 * // Triggered ability
 * const heroism = Abilities.Triggered({
 *   name: "HEROISM",
 *   trigger: Triggers.BanishInChallenge({ timing: "when", on: "SELF" }),
 *   effect: Effects.Banish({
 *     target: Targets.ChallengedCharacter(),
 *     optional: true
 *   })
 * });
 *
 * // Static ability with condition
 * const camouflage = Abilities.Static({
 *   name: "CAMOUFLAGE",
 *   condition: Conditions.HasAnotherCharacter(),
 *   effect: Effects.GainKeyword({
 *     keyword: "Evasive",
 *     target: Targets.Self()
 *   })
 * });
 * ```
 */

export { Abilities } from "./Abilities";
export { Conditions } from "./Conditions";
export { Costs } from "./Costs";
export { Effects } from "./Effects";
export { Targets } from "./Targets";
export { Triggers } from "./Triggers";
