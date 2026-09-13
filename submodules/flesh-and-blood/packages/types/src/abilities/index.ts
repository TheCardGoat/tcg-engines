/**
 * Flesh and Blood structured ability model.
 *
 * Target contract: docs/architecture/foundation-types.md
 * Aligned to the official Comprehensive Rules (rules.fabtcg.com/en/cr/).
 * Rule citations use the CR Chapter.Section.Rule format.
 *
 * This module is data-only: every type is JSON-serializable. The display
 * metadata pipeline (FleshAndBloodCatalogCard) is unaffected.
 */

export * from "./primitives.ts";
export * from "./filter.ts";
export * from "./amount.ts";
export * from "./target.ts";
export * from "./cost.ts";
export * from "./condition.ts";
export * from "./trigger.ts";
export * from "./effect.ts";
export * from "./keyword.ts";
export * from "./ability.ts";
export * from "./layout.ts";
export * from "./discriminant-ownership.ts";
export * from "./authoring.ts";
export * from "./normalize.ts";
