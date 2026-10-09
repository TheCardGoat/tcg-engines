import type { MatchState } from "../types/match-state.ts";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import { getEffectiveRules } from "../active-effects/index.ts";
import { defOf } from "../state/lookups.ts";

export function hasPlayedProgramThisTurn(state: MatchState, playerId: PlayerId): boolean {
  return (
    state.G.turnMetadata.playedCardTypesThisTurn[playerId as string]?.includes("program") === true
  );
}

export function getMustAttackCardIds(state: MatchState, playerId: PlayerId): CardInstanceId[] {
  const player = state.G.players[playerId as string];
  if (!player) return [];

  return player.zones.field.filter((id) => {
    const card = state.G.cardIndex[id as string];
    if (!card || card.meta.spent) return false;
    const rules = getEffectiveRules(state, id as string);
    if (!rules.includes("mustAttack") || rules.includes("cantAttack")) return false;
    if (
      rules.includes("requiresProgramPlayedThisTurn") &&
      !hasPlayedProgramThisTurn(state, playerId)
    ) {
      return false;
    }
    const def = defOf(card);
    const canAttackGigArea =
      !rules.includes("cantAttackRival") &&
      (!card.meta.hasLag ||
        rules.includes("adrenaline") ||
        rules.includes("canAttackRivalOnPlayedTurn"));
    const canAttackUnits =
      !card.meta.hasLag ||
      rules.includes("adrenaline") ||
      rules.includes("canAttackOnPlayedTurnAgainstUnits");
    const opponentId = state.ctx.playerIds.find((id) => id !== playerId);
    const hasUnitTarget =
      canAttackUnits &&
      opponentId !== undefined &&
      state.G.players[opponentId]?.zones.field.some((defenderId) => {
        const defender = state.G.cardIndex[defenderId];
        if (!defender || (defOf(defender).type !== "unit" && defOf(defender).type !== "legend"))
          return false;
        return (
          defender.meta.spent ||
          rules.includes("canAttackReadyUnits") ||
          (rules.includes("canAttackReadyBlockers") &&
            getEffectiveRules(state, defenderId).includes("blocker"))
        );
      });
    if (!canAttackGigArea && !hasUnitTarget) return false;
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
