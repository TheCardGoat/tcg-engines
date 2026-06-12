import type { CostModifier, StructuredCardDefinition, TargetDSL } from "@tcg/cyberpunk-types";
import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { MatchState } from "../types/match-state.ts";
import { defOf } from "../state/lookups.ts";
import { resolveTarget, type ResolutionContext } from "../effects/target-resolver.ts";

export interface EffectiveCostModifierDetail {
  id: string;
  sourceCardId: CardInstanceId;
  sourceName: string;
  label: string;
  detail: string;
  modifierLabel: string;
  delta: number;
  matchedCount: number;
}

export interface EffectiveCostDetails {
  printedCost: number;
  effectiveCost: number;
  modifiers: EffectiveCostModifierDetail[];
}

interface CostModifierEntry {
  id: string;
  sourceCardId: CardInstanceId;
  modifier: CostModifier;
}

/**
 * Compute the eddie cost a player must pay to play this card, after
 * applying any card-level cost modifier. The printed `cost` on the
 * definition stays at its base value — the modifier is evaluated against
 * the controller's live state at play-time.
 */
export function computeEffectiveCost(
  state: MatchState,
  cardId: CardInstanceId,
  playerId: PlayerId,
): number {
  return computeEffectiveCostDetails(state, cardId, playerId).effectiveCost;
}

/**
 * Compute the live play cost and explain any card-level modifier in player
 * readable terms so UI surfaces do not need to understand the target DSL.
 */
export function computeEffectiveCostDetails(
  state: MatchState,
  cardId: CardInstanceId,
  playerId: PlayerId,
): EffectiveCostDetails {
  const card = state.G.cardIndex[cardId as string];
  if (!card) {
    return { printedCost: 0, effectiveCost: 0, modifiers: [] };
  }
  const def = defOf(card) as StructuredCardDefinition;
  const base = def.cost ?? 0;
  const ctx: ResolutionContext = {
    state,
    sourceCardId: cardId,
    sourcePlayerId: playerId,
    abilityIndex: -1,
    contextTargets: {},
    boundTargets: {},
  };

  const modifiers: CostModifierEntry[] = [
    ...(def.costModifier
      ? [
          {
            id: `${cardId as string}:costModifier`,
            sourceCardId: cardId,
            modifier: def.costModifier,
          },
        ]
      : []),
    ...state.G.activeEffects
      .filter(
        (effect) =>
          effect.kind === "costModifier" &&
          effect.playerId === playerId &&
          effect.costModifier &&
          effect.appliesTo &&
          resolveTarget(effect.appliesTo, ctx).includes(cardId as string),
      )
      .map((effect) => ({
        id: effect.id,
        sourceCardId: effect.sourceCardId,
        modifier: effect.costModifier!,
      })),
  ];

  if (modifiers.length === 0) {
    return { printedCost: base, effectiveCost: base, modifiers: [] };
  }

  let runningCost = base;
  const details: EffectiveCostModifierDetail[] = [];
  for (const entry of modifiers) {
    const modifier = entry.modifier;
    const before = runningCost;
    const applied = applyCostModifier(ctx, modifier, before);
    runningCost = applied.effectiveCost;
    const delta = runningCost - before;
    if (delta === 0) continue;
    const sourceCard = state.G.cardIndex[entry.sourceCardId as string];
    const sourceName = sourceCard ? defOf(sourceCard).displayName : def.displayName;
    details.push({
      id: entry.id,
      sourceCardId: entry.sourceCardId,
      sourceName,
      label: `${signedNumber(delta)} COST`,
      detail: buildCostModifierDetail(sourceName, modifier, applied.matchedCount, delta),
      modifierLabel: signedNumber(delta),
      delta,
      matchedCount: applied.matchedCount,
    });
  }

  return {
    printedCost: base,
    effectiveCost: runningCost,
    modifiers: details,
  };
}

export function consumeCostModifierUse(
  state: MatchState,
  cardId: CardInstanceId,
  playerId: PlayerId,
): void {
  const ctx: ResolutionContext = {
    state,
    sourceCardId: cardId,
    sourcePlayerId: playerId,
    abilityIndex: -1,
    contextTargets: {},
    boundTargets: {},
  };

  for (const effect of state.G.activeEffects) {
    if (
      effect.kind !== "costModifier" ||
      effect.playerId !== playerId ||
      !effect.costModifier ||
      !effect.appliesTo ||
      !resolveTarget(effect.appliesTo, ctx).includes(cardId as string) ||
      effect.remainingUses === undefined
    ) {
      continue;
    }
    effect.remainingUses -= 1;
  }
  state.G.activeEffects = state.G.activeEffects.filter(
    (effect) =>
      effect.kind !== "costModifier" ||
      effect.remainingUses === undefined ||
      effect.remainingUses > 0,
  );
}

function applyCostModifier(
  ctx: ResolutionContext,
  modifier: CostModifier,
  currentCost: number,
): { effectiveCost: number; matchedCount: number } {
  if (modifier.reducer === "perTargetCount") {
    const count = resolveTarget(modifier.target, ctx).length;
    const reduced = currentCost - count * modifier.reductionPerCount;
    const effectiveCost = Math.max(modifier.min, reduced);
    return { effectiveCost, matchedCount: count };
  }

  return { effectiveCost: currentCost, matchedCount: 0 };
}

function buildCostModifierDetail(
  sourceName: string,
  modifier: CostModifier,
  count: number,
  delta: number,
): string {
  if (modifier.reducer === "perTargetCount") {
    const targetLabel = formatTargetLabel(modifier.target, count);
    const perCount = modifier.reductionPerCount;
    const unit = perCount === 1 ? "cost" : "cost each";
    const minimum = modifier.min > 0 ? ` Minimum cost ${modifier.min}.` : "";
    return `${sourceName}: ${signedNumber(delta)} cost from ${count} ${targetLabel} (-${perCount} ${unit}).${minimum}`;
  }
  return `${sourceName}: ${signedNumber(delta)} cost.`;
}

function formatTargetLabel(target: TargetDSL, count: number): string {
  if (target.selector === "gig") {
    const owner = formatController(target.controller);
    const value =
      target.minValue !== undefined
        ? ` with value ${target.minValue}+`
        : target.maxValue !== undefined
          ? ` with value ${target.maxValue} or less`
          : "";
    return `${owner}${plural("Gig", count)}${value}`;
  }

  if (target.selector === "card") {
    const owner = formatController(target.controller);
    const type =
      target.cardTypes && target.cardTypes.length === 1
        ? target.cardTypes[0]!.charAt(0).toUpperCase() + target.cardTypes[0]!.slice(1)
        : "card";
    return `${owner}${plural(type, count)}`;
  }

  return plural("matched target", count);
}

function formatController(controller: "friendly" | "rival" | "owner" | undefined): string {
  if (!controller || controller === "owner") return "";
  return `${controller} `;
}

function plural(label: string, count: number): string {
  return count === 1 ? label : `${label}s`;
}

function signedNumber(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}
