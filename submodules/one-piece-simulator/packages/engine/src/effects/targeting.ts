import { getCard } from "../../../cards/src/index.ts";
import type { Target, TargetFilter } from "@tcg/op-types";
import {
  baseCost,
  basePower,
  cardName,
  effectBlocksFor,
  getCardPower,
  getInstance,
  getKeywords,
  getPlayer,
  otherSeat,
} from "../shared.ts";
import type { MatchSeat, MatchState } from "../types.ts";

export function matchesTargetFilter(
  state: MatchState,
  sourceInstanceId: string | null,
  candidateId: string,
  filter: TargetFilter,
): { supported: boolean; matches: boolean } {
  const candidate = getInstance(state, candidateId);
  const card = getCard(candidate.cardId);

  switch (filter.filter) {
    case "name":
      return { supported: true, matches: cardName(card) === filter.value };
    case "excludeName":
      return { supported: true, matches: cardName(card) !== filter.value };
    case "excludeSelf":
      return { supported: true, matches: sourceInstanceId !== candidateId };
    case "trait":
      return {
        supported: true,
        matches: filter.negate
          ? !(card.traits ?? []).includes(filter.value)
          : (card.traits ?? []).includes(filter.value),
      };
    case "attribute":
      return { supported: true, matches: card.attribute === filter.value };
    case "cost":
    case "baseCost": {
      const value = baseCost(card);
      switch (filter.comparison) {
        case "eq":
          return { supported: true, matches: value === filter.value };
        case "lt":
          return { supported: true, matches: value < filter.value };
        case "lte":
          return { supported: true, matches: value <= filter.value };
        case "gt":
          return { supported: true, matches: value > filter.value };
        case "gte":
          return { supported: true, matches: value >= filter.value };
      }
      break;
    }
    case "power":
    case "basePower": {
      const value = filter.filter === "power" ? getCardPower(state, candidateId) : basePower(card);
      switch (filter.comparison) {
        case "eq":
          return { supported: true, matches: value === filter.value };
        case "lt":
          return { supported: true, matches: value < filter.value };
        case "lte":
          return { supported: true, matches: value <= filter.value };
        case "gt":
          return { supported: true, matches: value > filter.value };
        case "gte":
          return { supported: true, matches: value >= filter.value };
      }
      break;
    }
    case "color":
      return { supported: true, matches: card.color.includes(filter.value) };
    case "cardCategory":
      return { supported: true, matches: card.cardType === filter.value };
    case "state":
      return {
        supported: true,
        matches: filter.value === (candidate.rested ? "rested" : "active"),
      };
    case "hasKeyword":
      return { supported: true, matches: getKeywords(state, candidateId).has(filter.value) };
    case "hasTrigger": {
      const hasTrigger =
        (card.cardType === "event" || card.cardType === "stage" || card.cardType === "character") &&
        Boolean(card.trigger);
      return {
        supported: true,
        matches: filter.value ? hasTrigger : !hasTrigger,
      };
    }
    case "hasEffectType":
      return {
        supported: true,
        matches: filter.negate
          ? !effectBlocksFor(card, filter.value).length
          : effectBlocksFor(card, filter.value).length > 0,
      };
    case "player":
      return {
        supported: true,
        matches:
          filter.value === "self"
            ? candidate.owner === getInstance(state, sourceInstanceId!).owner
            : candidate.owner !== getInstance(state, sourceInstanceId!).owner,
      };
    case "noBaseEffect":
      return {
        supported: true,
        matches: !card.effects?.effects?.length && !card.effects?.permanentEffects?.length,
      };
    case "dynamicCost":
      return { supported: false, matches: false };
  }
}

export function candidatesForTarget(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string | null,
  target: Target,
): string[] | null {
  const pool = candidatePoolForTarget(state, controller, sourceInstanceId, target);
  if (!pool.supported) {
    return null;
  }

  const filtered = pool.candidateIds;

  if (target.count.amount === "all") {
    return filtered;
  }

  if (target.count.amount === 1) {
    if (filtered.length === 0) {
      return [];
    }

    if (filtered.length === 1) {
      return filtered;
    }

    return null;
  }

  if (filtered.length === target.count.amount) {
    return filtered;
  }

  if (target.count.upTo && filtered.length <= target.count.amount) {
    return filtered;
  }

  return null;
}

export function candidatePoolForTarget(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string | null,
  target: Target,
): { supported: boolean; candidateIds: string[] } {
  const seat = target.player === "self" ? controller : otherSeat(controller);
  const player = getPlayer(state, seat);
  const candidateIds: string[] = [];

  for (const zone of target.zones) {
    switch (zone) {
      case "leader":
        candidateIds.push(player.leaderInstanceId);
        break;
      case "character":
        candidateIds.push(
          ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
        );
        break;
      case "stage":
        if (player.stageArea) {
          candidateIds.push(player.stageArea);
        }
        break;
      case "hand":
        candidateIds.push(...player.hand);
        break;
      case "deck":
        candidateIds.push(...player.deck);
        break;
      case "trash":
        candidateIds.push(...player.trash);
        break;
      case "life":
        candidateIds.push(...player.life);
        break;
      case "field":
        candidateIds.push(player.leaderInstanceId);
        candidateIds.push(
          ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
        );
        if (player.stageArea) {
          candidateIds.push(player.stageArea);
        }
        break;
      case "don":
      case "donDeck":
      case "costArea":
        break;
    }
  }

  let filtered = [...new Set(candidateIds)];

  if (target.filters) {
    for (const filter of target.filters) {
      const next: string[] = [];
      for (const candidateId of filtered) {
        const result = matchesTargetFilter(state, sourceInstanceId, candidateId, filter);
        if (!result.supported) {
          return { supported: false, candidateIds: filtered };
        }
        if (result.matches) {
          next.push(candidateId);
        }
      }
      filtered = next;
    }
  }

  if (target.self && sourceInstanceId) {
    filtered = filtered.filter((candidateId) => candidateId === sourceInstanceId);
  }

  return { supported: true, candidateIds: filtered };
}
