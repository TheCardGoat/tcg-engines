import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { GameState } from "../types/index.ts";
import type { MatchState } from "../types/match-state.ts";
import type { CardInstance } from "../types/card-instance.ts";
import type { Ability } from "@tcg/cyberpunk-types";
import { resolveTarget, type ResolutionContext } from "../effects/target-resolver.ts";
import { defOf } from "../state/lookups.ts";

/** CR 5.7.2 / 5.7.2.2 / 3.12.2 — face-down Legends always pay 1 €$; face-up Legends only with a Sell Tag. */
export function legendCanPayEddie(card: CardInstance): boolean {
  if (defOf(card).type !== "legend") return false;
  if (card.meta.spent) return false;
  if (defOf(card).type !== "legend") return false;
  if (card.meta.faceDown) return true;
  return defOf(card).hasSellTag === true;
}

export function readyLegendEddieCount(state: MatchState, playerId: PlayerId): number {
  const player = state.G.players[playerId as string];
  if (!player) return 0;

  return player.zones.legendArea.filter((id) => {
    const card = state.G.cardIndex[id as string];
    return card !== undefined && legendCanPayEddie(card);
  }).length;
}

export function availableEddies(state: MatchState, playerId: PlayerId): number {
  const player = state.G.players[playerId as string];
  if (!player) return 0;
  return player.eddies + readyLegendEddieCount(state, playerId);
}

/**
 * A player-selected payment is an exact, public commitment: every submitted
 * card must be a ready Eddie or a Legend that may legally pay 1 €$.  Keep the
 * check next to the automatic resource rules so every move applies the same
 * legality, rather than trusting a particular client or payment UI.
 */
export function canSpendSelectedEddies(
  state: GameState,
  playerId: PlayerId,
  amount: number,
  sourceIds: readonly CardInstanceId[],
): boolean {
  if (amount < 0 || sourceIds.length !== amount) return false;
  if (new Set(sourceIds.map(String)).size !== sourceIds.length) return false;

  const player = state.players[playerId as string];
  if (!player) return false;

  return sourceIds.every((cardId) => {
    const card = state.cardIndex[cardId as string];
    if (!card || card.controllerId !== playerId || card.meta.spent) return false;
    if (card.zone === "eddieArea") return player.eddieCardIds.includes(cardId);
    return card.zone === "legendArea" && legendCanPayEddie(card);
  });
}

export function availableEddiesAfterAbilityCosts(
  ability: Ability,
  state: MatchState,
  cardId: CardInstanceId,
  playerId: PlayerId,
  boundTargets: Record<string, string[]> = {},
): number {
  const summary = summarizeAbilityEddieCosts(ability, state, cardId, playerId, boundTargets);
  return Math.max(
    0,
    availableEddies(state, playerId) -
      summary.eddiesToPay -
      summary.reservedLegendIds.size -
      summary.unboundSelectableLegendCount,
  );
}

/**
 * Returns whether the Eddie payments and Legend spend costs can be paid
 * together. A ready Legend committed to a spend cost cannot also provide an
 * Eddie for another cost on the same ability.
 */
export function canPayAbilityEddieCosts(
  ability: Ability,
  state: MatchState,
  cardId: CardInstanceId,
  playerId: PlayerId,
  boundTargets: Record<string, string[]> = {},
): boolean {
  const summary = summarizeAbilityEddieCosts(ability, state, cardId, playerId, boundTargets);
  return (
    availableEddies(state, playerId) >=
    summary.eddiesToPay + summary.reservedLegendIds.size + summary.unboundSelectableLegendCount
  );
}

/** Legends that must remain ready until this ability's spend costs are paid. */
export function reservedLegendIdsForAbilityCosts(
  ability: Ability,
  state: MatchState,
  cardId: CardInstanceId,
  playerId: PlayerId,
  boundTargets: Record<string, string[]> = {},
): CardInstanceId[] {
  return [
    ...summarizeAbilityEddieCosts(ability, state, cardId, playerId, boundTargets).reservedLegendIds,
  ].map((id) => id as CardInstanceId);
}

function summarizeAbilityEddieCosts(
  ability: Ability,
  state: MatchState,
  cardId: CardInstanceId,
  playerId: PlayerId,
  boundTargets: Record<string, string[]>,
): {
  eddiesToPay: number;
  reservedLegendIds: Set<string>;
  unboundSelectableLegendCount: number;
} {
  let eddiesToPay = 0;
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
      let amount = cost.amount;
      if (cost.reduction) {
        const count = resolveTarget(cost.reduction.target, ctx).length;
        amount = Math.max(
          amount - count * cost.reduction.reductionPerCount,
          cost.reduction.min ?? 0,
        );
      }
      eddiesToPay += amount;
    } else if (cost.cost === "payCardCost") {
      const card = state.G.cardIndex[cardId as string];
      eddiesToPay += card ? (defOf(card).cost ?? 0) : 0;
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
          legendCanPayEddie(card)
        ) {
          spentLegendIds.add(targetId as string);
        }
      }
    }
  }
  return { eddiesToPay, reservedLegendIds: spentLegendIds, unboundSelectableLegendCount };
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
    legendCanPayEddie(card)
  );
}

/**
 * CR 11.15.1 — a [SPEND] activation cost whose target is the card itself taps
 * this Legend when the ability is paid. Legends with such an ability are the
 * last automatic payment source: tapping them wastes the ability for the turn.
 */
export function legendHasSelfTapAbility(card: CardInstance): boolean {
  return defOf(card).abilities.some((ability) =>
    (ability.costs ?? []).some((cost) => cost.cost === "spend" && cost.target.selector === "self"),
  );
}

/**
 * Automatic legend payment priority:
 *   1. face-up legends with no self-tap ability (pure resources),
 *   2. face-down legends in zone-array order,
 *   3. face-up legends with a self-tap ability.
 *
 * Face-down legends are never ordered by their card contents — the hidden
 * definitions must not influence (and therefore leak through) the automatic
 * choice, so zone position decides.
 */
export function spendReadyLegendsForEddies(
  state: GameState,
  playerId: PlayerId,
  amount: number,
  excludedLegendIds: readonly CardInstanceId[] = [],
): CardInstanceId[] {
  if (amount <= 0) return [];

  const player = state.players[playerId as string];
  if (!player) return [];

  const excluded = new Set(excludedLegendIds.map((id) => id as string));
  const readyLegends = player.zones.legendArea.filter((cardId) => {
    const card = state.cardIndex[cardId as string];
    return !excluded.has(cardId as string) && card !== undefined && legendCanPayEddie(card);
  });
  const faceUpPureResources = readyLegends.filter((cardId) => {
    const card = state.cardIndex[cardId as string];
    return card !== undefined && !card.meta.faceDown && !legendHasSelfTapAbility(card);
  });
  const faceDownLegends = readyLegends.filter((cardId) => {
    const card = state.cardIndex[cardId as string];
    return card?.meta.faceDown;
  });
  const faceUpWithSelfTapAbility = readyLegends.filter((cardId) => {
    const card = state.cardIndex[cardId as string];
    return card !== undefined && !card.meta.faceDown && legendHasSelfTapAbility(card);
  });

  const spent: CardInstanceId[] = [];
  for (const cardId of [...faceUpPureResources, ...faceDownLegends, ...faceUpWithSelfTapAbility]) {
    if (spent.length >= amount) break;
    spent.push(cardId);
  }
  return spent;
}
