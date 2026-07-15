import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { GameState } from "../types/index.ts";
import type { MatchState } from "../types/match-state.ts";
import type { Ability } from "@tcg/cyberpunk-types";
import { resolveTarget, type ResolutionContext } from "../effects/target-resolver.ts";
import { defOf } from "../state/lookups.ts";

export function readyLegendEddieCount(state: MatchState, playerId: PlayerId): number {
  const player = state.G.players[playerId as string];
  if (!player) return 0;

  return player.zones.legendArea.filter((id) => {
    const card = state.G.cardIndex[id as string];
    return card && !card.meta.spent;
  }).length;
}

export function availableEddies(state: MatchState, playerId: PlayerId): number {
  const player = state.G.players[playerId as string];
  if (!player) return 0;
  return player.eddies + readyLegendEddieCount(state, playerId);
}

export function availableEddiesAfterAbilityCosts(
  ability: Ability,
  state: MatchState,
  cardId: CardInstanceId,
  playerId: PlayerId,
  boundTargets: Record<string, string[]> = {},
): number {
  let remaining = availableEddies(state, playerId);
  const ctx: ResolutionContext = {
    state,
    sourceCardId: cardId,
    sourcePlayerId: playerId,
    abilityIndex: -1,
    contextTargets: {},
    boundTargets,
  };
  const spentLegendIds = new Set<string>();
  let unboundSelectableLegendCount = 0;
  for (let costIndex = 0; costIndex < (ability.costs ?? []).length; costIndex++) {
    const cost = ability.costs![costIndex]!;
    if (cost.cost === "payEddies") {
      remaining -= cost.amount;
    } else if (cost.cost === "payCardCost") {
      const card = state.G.cardIndex[cardId as string];
      remaining -= card ? (defOf(card).cost ?? 0) : 0;
    } else if (cost.cost === "spend") {
      const selection = getCostSelection(cost.target);
      const selectedIds = selection ? boundTargets[abilityCostBindingId(costIndex)] : undefined;
      if (selection && !selectedIds) {
        const candidates = resolveTarget(cost.target, ctx).filter((targetId) => {
          const target = state.G.cardIndex[targetId as string];
          return target !== undefined && !target.meta.spent;
        });
        const nonLegendCandidates = candidates.filter(
          (targetId) => !isReadyControlledLegend(state, targetId, playerId),
        ).length;
        const minimum = selection.min ?? 1;
        unboundSelectableLegendCount += Math.max(0, minimum - nonLegendCandidates);
        continue;
      }

      for (const targetId of selectedIds ?? resolveTarget(cost.target, ctx)) {
        const card = state.G.cardIndex[targetId as string];
        if (
          card &&
          card.controllerId === playerId &&
          card.zone === "legendArea" &&
          !card.meta.spent
        ) {
          spentLegendIds.add(targetId as string);
        }
      }
    }
  }
  return Math.max(0, remaining - spentLegendIds.size - unboundSelectableLegendCount);
}

export function abilityCostBindingId(costIndex: number): string {
  return `__cost:${costIndex}`;
}

function getCostSelection(
  target: Extract<NonNullable<Ability["costs"]>[number], { cost: "spend" }>["target"],
) {
  if (target.selector !== "card" && target.selector !== "gig" && target.selector !== "context") {
    return undefined;
  }
  return target.selection;
}

function isReadyControlledLegend(state: MatchState, cardId: string, playerId: PlayerId): boolean {
  const card = state.G.cardIndex[cardId];
  return (
    card !== undefined &&
    card.controllerId === playerId &&
    card.zone === "legendArea" &&
    !card.meta.spent
  );
}

export function spendReadyLegendsForEddies(
  state: GameState,
  playerId: PlayerId,
  amount: number,
): CardInstanceId[] {
  if (amount <= 0) return [];

  const player = state.players[playerId as string];
  if (!player) return [];

  const readyLegends = player.zones.legendArea.filter((cardId) => {
    const card = state.cardIndex[cardId as string];
    return card && !card.meta.spent;
  });
  const faceDownLegends = readyLegends.filter((cardId) => {
    const card = state.cardIndex[cardId as string];
    return card?.meta.faceDown;
  });
  const faceUpLegends = readyLegends.filter((cardId) => {
    const card = state.cardIndex[cardId as string];
    return !card?.meta.faceDown;
  });

  const spent: CardInstanceId[] = [];
  for (const cardId of [...faceDownLegends, ...faceUpLegends]) {
    if (spent.length >= amount) break;
    spent.push(cardId);
  }
  return spent;
}
