import type {
  TargetDSL,
  CardTargetDSL,
  GigTargetDSL,
  Condition,
  Comparison,
  NumericValue,
  RelativePlayer,
} from "@tcg/cyberpunk-types";
import { legendsInPlay, unitsAndLegendsInPlay } from "@tcg/cyberpunk-types";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import type { CardInstance } from "../types/card-instance.ts";
import { getEffectivePower } from "../active-effects/index.ts";
import { defOf, hasAnyEffectiveCardType } from "../state/lookups.ts";
import { assertNever } from "../types/exhaustive.ts";
import type { DefeatedCardSnapshot } from "../types/game-events.ts";

export interface ResolutionContext {
  readonly state: MatchState;
  readonly sourceCardId: CardInstanceId;
  readonly sourcePlayerId: PlayerId;
  readonly abilityIndex: number;
  readonly contextTargets: Record<string, string[]>;
  readonly boundTargets: Record<string, string[]>;
}

export type TargetOptionValidation = "valid" | "invalid" | "deferred";

export function resolveTarget(target: TargetDSL, ctx: ResolutionContext): string[] {
  switch (target.selector) {
    case "self":
      return [ctx.sourceCardId as string];
    case "host": {
      const card = ctx.state.G.cardIndex[ctx.sourceCardId as string];
      if (card?.meta.attachedToId) return [card.meta.attachedToId as string];
      // Gear {Defeated} fires after detach; host id is carried on the event context.
      return ctx.contextTargets["host"] ?? [];
    }
    case "bound": {
      const rawBound = ctx.boundTargets[target.id] ?? [];
      // Optional sub-filters: narrow the captured binding by card type and/or
      // classifications (e.g. "the ROCKER Units among the selected cards").
      let bound = rawBound;
      if (target.cardTypes && target.cardTypes.length > 0) {
        bound = bound.filter((id) => {
          const card = ctx.state.G.cardIndex[id];
          return card ? hasAnyEffectiveCardType(card, target.cardTypes!) : false;
        });
      }
      if (target.classifications && target.classifications.length > 0) {
        bound = bound.filter((id) => {
          const card = ctx.state.G.cardIndex[id];
          if (!card) return false;
          const classifications = defOf(card).classifications ?? [];
          return target.classifications!.some((c) => classifications.includes(c));
        });
      }
      if (target.keywords && target.keywords.length > 0) {
        bound = bound.filter((id) => {
          const card = ctx.state.G.cardIndex[id];
          if (!card) return false;
          const keywords = defOf(card).keywords ?? [];
          return target.keywords!.some((keyword) => keywords.includes(keyword));
        });
      }
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
    case "attacker": {
      const attackerId =
        ctx.contextTargets["fightAttacker"]?.[0] ?? ctx.state.G.attackState?.attackerId;
      if (!attackerId) return [];
      const card = ctx.state.G.cardIndex[attackerId as string];
      if (!card) return [];
      const def = defOf(card);
      if (target.cardTypes && !hasAnyEffectiveCardType(card, target.cardTypes)) return [];
      if (
        target.classifications &&
        !target.classifications.some((classification) =>
          def.classifications.includes(classification),
        )
      ) {
        return [];
      }
      return [attackerId as string];
    }
    case "defender": {
      const defenderId =
        ctx.contextTargets["fightDefender"]?.[0] ?? ctx.state.G.attackState?.defenderId;
      if (!defenderId) return [];
      const card = ctx.state.G.cardIndex[defenderId as string];
      if (!card) return [];
      const def = defOf(card);
      if (target.cardTypes && !hasAnyEffectiveCardType(card, target.cardTypes)) return [];
      if (
        target.classifications &&
        !target.classifications.some((classification) =>
          def.classifications.includes(classification),
        )
      ) {
        return [];
      }
      return [defenderId as string];
    }
    default:
      return assertNever(target);
  }
}

export function validateTargetOptions(
  target: TargetDSL,
  ctx: ResolutionContext,
  min = 1,
): TargetOptionValidation {
  if (min === 0) return "valid";
  if (targetDependsOnUnresolvedBinding(target, ctx.boundTargets)) return "deferred";
  return resolveTarget(target, ctx).length >= min ? "valid" : "invalid";
}

function targetDependsOnUnresolvedBinding(
  target: TargetDSL,
  boundTargets: Record<string, string[]>,
): boolean {
  switch (target.selector) {
    case "self":
    case "host":
    case "context":
    case "attacker":
    case "defender":
      return false;
    case "bound":
      return boundTargets[target.id] === undefined;
    case "card":
      return [
        target.maxCostOf,
        target.maxPowerOfGigValueOf,
        target.attachedTo,
        target.costEqualsGigValueOf,
        target.powerEqualsGigValueOf,
        target.powerLessThanAnyOf,
      ].some(
        (nestedTarget): nestedTarget is TargetDSL =>
          nestedTarget !== undefined &&
          targetDependsOnUnresolvedBinding(nestedTarget, boundTargets),
      );
    case "gig":
      return [target.sameValueAs, target.valueNotSharedBy, target.sameSidesAs].some(
        (nestedTarget): nestedTarget is TargetDSL =>
          nestedTarget !== undefined &&
          targetDependsOnUnresolvedBinding(nestedTarget, boundTargets),
      );
    default:
      return assertNever(target);
  }
}

function resolveCardTarget(target: CardTargetDSL, ctx: ResolutionContext): string[] {
  // When no controller is specified, target cards across all players.
  const playerId = target.controller ? resolveRelativePlayer(target.controller, ctx) : undefined;
  const candidates = getCardCandidates(playerId, target, ctx);

  return candidates.map((c) => c.instanceId as string);
}

function controllerMatches(
  cardControllerId: PlayerId,
  controller: RelativePlayer | undefined,
  sourcePlayerId: PlayerId,
): boolean {
  switch (controller) {
    case undefined:
      return true;
    case "friendly":
    case "owner":
      return cardControllerId === sourcePlayerId;
    case "rival":
      return cardControllerId !== sourcePlayerId;
    default:
      return assertNever(controller);
  }
}

type CardPredicate = (
  card: CardInstance,
  target: CardTargetDSL,
  ctx: { sourceCardId: CardInstanceId | undefined; sourcePlayerId: PlayerId },
) => boolean;

/** Every selector field is either checked on one card or evaluated in the selection pass. */
const CARD_TARGET_CHECKS = {
  selector: () => true,
  controller: (card, target, ctx) =>
    controllerMatches(card.controllerId, target.controller, ctx.sourcePlayerId),
  zones: (card, target) => !target.zones || target.zones.includes(card.zone),
  cardTypes: (card, target) => !target.cardTypes || hasAnyEffectiveCardType(card, target.cardTypes),
  colors: (card, target) => !target.colors || target.colors.includes(defOf(card).color),
  classifications: (card, target) =>
    !target.classifications ||
    defOf(card).classifications.some((classification) =>
      target.classifications!.includes(classification),
    ),
  keywords: (card, target) =>
    !target.keywords?.length ||
    defOf(card).keywords.some((keyword) => target.keywords!.includes(keyword)),
  state: (card, target) => !target.state || card.meta.spent === (target.state === "spent"),
  face: (card, target) => !target.face || card.meta.faceDown === (target.face === "faceDown"),
  minCost: (card, target) =>
    target.minCost === undefined || (defOf(card).cost ?? 0) >= target.minCost,
  maxCost: (card, target) =>
    target.maxCost === undefined || (defOf(card).cost ?? 0) <= target.maxCost,
  maxCostOf: "selection",
  minPower: "selection",
  maxPower: "selection",
  lowestPower: "selection",
  maxPowerOfGigValueOf: "selection",
  excludeSelf: (card, target, ctx) => !target.excludeSelf || card.instanceId !== ctx.sourceCardId,
  excludeOf: "selection",
  hasAttachedCards: (card, target) =>
    target.hasAttachedCards === undefined ||
    card.meta.attachedGearIds.length > 0 === target.hasAttachedCards,
  hasLag: (card, target) => target.hasLag === undefined || card.meta.hasLag === target.hasLag,
  playedThisTurn: (card, target) =>
    target.playedThisTurn === undefined ||
    (card.meta.playedThisTurn ?? card.meta.hasLag) === target.playedThisTurn,
  attachedTo: "selection",
  costEqualsGigValueOf: "selection",
  powerEqualsGigValueOf: "selection",
  powerLessThanAnyOf: "selection",
  selection: "choice",
} satisfies Record<keyof CardTargetDSL, CardPredicate | "selection" | "choice">;

/** Predicates shared by live selection and event-card matching. */
export function cardMatchesPerCardPredicates(
  card: CardInstance,
  target: CardTargetDSL,
  ctx: { sourceCardId: CardInstanceId | undefined; sourcePlayerId: PlayerId },
): boolean {
  for (const key of Object.keys(CARD_TARGET_CHECKS) as (keyof CardTargetDSL)[]) {
    const check = CARD_TARGET_CHECKS[key];
    if (typeof check === "function" && !check(card, target, ctx)) return false;
  }
  return true;
}

export function cardTargetNeedsSelection(target: CardTargetDSL): boolean {
  return (Object.keys(target) as (keyof CardTargetDSL)[]).some(
    (key) => CARD_TARGET_CHECKS[key] === "selection",
  );
}

/** Keep historical event filters classified when the card target DSL grows. */
const DEFEATED_EVENT_FIELDS = {
  selector: "snapshot",
  controller: "snapshot",
  zones: "snapshot",
  cardTypes: "snapshot",
  colors: "snapshot",
  classifications: "snapshot",
  keywords: "snapshot",
  state: "snapshot",
  face: "snapshot",
  minCost: "snapshot",
  maxCost: "snapshot",
  maxCostOf: "selection",
  minPower: "snapshot",
  maxPower: "snapshot",
  lowestPower: "selection",
  maxPowerOfGigValueOf: "selection",
  excludeSelf: "snapshot",
  excludeOf: "selection",
  hasAttachedCards: "snapshot",
  hasLag: "snapshot",
  playedThisTurn: "snapshot",
  attachedTo: "selection",
  costEqualsGigValueOf: "selection",
  powerEqualsGigValueOf: "selection",
  powerLessThanAnyOf: "selection",
  selection: "selection",
} satisfies Record<keyof CardTargetDSL, "snapshot" | "selection">;

/** Match only the defeated object's event-time facts, never its moved live card. */
export function defeatedCardMatchesFilter(
  snapshot: DefeatedCardSnapshot,
  target: CardTargetDSL,
  sourceCardId: CardInstanceId | undefined,
  sourcePlayerId: PlayerId,
  defeatedCardId: CardInstanceId,
): boolean {
  if (!controllerMatches(snapshot.controllerId, target.controller, sourcePlayerId)) return false;
  if (target.zones && !target.zones.includes(snapshot.zone)) return false;
  if (target.cardTypes && !target.cardTypes.some((type) => snapshot.cardTypes.includes(type)))
    return false;
  if (target.colors && !target.colors.includes(snapshot.color)) return false;
  if (
    target.classifications &&
    !target.classifications.some((type) => snapshot.classifications.includes(type))
  )
    return false;
  if (
    target.keywords?.length &&
    !target.keywords.some((keyword) => snapshot.keywords.includes(keyword))
  )
    return false;
  if (target.state && snapshot.spent !== (target.state === "spent")) return false;
  if (target.face && snapshot.faceDown !== (target.face === "faceDown")) return false;
  if (target.minCost !== undefined && snapshot.cost < target.minCost) return false;
  if (target.maxCost !== undefined && snapshot.cost > target.maxCost) return false;
  if (target.minPower !== undefined && snapshot.effectivePower < target.minPower) return false;
  if (target.maxPower !== undefined && snapshot.effectivePower > target.maxPower) return false;
  if (target.excludeSelf && defeatedCardId === sourceCardId) return false;
  if (
    target.hasAttachedCards !== undefined &&
    snapshot.attachedGearIds.length > 0 !== target.hasAttachedCards
  )
    return false;
  if (target.hasLag !== undefined && snapshot.hasLag !== target.hasLag) return false;
  if (
    target.playedThisTurn !== undefined &&
    (snapshot.playedThisTurn ?? snapshot.hasLag) !== target.playedThisTurn
  )
    return false;
  // These fields need a selection set or another object's historical facts.
  // They cannot be answered from the defeated object's snapshot alone.
  for (const key of Object.keys(target) as (keyof CardTargetDSL)[]) {
    if (DEFEATED_EVENT_FIELDS[key] === "selection") {
      throw new Error(`Unsupported defeated-card event selection predicate: ${key}`);
    }
  }
  return true;
}

function getCardCandidates(
  playerId: PlayerId | undefined,
  target: CardTargetDSL,
  ctx: ResolutionContext,
): CardInstance[] {
  let candidates = Object.values(ctx.state.G.cardIndex).filter(
    (card) =>
      (playerId === undefined || card.controllerId === playerId) &&
      cardMatchesPerCardPredicates(card, target, ctx),
  );

  if (target.maxCostOf) {
    const refIds = resolveTarget(target.maxCostOf, ctx);
    const refCosts = refIds.map((id) => {
      const card = ctx.state.G.cardIndex[id];
      return card ? (defOf(card).cost ?? 0) : 0;
    });
    const maxRefCost = refCosts.length > 0 ? Math.max(...refCosts) : Infinity;
    candidates = candidates.filter((c) => {
      const cost = defOf(c).cost ?? 0;
      return cost <= maxRefCost;
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

  if (target.lowestPower) {
    const lowestPower = Math.min(
      ...candidates.map((candidate) =>
        getEffectivePower(ctx.state, candidate.instanceId as string),
      ),
    );
    candidates = candidates.filter(
      (candidate) => getEffectivePower(ctx.state, candidate.instanceId as string) === lowestPower,
    );
  }

  if (target.maxPowerOfGigValueOf) {
    const gigIds = resolveTarget(
      target.maxPowerOfGigValueOf.selector === "gig"
        ? { ...target.maxPowerOfGigValueOf, amount: "all" }
        : target.maxPowerOfGigValueOf,
      ctx,
    );
    const gigValues = gigIds
      .map((id) => ctx.state.G.gigDice[id])
      .filter(Boolean)
      .map((d) => d.faceValue);
    const maxGigValue = gigValues.length > 0 ? Math.max(...gigValues) : -Infinity;
    candidates = candidates.filter(
      (c) => getEffectivePower(ctx.state, c.instanceId as string) <= maxGigValue,
    );
  }

  if (target.excludeOf) {
    const excluded = new Set(resolveTarget(target.excludeOf, ctx));
    candidates = candidates.filter((c) => !excluded.has(c.instanceId as string));
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

  if (target.powerEqualsGigValueOf) {
    const gigIds = resolveTarget(target.powerEqualsGigValueOf, ctx);
    const gigValues = gigIds
      .map((id) => ctx.state.G.gigDice[id])
      .filter(Boolean)
      .map((d) => d.faceValue);
    candidates = candidates.filter((c) =>
      gigValues.includes(getEffectivePower(ctx.state, c.instanceId as string)),
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

  if (target.valueNotSharedBy) {
    const refIds = resolveTarget(target.valueNotSharedBy, ctx);
    const refValues = refIds
      .map((id) => ctx.state.G.gigDice[id])
      .filter(Boolean)
      .map((d) => d.faceValue);
    dice = dice.filter((d) => !refValues.includes(d.faceValue));
  }

  if (target.sameSidesAs) {
    const refIds = resolveTarget(target.sameSidesAs, ctx);
    const refTypes = refIds
      .map((id) => ctx.state.G.gigDice[id])
      .filter(Boolean)
      .map((d) => d.dieType);
    dice = dice.filter((d) => refTypes.includes(d.dieType));
  }

  if (target.sides !== undefined) {
    const wanted = Array.isArray(target.sides) ? target.sides : [target.sides];
    dice = dice.filter((d) => wanted.includes(d.dieType));
  }

  if (target.minValue !== undefined) {
    dice = dice.filter((d) => d.faceValue >= target.minValue!);
  }

  if (target.maxValue !== undefined) {
    dice = dice.filter((d) => d.faceValue <= target.maxValue!);
  }

  if (target.atMax === true) {
    dice = dice.filter((d) => d.faceValue === DIE_MAX_VALUES[d.dieType]);
  }

  if (target.valueParity !== undefined) {
    const wantEven = target.valueParity === "even";
    dice = dice.filter((d) => (d.faceValue % 2 === 0) === wantEven);
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

function computeGigCount(player: RelativePlayer, ctx: ResolutionContext): number {
  const playerId = resolveRelativePlayer(player, ctx);
  return ctx.state.G.players[playerId as string]?.gigArea.length ?? 0;
}

function computeComparableStreetCred(player: RelativePlayer, ctx: ResolutionContext): number {
  // CR 5.11.4.2 defines Null as smaller than 0. A negative-infinity sentinel
  // preserves that ordering without conflating Null with numeric Street Cred.
  return computeGigCount(player, ctx) === 0
    ? Number.NEGATIVE_INFINITY
    : computeStreetCred(player, ctx);
}

/**
 * Count friendly value-pairs of Gigs without reusing a Gig in more than one
 * pair (CR 6.5.1). Each value bucket therefore contributes `floor(k / 2)`.
 * Visible to the engine's effect handlers so that `forEachFriendlyGigPair`
 * can multiply a wrapped effect.
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
    pairs += Math.floor(count / 2);
  }
  return pairs;
}

export function evaluateCondition(condition: Condition, ctx: ResolutionContext): boolean {
  switch (condition.condition) {
    case "streetCred": {
      const streetCred = computeComparableStreetCred(condition.controller, ctx);
      return compareValues(streetCred, condition.comparison, condition.value);
    }

    case "streetCredComparison": {
      const left = computeComparableStreetCred(condition.controller, ctx);
      const right = computeComparableStreetCred(condition.other, ctx);
      return compareValues(left, condition.comparison, right);
    }

    case "gigCountComparison": {
      const left = computeGigCount(condition.controller, ctx);
      const right = computeGigCount(condition.other, ctx);
      return compareValues(left, condition.comparison, right);
    }

    case "streetCredDifference": {
      if (
        computeGigCount(condition.controller, ctx) === 0 ||
        computeGigCount(condition.other, ctx) === 0
      ) {
        return false;
      }
      const left = computeStreetCred(condition.controller, ctx);
      const right = computeStreetCred(condition.other, ctx);
      return compareValues(Math.abs(left - right), condition.comparison, condition.value);
    }

    case "gigCountDifference": {
      const left = computeGigCount(condition.controller, ctx);
      const right = computeGigCount(condition.other, ctx);
      // Directional: NOT Math.abs. Sign matters ("rival has at least 2 more
      // than you" requires rival − friendly, not |rival − friendly|).
      return compareValues(left - right, condition.comparison, condition.value);
    }

    case "streetCredParity": {
      // CR 5.11.4 / 5.11.4.1 / 2.10.2 — Null Street Cred (no Gigs) is not even or odd.
      if (computeGigCount(condition.controller, ctx) === 0) return false;
      const streetCred = computeStreetCred(condition.controller, ctx);
      return condition.parity === "even" ? streetCred % 2 === 0 : streetCred % 2 !== 0;
    }

    case "allFriendlyLegendsFaceUp": {
      const legends = resolveTarget(legendsInPlay("friendly"), ctx);
      const faceUpLegends = resolveTarget(legendsInPlay("friendly", "faceUp"), ctx);
      return legends.length > 0 && faceUpLegends.length === legends.length;
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
      const compareVal =
        condition.value === "max"
          ? DIE_MAX_VALUES[die.dieType]
          : condition.value === "min"
            ? 1
            : condition.value;
      return compareValues(value, condition.comparison, compareVal as number);
    }

    case "attacking": {
      const ids = resolveTarget(condition.target, ctx);
      if (ids.length === 0) return false;
      const attack = ctx.state.G.attackState;
      if (!attack) return false;
      return attack.attackerId === (ids[0] as CardInstanceId);
    }

    case "hasLag": {
      const ids = resolveTarget(condition.target, ctx);
      if (ids.length === 0) return false;
      const card = ctx.state.G.cardIndex[ids[0]!];
      return card?.meta.hasLag ?? false;
    }

    case "hasStolenGigThisTurn": {
      const ids = resolveTarget(condition.target, ctx);
      if (ids.length === 0) return false;
      const card = ctx.state.G.cardIndex[ids[0]!];
      return card?.meta.hasStolenGigThisTurn ?? false;
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

    case "hasEvenAndOddGigValues": {
      const playerId = resolveRelativePlayer(condition.controller, ctx);
      const player = ctx.state.G.players[playerId as string];
      if (!player) return false;
      const dice = player.gigArea.map((id) => ctx.state.G.gigDice[id as string]).filter(Boolean);
      return dice.some((d) => d.faceValue % 2 === 0) && dice.some((d) => d.faceValue % 2 !== 0);
    }

    case "hasGigCount": {
      const playerId = resolveRelativePlayer(condition.controller, ctx);
      const player = ctx.state.G.players[playerId as string];
      if (!player) return false;
      const matchingGigs = player.gigArea
        .map((id) => ctx.state.G.gigDice[id as string])
        .filter(
          (die) => die && (condition.minValue === undefined || die.faceValue >= condition.minValue),
        );
      return compareValues(matchingGigs.length, condition.comparison, condition.value);
    }

    case "hasEquippedUnitsOrLegends": {
      const equippedCount = resolveTarget(
        { ...unitsAndLegendsInPlay(condition.controller), hasAttachedCards: true },
        ctx,
      ).length;
      return equippedCount >= condition.minCount;
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
      const targetId = ids[0]!;
      if (
        (attack.attackerId as string) !== targetId &&
        (attack.defenderId as string) !== targetId
      ) {
        return false;
      }
      if (attack.kind !== condition.kind) return false;
      if (!condition.opponent) return true;
      const opponentId =
        (attack.attackerId as string) === targetId ? attack.defenderId : attack.attackerId;
      if (!opponentId) return false;
      return resolveTarget(condition.opponent, ctx).includes(opponentId as string);
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

    case "cardStat": {
      const ids = resolveTarget(condition.target, ctx);
      if (ids.length === 0) return false;
      const card = ctx.state.G.cardIndex[ids[0]!];
      if (!card) return false;
      const stat =
        condition.property === "power"
          ? getEffectivePower(ctx.state, ids[0]!)
          : (defOf(card).cost ?? 0);
      return compareValues(stat, condition.comparison, condition.value);
    }

    case "cardName": {
      const ids = resolveTarget(condition.target, ctx);
      return ids.some((id) => {
        const card = ctx.state.G.cardIndex[id];
        return card ? defOf(card).name === condition.name : false;
      });
    }

    case "targetExists": {
      return resolveTarget(condition.target, ctx).length > 0;
    }

    case "targetBecameValue": {
      const ids = resolveTarget(condition.target, ctx);
      const adjustment = ctx.state.G.turnMetadata.currentTrigger?.lastGigAdjustment;
      if (!adjustment || !ids.includes(adjustment.dieId as string)) return false;
      if (adjustment.previousValue === adjustment.newValue) return false;
      const die = ctx.state.G.gigDice[adjustment.dieId as string];
      if (!die) return false;
      const expected =
        condition.value === "min"
          ? 1
          : condition.value === "max"
            ? DIE_MAX_VALUES[die.dieType]
            : condition.value;
      return adjustment.newValue === expected;
    }

    case "gigSides": {
      const ids = resolveTarget(condition.target, ctx);
      const wanted = Array.isArray(condition.sides) ? condition.sides : [condition.sides];
      return ids.some((id) => {
        const die = ctx.state.G.gigDice[id];
        return die ? wanted.includes(die.dieType) : false;
      });
    }

    case "any":
      return condition.of.some((candidate) => evaluateCondition(candidate, ctx));

    case "not":
      return !evaluateCondition(condition.of, ctx);

    case "targetParity": {
      const ids = resolveTarget(condition.target, ctx);
      const firstId = ids[0];
      if (!firstId) return false;
      if (condition.property === "gigValue") {
        const die = ctx.state.G.gigDice[firstId];
        if (!die) return false;
        const isEven = die.faceValue % 2 === 0;
        return condition.parity === "even" ? isEven : !isEven;
      }
      return false;
    }

    case "discardedCountMatchesGig": {
      const discardedCount = ctx.contextTargets["discardedCards"]?.length ?? 0;
      const playerId = resolveRelativePlayer(condition.controller, ctx);
      const player = ctx.state.G.players[playerId as string];
      if (!player) return false;
      return player.gigArea.some(
        (id) => ctx.state.G.gigDice[id as string]?.faceValue === discardedCount,
      );
    }

    case "fixerAreaCount": {
      const playerId = resolveRelativePlayer(condition.controller, ctx);
      const count = ctx.state.G.players[playerId as string]?.fixerArea.length ?? 0;
      return compareValues(count, condition.comparison, condition.value);
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
      return assertNever(op);
  }
}

export function resolveNumericValue(value: NumericValue, ctx: ResolutionContext): number {
  if (typeof value === "number") return value;

  if (value.type === "perCount") {
    const ids = resolveTarget(value.target, ctx);
    return ids.length * value.multiplier;
  }

  if (value.type === "maxGigValue") {
    const playerId = resolveRelativePlayer(value.controller, ctx);
    const player = ctx.state.G.players[playerId as string];
    if (!player) return 0;
    const values = player.gigArea
      .map((id) => ctx.state.G.gigDice[id as string])
      .filter(Boolean)
      .map((die) => die.faceValue);
    return values.length > 0 ? Math.max(...values) : 0;
  }

  if (value.type === "gigValue") {
    const ids = resolveTarget(value.target, ctx);
    const die = ctx.state.G.gigDice[ids[0] as string];
    return die?.faceValue ?? 0;
  }

  if (value.type === "sourcePower") {
    return getEffectivePower(ctx.state, ctx.sourceCardId as string) * (value.multiplier ?? 1);
  }

  if (value.type === "basePlusPerCount") {
    return value.base + resolveTarget(value.target, ctx).length * value.multiplier;
  }

  return assertNever(value);
}

import { DIE_MAX_VALUES } from "@tcg/cyberpunk-types";
