import { grandArchiveAllocationDecisionResolvers } from "./continuations/allocations.ts";
import { grandArchiveCombatDecisionResolvers } from "./continuations/combat.ts";
import { grandArchiveCombatDeclarationDecisionResolvers } from "./continuations/combat-declarations.ts";
import { grandArchiveEffectDeclarationDecisionResolvers } from "./continuations/effect-declarations.ts";
import { grandArchiveEffectDecisionResolvers } from "./continuations/effects.ts";
import { grandArchiveGlimpseDecisionResolvers } from "./continuations/glimpse.ts";
import { grandArchiveReplacementDecisionResolvers } from "./continuations/replacement.ts";
import { grandArchiveSystemDecisionResolvers } from "./continuations/system.ts";
import { grandArchiveTriggerDecisionResolvers } from "./continuations/triggers.ts";
import { grandArchiveTurnDecisionResolvers } from "./continuations/turn.ts";
import type { GrandArchiveDecisionKind, GrandArchiveDecisionResolver } from "./types.ts";

/**
 * The single routing table for decision kinds already migrated to declarative
 * continuations. Its key constraint makes every registered kind carry the
 * correctly narrowed serialized decision payload.
 */
export const grandArchiveDecisionContinuationRegistry = {
  ...grandArchiveAllocationDecisionResolvers,
  ...grandArchiveCombatDeclarationDecisionResolvers,
  ...grandArchiveCombatDecisionResolvers,
  ...grandArchiveEffectDeclarationDecisionResolvers,
  ...grandArchiveEffectDecisionResolvers,
  ...grandArchiveGlimpseDecisionResolvers,
  ...grandArchiveReplacementDecisionResolvers,
  ...grandArchiveSystemDecisionResolvers,
  ...grandArchiveTriggerDecisionResolvers,
  ...grandArchiveTurnDecisionResolvers,
} satisfies {
  readonly [Kind in GrandArchiveDecisionKind]: GrandArchiveDecisionResolver<Kind>;
};
