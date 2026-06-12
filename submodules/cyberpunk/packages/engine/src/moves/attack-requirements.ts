import type { MatchState } from "../types/match-state.ts";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import { getEffectiveRules } from "../active-effects/index.ts";
import { defOf } from "../state/lookups.ts";

export function getMustAttackCardIds(state: MatchState, playerId: PlayerId): CardInstanceId[] {
  const player = state.G.players[playerId as string];
  if (!player) return [];

  return player.zones.field.filter((id) => {
    const card = state.G.cardIndex[id as string];
    if (!card || card.meta.spent) return false;
    const rules = getEffectiveRules(state, id as string);
    if (!rules.includes("mustAttack") || rules.includes("cantAttack")) return false;
    const def = defOf(card);
    if (card.meta.playedThisTurn && !rules.includes("adrenaline")) return false;
    return def.type === "unit" || def.keywords.includes("goSolo");
  });
}

export function satisfiesMustAttackRequirement(
  state: MatchState,
  playerId: PlayerId,
  attackerId: CardInstanceId,
): boolean {
  const required = getMustAttackCardIds(state, playerId);
  return required.length === 0 || required.includes(attackerId);
}
