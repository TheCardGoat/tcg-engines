import type {
  ModifyPowerEffect,
  MultiplyPowerEffect,
  GrantRuleEffect,
  RuleModifier,
  StructuredCardDefinition,
} from "@tcg/cyberpunk-types";
import type { MatchState, ActiveEffect } from "../types/match-state.ts";
import type { PlayerId, CardInstanceId } from "../types/branded.ts";
import {
  resolveTarget,
  evaluateCondition,
  resolveNumericValue,
  type ResolutionContext,
} from "../effects/target-resolver.ts";
import { defOf } from "../state/lookups.ts";

export function recomputeActiveEffects(state: MatchState): void {
  const G = state.G;

  // Collect all active source cards from field + legendArea.
  const sourceCandidates: (typeof G.cardIndex)[string][] = [];
  for (const player of Object.values(G.players)) {
    if (!player) continue;
    for (const zone of ["field", "legendArea"] as const) {
      for (const cardId of player.zones[zone] ?? []) {
        const card = G.cardIndex[cardId as string];
        if (!card) continue;
        // Face-down legends are not yet called — their abilities are inactive.
        if (defOf(card).type === "legend" && card.meta.faceDown) continue;
        sourceCandidates.push(card);
      }
    }
  }

  // Fixed-point iteration — repeat until the static effect set stabilises.
  // This handles conditions that depend on computed power (e.g. "units with 7+ power get +2").
  //
  // Each pass computes new static entries into a scratch array while G.activeEffects
  // (containing imperative + the *previous* pass's static) stays unchanged for the
  // duration of the pass. This means getEffectivePower sees a consistent snapshot
  // throughout every pass, eliminating order-dependency in power-threshold conditions.
  //
  // Termination uses a content signature (sorted kind:source:target:value tuples)
  // rather than just entry count, so changes in target sets or modifier values
  // without a count change are still detected.
  const MAX_PASSES = 5;
  let prevSignature = "";

  // Strip stale static entries so pass 1 evaluates against baseline power values.
  G.activeEffects = G.activeEffects.filter((e) => e.origin === "imperative");

  for (let pass = 0; pass < MAX_PASSES; pass++) {
    const scratchStatic: ActiveEffect[] = [];

    for (const sourceCard of sourceCandidates) {
      const def = defOf(sourceCard) as StructuredCardDefinition;
      if (!def.abilities?.length) continue;

      for (let abilityIndex = 0; abilityIndex < def.abilities.length; abilityIndex++) {
        const ability = def.abilities[abilityIndex]!;
        if (ability.kind !== "static") continue;

        const ctx: ResolutionContext = {
          state,
          sourceCardId: sourceCard.instanceId,
          sourcePlayerId: sourceCard.controllerId,
          abilityIndex,
          contextTargets: {},
          boundTargets: {},
        };

        // Evaluate ability-level conditions, deferring "attacking" to per-target check.
        const abilityConditionsOk =
          !ability.conditions?.length ||
          ability.conditions.every((cond) => {
            if (cond.condition === "attacking" || cond.condition === "fightKind") return true;
            return evaluateCondition(cond, ctx);
          });
        if (!abilityConditionsOk) continue;

        for (const rawEffect of ability.effects) {
          if (
            rawEffect.effect !== "modifyPower" &&
            rawEffect.effect !== "multiplyPower" &&
            rawEffect.effect !== "grantRule"
          )
            continue;

          // Evaluate effect-level conditions, deferring "attacking" and "fightKind" to per-target check.
          const effectConditions = rawEffect.conditions;
          const effectConditionsOk =
            !effectConditions?.length ||
            effectConditions.every((cond) => {
              if (cond.condition === "attacking" || cond.condition === "fightKind") return true;
              return evaluateCondition(cond, ctx);
            });
          if (!effectConditionsOk) continue;

          const targets = resolveTarget(rawEffect.target, ctx);

          const hasAttackingCond =
            ability.conditions?.some(
              (c) => c.condition === "attacking" || c.condition === "fightKind",
            ) ||
            rawEffect.conditions?.some(
              (c) => c.condition === "attacking" || c.condition === "fightKind",
            );

          for (const targetId of targets) {
            // Per-target: evaluate the "attacking" and "fightKind" conditions specifically for this target.
            if (hasAttackingCond) {
              const attack = G.attackState;
              if (!attack) continue;
              const isAttacker = (attack.attackerId as string) === targetId;
              const isDefender = (attack.defenderId as string) === targetId;
              const attackingConds = [
                ...(ability.conditions ?? []),
                ...(rawEffect.conditions ?? []),
              ].filter((c) => c.condition === "attacking");
              if (attackingConds.length > 0 && !isAttacker) continue;
              if (!isAttacker && !isDefender) continue;

              const fightKindConds = [
                ...(ability.conditions ?? []),
                ...(rawEffect.conditions ?? []),
              ].filter((c) => c.condition === "fightKind");
              const allFightKindOk = fightKindConds.every((fkc) => evaluateCondition(fkc, ctx));
              if (!allFightKindOk) continue;
            }

            if (rawEffect.effect === "modifyPower") {
              const modEffect = rawEffect as ModifyPowerEffect;
              const value = resolveNumericValue(modEffect.value, ctx);
              scratchStatic.push({
                id: `static-${sourceCard.instanceId as string}-${targetId}-${scratchStatic.length}`,
                sourceCardId: sourceCard.instanceId,
                targetCardId: targetId as CardInstanceId,
                kind: "powerModifier",
                powerModifier: value,
                duration: "continuous",
                origin: "static",
                abilityIndex,
              });
            } else if (rawEffect.effect === "multiplyPower") {
              const mulEffect = rawEffect as MultiplyPowerEffect;
              scratchStatic.push({
                id: `static-${sourceCard.instanceId as string}-${targetId}-${scratchStatic.length}`,
                sourceCardId: sourceCard.instanceId,
                targetCardId: targetId as CardInstanceId,
                kind: "powerMultiplier",
                powerMultiplier: mulEffect.multiplier,
                duration: "continuous",
                origin: "static",
                abilityIndex,
              });
            } else if (rawEffect.effect === "grantRule") {
              const ruleEffect = rawEffect as GrantRuleEffect;
              scratchStatic.push({
                id: `static-${sourceCard.instanceId as string}-${targetId}-${scratchStatic.length}`,
                sourceCardId: sourceCard.instanceId,
                targetCardId: targetId as CardInstanceId,
                kind: "grantRule",
                rule: ruleEffect.rule,
                duration: "continuous",
                origin: "static",
                abilityIndex,
              });
            }
          }
        }
      }
    }

    // Stable content signature: sorted tuples of kind + source + target + value/rule.
    // Sorting makes the check order-independent; including the modifier value catches
    // cases where targets change without the entry count changing.
    const newSignature = scratchStatic
      .map(
        (e) =>
          `${e.kind}:${e.sourceCardId as string}:${e.targetCardId as string}:${e.powerModifier ?? e.powerMultiplier ?? e.rule ?? ""}`,
      )
      .sort()
      .join("|");

    // Swap: replace static entries with this pass's results so the next pass
    // evaluates against a fresh, internally-consistent snapshot.
    G.activeEffects = [
      ...G.activeEffects.filter((e) => e.origin === "imperative"),
      ...scratchStatic,
    ];

    if (newSignature === prevSignature) break; // fixed point reached
    prevSignature = newSignature;
  }
}

export function getEffectivePower(state: MatchState, cardId: string): number {
  const card = state.G.cardIndex[cardId];
  if (!card) return 0;

  const basePower = defOf(card).power ?? 0;
  const permanentMod = card.meta.powerModifier;

  const gearPower = card.meta.attachedGearIds.reduce((sum, gearId) => {
    const gear = state.G.cardIndex[gearId as string];
    return sum + (gear ? (defOf(gear).power ?? 0) : 0);
  }, 0);

  const activeEffectMod = state.G.activeEffects
    .filter((e) => (e.targetCardId as string) === cardId && e.kind === "powerModifier")
    .reduce((sum, e) => sum + (e.powerModifier ?? 0), 0);

  const activeEffectMul = state.G.activeEffects
    .filter((e) => (e.targetCardId as string) === cardId && e.kind === "powerMultiplier")
    .reduce((mul, e) => mul * (e.powerMultiplier ?? 1), 1);

  const preMul = basePower + permanentMod + gearPower + activeEffectMod;
  const totalMul = (card.meta.powerMultiplier ?? 1) * activeEffectMul;
  const postMul = preMul * totalMul;

  return Math.max(postMul, 0);
}

export function getEffectiveRules(state: MatchState, cardId: string): RuleModifier[] {
  const card = state.G.cardIndex[cardId];
  if (!card) return [];

  const intrinsic: RuleModifier[] = defOf(card).keywords as RuleModifier[];
  const granted = state.G.activeEffects
    .filter((e) => (e.targetCardId as string) === cardId && e.kind === "grantRule")
    .map((e) => e.rule!)
    .filter(Boolean);

  // Propagate keyword abilities from attached gear to the host
  const gearKeywords: RuleModifier[] = card.meta.attachedGearIds.reduce((keywords, gearId) => {
    const gearCard = state.G.cardIndex[gearId as string];
    if (!gearCard || (gearCard.meta.attachedToId as string) !== cardId) {
      return keywords;
    }

    for (const ability of (defOf(gearCard) as any).abilities ?? []) {
      if (ability.kind === "keyword" && ability.source?.selector === "host") {
        keywords.push(ability.keyword as RuleModifier);
      }
    }

    return keywords;
  }, [] as RuleModifier[]);

  return [...new Set([...intrinsic, ...granted, ...gearKeywords])];
}

export function getEffectiveKeywords(state: MatchState, cardId: string): string[] {
  return getEffectiveRules(state, cardId).filter(isKeywordRule);
}

export function markDefeatAtEndOfTurnIfAttacked(state: MatchState, cardId: CardInstanceId): void {
  for (const effect of state.G.activeEffects) {
    if (
      effect.kind === "defeatAtEndOfTurnIfAttacked" &&
      (effect.targetCardId as string) === (cardId as string)
    ) {
      effect.triggered = true;
    }
  }
}

export function getCardsMarkedForEndTurnDefeat(state: MatchState): CardInstanceId[] {
  const ids = state.G.activeEffects
    .filter((effect) => effect.kind === "defeatAtEndOfTurnIfAttacked" && effect.triggered)
    .map((effect) => effect.targetCardId);
  return [...new Set(ids)];
}

export function getStreetCredForPlayer(state: MatchState, playerId: PlayerId): number {
  const player = state.G.players[playerId as string];
  if (!player) return 0;

  return player.gigArea.reduce((sum, dieId) => {
    const die = state.G.gigDice[dieId as string];
    return sum + (die?.faceValue ?? 0);
  }, 0);
}

export function getGigCount(state: MatchState, playerId: PlayerId): number {
  const player = state.G.players[playerId as string];
  if (!player) return 0;
  return player.gigArea.length;
}

function isKeywordRule(rule: RuleModifier): boolean {
  return rule === "blocker" || rule === "goSolo" || rule === "adrenaline" || rule === "quick";
}
