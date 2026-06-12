import type { Ability, CardDefinition } from "@tcg/cyberpunk-types";

/**
 * Returns true when an activated ability (or the card that hosts it) carries
 * the `quick` keyword. Used to gate defensive-step reactions.
 */
export function isQuickAbility(ability: Ability, cardDef: CardDefinition): boolean {
  return ability.keyword === "quick" || cardDef.keywords.includes("quick");
}
