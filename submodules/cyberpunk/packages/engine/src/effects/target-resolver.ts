import type {
  TargetDSL,
  CardTargetDSL,
  GigTargetDSL,
  Condition,
  Comparison,
  NumericValue,
  RelativePlayer,
} from "@tcg/cyberpunk-types";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import type { CardInstance } from "../types/card-instance.ts";
import { getEffectivePower } from "../active-effects/index.ts";
import { defOf } from "../state/lookups.ts";
import { assertNever } from "../types/exhaustive.ts";

export interface ResolutionContext {
  readonly state: MatchState;
  readonly sourceCardId: CardInstanceId;
  readonly sourcePlayerId: PlayerId;
  readonly abilityIndex: number;
  readonly contextTargets: Record<string, string[]>;
  readonly boundTargets: Record<string, string[]>;
}

export function resolveTarget(target: TargetDSL, ctx: ResolutionContext): string[] {
  switch (target.selector) {
    case "self":
      return [ctx.sourceCardId as string];
    case "host": {
      const card = ctx.state.G.cardIndex[ctx.sourceCardId as string];
      if (card?.meta.attachedToId) return [card.meta.attachedToId as string];
      return [];
    }
    case "bound": {
      const bound = ctx.boundTargets[target.id] ?? [];
      if (target.index === undefined) return bound;
      const selected = bound[target.index];
      return selected === undefined ? [] : [selected];
    }
    case "context":
      return ctx.contextTargets[target.key] ?? [];
    case "card":
      return resolveCardTarget(target, ctx);
    case "gig":
      return resolveGigTarget(target, ctx);
    default:
      return [];
  }
}

function resolveCardTarget(target: CardTargetDSL, ctx: ResolutionContext): string[] {
  // When no controller is specified, target cards across all players.
  const playerId = target.controller ? resolveRelativePlayer(target.controller, ctx) : undefined;
  const candidates = getCardCandidates(playerId, target, ctx);

  return candidates.map((c) => c.instanceId as string);
}

function getCardCandidates(
  playerId: PlayerId | undefined,
  target: CardTargetDSL,
  ctx: ResolutionContext,
): CardInstance[] {
  const allCards = Object.values(ctx.state.G.cardIndex);
  let candidates = allCards;

  if (playerId) {
    candidates = candidates.filter((c) => c.controllerId === playerId);
  }

  if (target.zones) {
    candidates = candidates.filter((c) => target.zones!.includes(c.zone));
  }

  if (target.cardTypes) {
    candidates = candidates.filter((c) => target.cardTypes!.includes(defOf(c).type));
  }

  if (target.colors) {
    candidates = candidates.filter((c) => target.colors!.includes(defOf(c).color));
  }

  if (target.classifications) {
    candidates = candidates.filter((c) =>
      defOf(c).classifications.some((cl) => target.classifications!.includes(cl)),
    );
  }

  if (target.state !== undefined) {
    const isSpent = target.state === "spent";
    candidates = candidates.filter((c) => c.meta.spent === isSpent);
  }

  if (target.face !== undefined) {
    const isFaceDown = target.face === "faceDown";
    candidates = candidates.filter((c) => c.meta.faceDown === isFaceDown);
  }

  if (target.maxCost !== undefined) {
    candidates = candidates.filter((c) => {
      const cost = defOf(c).cost ?? 0;
      return cost <= target.maxCost!;
    });
  }

  if (target.minCost !== undefined) {
    candidates = candidates.filter((c) => {
      const cost = defOf(c).cost ?? 0;
      return cost >= target.minCost!;
    });
  }

  if (target.minPower !== undefined) {
    candidates = candidates.filter((c) => {
      const power = getEffectivePower(ctx.state, c.instanceId as string);
      return power >= target.minPower!;
    });
  }

  if (target.maxPower !== undefined) {
    candidates = candidates.filter((c) => {
      const power = getEffectivePower(ctx.state, c.instanceId as string);
      return power <= target.maxPower!;
    });
  }

  if (target.excludeSelf) {
    candidates = candidates.filter((c) => c.instanceId !== ctx.sourceCardId);
  }

  if (target.hasAttachedCards !== undefined) {
    if (target.hasAttachedCards) {
      candidates = candidates.filter((c) => c.meta.attachedGearIds.length > 0);
    } else {
      candidates = candidates.filter((c) => c.meta.attachedGearIds.length === 0);
    }
  }

  if (target.attachedTo) {
    const parentIds = resolveTarget(target.attachedTo, ctx);
    candidates = candidates.filter(
      (c) => c.meta.attachedToId && parentIds.includes(c.meta.attachedToId as string),
    );
  }

  if (target.costEqualsGigValueOf) {
    const gigIds = resolveTarget(target.costEqualsGigValueOf, ctx);
    const gigValues = gigIds
      .map((id) => ctx.state.G.gigDice[id])
      .filter(Boolean)
      .map((d) => d.faceValue);
    candidates = candidates.filter((c) => {
      const cost = defOf(c).cost ?? 0;
      return gigValues.includes(cost);
    });
  }

  if (target.powerLessThanAnyOf) {
    const refIds = resolveTarget(target.powerLessThanAnyOf, ctx);
    const refPowers = refIds
      .map((id) => getEffectivePower(ctx.state, id))
      .filter((p): p is number => typeof p === "number");
    const maxRefPower = refPowers.length > 0 ? Math.max(...refPowers) : -Infinity;
    candidates = candidates.filter(
      (c) => getEffectivePower(ctx.state, c.instanceId as string) < maxRefPower,
    );
  }

  return candidates;
}

function resolveGigTarget(target: GigTargetDSL, ctx: ResolutionContext): string[] {
  const playerIds = target.controller
    ? [resolveRelativePlayer(target.controller, ctx)]
    : ctx.state.ctx.playerIds;
  let dice = playerIds.flatMap((playerId) => {
    const player = ctx.state.G.players[playerId as string];
    if (!player) return [];
    return player.gigArea.map((id) => ctx.state.G.gigDice[id as string]).filter(Boolean);
  });

  if (target.sameValueAs) {
    const refIds = resolveTarget(target.sameValueAs, ctx);
    const refValues = refIds
      .map((id) => ctx.state.G.gigDice[id])
      .filter(Boolean)
      .map((d) => d.faceValue);
    dice = dice.filter((d) => refValues.includes(d.faceValue));
  }

  if (target.sameSidesAs) {
    const refIds = resolveTarget(target.sameSidesAs, ctx);
    const refTypes = refIds
      .map((id) => ctx.state.G.gigDice[id])
      .filter(Boolean)
      .map((d) => d.dieType);
    dice = dice.filter((d) => refTypes.includes(d.dieType));
  }

  if (target.minValue !== undefined) {
    dice = dice.filter((d) => d.faceValue >= target.minValue!);
  }

  if (target.maxValue !== undefined) {
    dice = dice.filter((d) => d.faceValue <= target.maxValue!);
  }

  const ids = dice.map((d) => d.id as string);
  if (target.selection) return ids;
  if (target.amount === "all") return ids;
  return ids.slice(0, target.amount ?? 1);
}

function resolveRelativePlayer(
  relative: RelativePlayer | undefined,
  ctx: ResolutionContext,
): PlayerId {
  if (!relative || relative === "friendly") return ctx.sourcePlayerId;
  if (relative === "rival") {
    return ctx.state.ctx.playerIds.find((id) => id !== ctx.sourcePlayerId)!;
  }
  return ctx.sourcePlayerId;
}

function computeStreetCred(player: RelativePlayer, ctx: ResolutionContext): number {
  const playerId = resolveRelativePlayer(player, ctx);
  const playerState = ctx.state.G.players[playerId as string];
  if (!playerState) return 0;
  return playerState.gigArea
    .map((id) => ctx.state.G.gigDice[id as string])
    .filter(Boolean)
    .reduce((sum, d) => sum + d.faceValue, 0);
}

/**
 * Count of friendly value-pairs of Gigs. With `n` dice and `k` dice sharing
 * a value, the pair count is `k choose 2`; we sum across all value buckets
 * with `k >= 2`. Visible to the engine's effect handlers so that
 * `forEachFriendlyGigPair` can multiply a wrapped effect.
 */
export function countFriendlyGigPairs(ctx: ResolutionContext): number {
  const player = ctx.state.G.players[ctx.sourcePlayerId as string];
  if (!player) return 0;
  const dice = player.gigArea.map((id) => ctx.state.G.gigDice[id as string]).filter(Boolean);
  const counts = new Map<number, number>();
  for (const d of dice) {
    counts.set(d.faceValue, (counts.get(d.faceValue) ?? 0) + 1);
  }
  let pairs = 0;
  for (const count of counts.values()) {
    if (count >= 2) pairs += (count * (count - 1)) / 2;
  }
  return pairs;
}

export function evaluateCondition(condition: Condition, ctx: ResolutionContext): boolean {
  switch (condition.condition) {
    case "streetCred": {
      const playerId = resolveRelativePlayer(condition.controller, ctx);
      const player = ctx.state.G.players[playerId as string];
      if (!player) return false;
      const dice = player.gigArea.map((id) => ctx.state.G.gigDice[id as string]).filter(Boolean);
      const streetCred = dice.reduce((sum, d) => sum + d.faceValue, 0);
      return compareValues(streetCred, condition.comparison, condition.value);
    }

    case "streetCredComparison": {
      const left = computeStreetCred(condition.controller, ctx);
      const right = computeStreetCred(condition.other, ctx);
      return compareValues(left, condition.comparison, right);
    }

    case "cardState": {
      const ids = resolveTarget(condition.target, ctx);
      if (ids.length === 0) return false;
      const card = ctx.state.G.cardIndex[ids[0]!];
      if (!card) return false;
      if (condition.state !== undefined) {
        const isSpent = condition.state === "spent";
        if (card.meta.spent !== isSpent) return false;
      }
      if (condition.face !== undefined) {
        const isFaceDown = condition.face === "faceDown";
        if (card.meta.faceDown !== isFaceDown) return false;
      }
      return true;
    }

    case "turn": {
      if (condition.player === "friendly") {
        return ctx.state.G.turnMetadata.activePlayerId === ctx.sourcePlayerId;
      }
      const opponentId = ctx.state.ctx.playerIds.find((id) => id !== ctx.sourcePlayerId)!;
      return ctx.state.G.turnMetadata.activePlayerId === opponentId;
    }

    case "overtime":
      return ctx.state.G.overtime === (condition.active ?? true);

    case "targetValue": {
      const ids = resolveTarget(condition.target, ctx);
      if (ids.length === 0) return false;
      const die = ctx.state.G.gigDice[ids[0]!];
      if (!die) return false;
      const value = condition.property === "gigValue" ? die.faceValue : 0;
      const compareVal = condition.value === "max" ? DIE_MAX_VALUES[die.dieType] : condition.value;
      return compareValues(value, condition.comparison, compareVal as number);
    }

    case "attacking": {
      const ids = resolveTarget(condition.target, ctx);
      if (ids.length === 0) return false;
      const attack = ctx.state.G.attackState;
      if (!attack) return false;
      return attack.attackerId === (ids[0] as CardInstanceId);
    }

    case "playedThisTurn": {
      const ids = resolveTarget(condition.target, ctx);
      if (ids.length === 0) return false;
      const card = ctx.state.G.cardIndex[ids[0]!];
      return card?.meta.playedThisTurn ?? false;
    }

    case "hasGigAtMaxValue": {
      const playerId = resolveRelativePlayer(condition.controller, ctx);
      const player = ctx.state.G.players[playerId as string];
      if (!player) return false;
      const dice = player.gigArea.map((id) => ctx.state.G.gigDice[id as string]).filter(Boolean);
      return dice.some((d) => d.faceValue === DIE_MAX_VALUES[d.dieType]);
    }

    case "hasGigPair": {
      const playerId = resolveRelativePlayer(condition.controller, ctx);
      const player = ctx.state.G.players[playerId as string];
      if (!player) return false;
      const dice = player.gigArea.map((id) => ctx.state.G.gigDice[id as string]).filter(Boolean);
      const values = dice.map((d) => d.faceValue);
      return new Set(values).size < values.length;
    }

    case "hasDistinctGigValues": {
      const playerId = resolveRelativePlayer(condition.controller, ctx);
      const player = ctx.state.G.players[playerId as string];
      if (!player) return false;
      const dice = player.gigArea.map((id) => ctx.state.G.gigDice[id as string]).filter(Boolean);
      const distinctValues = new Set(dice.map((d) => d.faceValue));
      return distinctValues.size >= condition.minCount;
    }

    case "hasMinGig": {
      const playerId = resolveRelativePlayer(condition.controller, ctx);
      const player = ctx.state.G.players[playerId as string];
      if (!player) return false;
      const dice = player.gigArea.map((id) => ctx.state.G.gigDice[id as string]).filter(Boolean);
      return dice.some((d) => d.faceValue === 1);
    }

    case "matchingGig": {
      const playerId = resolveRelativePlayer(condition.controller, ctx);
      const player = ctx.state.G.players[playerId as string];
      if (!player) return false;
      const targetIds = resolveTarget(condition.target, ctx);
      const targetDice = targetIds.map((id) => ctx.state.G.gigDice[id]).filter(Boolean);
      const playerDice = player.gigArea
        .map((id) => ctx.state.G.gigDice[id as string])
        .filter(Boolean);

      return targetDice.some((td) =>
        playerDice.some((pd) => {
          if (condition.property === "value") return pd.faceValue === td.faceValue;
          return pd.dieType === td.dieType;
        }),
      );
    }

    case "fightKind": {
      const ids = resolveTarget(condition.target, ctx);
      if (ids.length === 0) return false;
      const attack = ctx.state.G.attackState;
      if (!attack) return false;
      if ((attack.attackerId as string) !== ids[0]) return false;
      return attack.kind === condition.kind;
    }

    case "costMatchesGig": {
      const targetIds = resolveTarget(condition.target, ctx);
      if (targetIds.length === 0) return false;
      const targetCard = ctx.state.G.cardIndex[targetIds[0]!];
      if (!targetCard) return false;
      const cost = defOf(targetCard).cost ?? 0;
      const playerId = resolveRelativePlayer(condition.controller, ctx);
      const player = ctx.state.G.players[playerId as string];
      if (!player) return false;
      const gigValues = player.gigArea
        .map((id) => ctx.state.G.gigDice[id as string])
        .filter(Boolean)
        .map((d) => d.faceValue);
      return gigValues.includes(cost);
    }

    default:
      return assertNever(condition);
  }
}

function compareValues(left: number, op: Comparison, right: number): boolean {
  switch (op) {
    case "eq":
      return left === right;
    case "gt":
      return left > right;
    case "gte":
      return left >= right;
    case "lt":
      return left < right;
    case "lte":
      return left <= right;
    default:
      return false;
  }
}

export function resolveNumericValue(value: NumericValue, ctx: ResolutionContext): number {
  if (typeof value === "number") return value;

  if (value.type === "perCount") {
    const ids = resolveTarget(value.target, ctx);
    return ids.length * value.multiplier;
  }

  return 0;
}

import { DIE_MAX_VALUES } from "../types/gig-die.ts";
