import { getCard } from "../../../cards/src/runtime-catalog.ts";
import type { Target, TargetFilter } from "@tcg/op-types";
import {
  baseCost,
  basePower,
  cardNames,
  donCardsOnField,
  effectBlocksFor,
  getCardCost,
  getCardPower,
  getInstance,
  getKeywords,
  getPlayer,
  otherSeat,
} from "../shared.ts";
import type { MatchSeat, MatchState } from "../types.ts";

function hasPrintedText(text: string | undefined): boolean {
  const normalized = text?.trim();
  return Boolean(normalized && normalized.toUpperCase() !== "NULL");
}

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
      return { supported: true, matches: cardNames(card).includes(filter.value) };
    case "excludeName":
      return { supported: true, matches: !cardNames(card).includes(filter.value) };
    case "excludeSelf":
      return { supported: true, matches: sourceInstanceId !== candidateId };
    case "trait": {
      const expectedTraits = Array.isArray(filter.value) ? filter.value : [filter.value];
      const hasMatchingTrait = expectedTraits.some((expectedTrait) =>
        filter.match === "includes"
          ? (card.traits ?? []).some((trait) => trait.includes(expectedTrait))
          : (card.traits ?? []).includes(expectedTrait),
      );
      return {
        supported: true,
        matches: filter.negate ? !hasMatchingTrait : hasMatchingTrait,
      };
    }
    case "attribute":
      return (() => {
        const matches = Array.isArray(card.attribute)
          ? card.attribute.includes(filter.value)
          : card.attribute === filter.value;
        return { supported: true, matches: filter.negate ? !matches : matches };
      })();
    case "cost":
    case "baseCost": {
      const value = filter.filter === "cost" ? getCardCost(state, candidateId) : baseCost(card);
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
    case "counter": {
      const value = card.cardType === "character" ? (card.counter ?? 0) : 0;
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
        (Boolean(card.trigger) || effectBlocksFor(card, "trigger").length > 0);
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
            ? candidate.controller === getInstance(state, sourceInstanceId!).controller
            : candidate.controller !== getInstance(state, sourceInstanceId!).controller,
      };
    case "noBaseEffect":
      return {
        supported: true,
        matches:
          !hasPrintedText(card.effect) &&
          !(
            (card.cardType === "character" ||
              card.cardType === "event" ||
              card.cardType === "stage") &&
            hasPrintedText(card.trigger)
          ),
      };
    case "anyOf": {
      const groups = "groups" in filter ? filter.groups : filter.filters.map((nested) => [nested]);
      for (const group of groups) {
        let groupMatches = true;
        for (const nestedFilter of group) {
          const result = matchesTargetFilter(state, sourceInstanceId, candidateId, nestedFilter);
          if (!result.supported) {
            return { supported: false, matches: false };
          }
          groupMatches &&= result.matches;
        }
        if (groupMatches) {
          return { supported: true, matches: true };
        }
      }
      return { supported: true, matches: false };
    }
    case "allOf": {
      for (const nestedFilter of filter.filters) {
        const result = matchesTargetFilter(state, sourceInstanceId, candidateId, nestedFilter);
        if (!result.supported || !result.matches) {
          return result;
        }
      }
      return { supported: true, matches: true };
    }
    case "dynamicCost":
      if (!sourceInstanceId) {
        return { supported: false, matches: false };
      }
      const controller = getInstance(state, sourceInstanceId).controller;
      const referenceValue = (() => {
        switch (filter.source) {
          case "opponentLifeCount":
            return getPlayer(state, otherSeat(controller)).life.length;
          case "totalLifeCount":
            return (
              getPlayer(state, controller).life.length +
              getPlayer(state, otherSeat(controller)).life.length
            );
          case "selfLifeCount":
            return getPlayer(state, controller).life.length;
          case "selfDonCount":
            return donCardsOnField(state, controller);
          case "opponentDonCount":
            return donCardsOnField(state, otherSeat(controller));
        }
      })();
      const candidateCost = baseCost(card);
      switch (filter.comparison) {
        case "eq":
          return { supported: true, matches: candidateCost === referenceValue };
        case "lt":
          return { supported: true, matches: candidateCost < referenceValue };
        case "lte":
          return { supported: true, matches: candidateCost <= referenceValue };
        case "gt":
          return { supported: true, matches: candidateCost > referenceValue };
        case "gte":
          return { supported: true, matches: candidateCost >= referenceValue };
      }
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
    return target.count.upTo ? (filtered.length === 0 ? [] : null) : filtered;
  }

  if (target.count.upTo) {
    return filtered.length === 0 ? [] : null;
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

  return null;
}

export function selectionSatisfiesTotalConstraint(
  state: MatchState,
  selectedIds: string[],
  target: Target,
): boolean {
  if (!target.totalConstraint) {
    return true;
  }
  const total = selectedIds.reduce(
    (sum, instanceId) =>
      sum +
      (target.totalConstraint!.property === "power"
        ? getCardPower(state, instanceId)
        : getCardCost(state, instanceId)),
    0,
  );
  switch (target.totalConstraint.comparison) {
    case "eq":
      return total === target.totalConstraint.value;
    case "lt":
      return total < target.totalConstraint.value;
    case "lte":
      return total <= target.totalConstraint.value;
    case "gt":
      return total > target.totalConstraint.value;
    case "gte":
      return total >= target.totalConstraint.value;
  }
}

export function candidatePoolForTarget(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string | null,
  target: Target,
): { supported: boolean; candidateIds: string[] } {
  const candidateIds: string[] = [];
  const seats =
    target.player === "both" || target.player === "any"
      ? ([controller, otherSeat(controller)] as const)
      : ([target.player === "self" ? controller : otherSeat(controller)] as const);

  for (const seat of seats) {
    const player = getPlayer(state, seat);
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
