/**
 * Shared runtime-move operations.
 *
 * These helpers replace duplicated inline blocks across move files
 * (challenge, quest, activate-ability, resources, pass-turn) so behavior stays
 * consistent across moves and so future card implementations have a stable
 * surface to call into.
 */

export { isCardInPlayZone } from "./zones";
export { validateNoPendingEffects, hasAnyPendingEffects } from "./pending-effects";
export { getCardDefinition } from "./cards";
export { buildStaticContexts, type StaticContexts } from "./static-context";
export { applyChallengeDamage } from "./damage";
export { banishAsAbilityCost } from "./banish";
export { exertCard } from "./exert";
export { gainLore } from "./gain-lore";
export { applyStaticRestrictionBypass } from "./static-restriction-bypass";
export {
  snapshotAndBanishLethalCombatant,
  type LethalChallengeBanishSnapshot,
} from "./banish-lethal-challenge";
