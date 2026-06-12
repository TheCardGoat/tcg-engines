import type {
  Card,
  CardEffect,
  CardType,
  EffectCondition,
  EffectDirective,
  Zone,
} from "@tcg/gundam-types";
import type { GundamG } from "../../../types.ts";
import type { CardInstanceId } from "../../../../types/branded.ts";
import type { RuntimeCard } from "../../../../types/base-card.ts";
import type { FrameworkReadAPI, FrameworkWriteAPI } from "../../../../types/move-types.ts";
import { buildTargetResolutionContext } from "../../../rules/derived-state.ts";
import { evaluateCondition, evaluateTargetFilter } from "../../../../runtime/target-dsl.ts";

export function getAllBattleAreaRuntimeCards(
  g: GundamG,
  framework: FrameworkReadAPI,
): RuntimeCard[] {
  const cards: RuntimeCard[] = [];
  for (const playerId of Object.keys(g.players)) {
    const ids = framework.zones.getCards({ zone: "battleArea", playerId });
    for (const id of ids) {
      const card = framework.cards.get(id);
      if (card) cards.push(card);
    }
  }
  return cards;
}

/**
 * Check if a prevent-damage continuous effect blocks damage from the
 * given source. Accepts a `damageType` context ("battle" or "effect")
 * so effects gated on damage kind are respected.
 *
 * `sourceCardType` on the effect filters by the source card's card type
 * (e.g. "command" for "can't receive effect damage from enemy Commands").
 */
export function hasDamagePreventionFor(
  targetCardId: string,
  attackerCardId: string,
  g: GundamG,
  framework: FrameworkReadAPI,
  damageType: "battle" | "effect" = "battle",
): boolean {
  // 1. Check explicit ContinuousEffectEntry records (pushed by executor).
  for (const effect of g.continuousEffects) {
    if (effect.targetId !== targetCardId) continue;
    const p = effect.payload;
    if (p.kind !== "prevent-damage") continue;

    // Damage-type gate: if the effect specifies a damageType, it only
    // prevents that kind.
    if (p.damageType && p.damageType !== damageType) continue;

    // Source card-type gate: if the effect specifies a sourceCardType,
    // the source must match.
    if (p.sourceCardType) {
      const sourceDef = framework.cards.getDefinition(attackerCardId) as Card | undefined;
      if (!sourceDef || sourceDef.type !== (p.sourceCardType as CardType)) continue;
    }

    if (!p.unitFilter) return true;
    const targetOwnerId = framework.cards.getOwner(targetCardId) ?? "";
    const tgtCtx = buildTargetResolutionContext(g, targetOwnerId, framework, {
      sourceCardId: targetCardId,
    });
    const battleCards = getAllBattleAreaRuntimeCards(g, framework);
    const matches = evaluateTargetFilter(p.unitFilter, battleCards, tgtCtx);
    if (matches.includes(attackerCardId as CardInstanceId)) return true;
  }

  // 2. Inline evaluation of `type: "constant"` preventDamage effects on
  //    cards in play — mirrors the approach in getEffectiveStats for
  //    statModifier / grantKeyword. This covers cards like Forbidden
  //    Gundam whose preventDamage is a constant effect that re-evaluates
  //    its conditions each time damage would be applied.
  if (inlineConstantPreventDamage(targetCardId, attackerCardId, g, framework, damageType)) {
    return true;
  }

  return false;
}

export function applyDamageReduction(
  targetCardId: string,
  sourceCardId: string,
  amount: number,
  g: GundamG,
  framework: FrameworkWriteAPI,
  damageType: "battle" | "effect",
): number {
  let remaining = amount;
  const targetOwnerId = framework.cards.getOwner(targetCardId) as string | undefined;
  const sourceOwnerId = framework.cards.getOwner(sourceCardId) as string | undefined;
  const consumedIds: string[] = [];

  for (const effect of g.continuousEffects) {
    if (remaining <= 0) break;
    if (effect.targetId !== targetCardId) continue;
    const p = effect.payload;
    if (p.kind !== "damage-reduction") continue;
    if (p.damageType && p.damageType !== damageType) continue;
    if (
      p.source === "enemy" &&
      (!targetOwnerId || !sourceOwnerId || targetOwnerId === sourceOwnerId)
    ) {
      continue;
    }

    if (p.sourceCardType) {
      const sourceDef = framework.cards.getDefinition(sourceCardId) as Card | undefined;
      if (!sourceDef || sourceDef.type !== (p.sourceCardType as CardType)) continue;
    }

    remaining = Math.max(0, remaining - p.amount);
    consumedIds.push(effect.id);
  }

  if (consumedIds.length > 0) {
    const consumed = new Set(consumedIds);
    g.continuousEffects = g.continuousEffects.filter((effect) => !consumed.has(effect.id));
  }

  if (remaining <= 0) return 0;
  return Math.max(
    0,
    remaining - inlineConstantDamageReduction(targetCardId, sourceCardId, g, framework, damageType),
  );
}

function getAllBattleAreaAndBaseRuntimeCards(
  g: GundamG,
  framework: FrameworkReadAPI,
): RuntimeCard[] {
  const cards: RuntimeCard[] = [];
  for (const playerId of Object.keys(g.players)) {
    for (const zone of ["battleArea", "baseSection"] as const) {
      const ids = framework.zones.getCards({ zone, playerId });
      for (const id of ids) {
        const card = framework.cards.get(id);
        if (card) cards.push(card);
      }
    }
  }
  return cards;
}

/**
 * Scan in-play cards' constant effects for `preventDamage` directives
 * whose conditions currently hold. This covers constant-type effects
 * that are NOT pre-pushed to `continuousEffects` (the executor only
 * pushes preventDamage entries for triggered/command effects; constant
 * effects are evaluated inline, mirroring `getEffectiveStats`).
 *
 * Looks at the target card itself and at its paired pilot (if any) —
 * a pilot's constant preventDamage effect applies to the paired unit
 * (rule 3-3-9-1).
 */
function inlineConstantPreventDamage(
  targetCardId: string,
  attackerCardId: string,
  g: GundamG,
  framework: FrameworkReadAPI,
  damageType: "battle" | "effect",
): boolean {
  const targetOwnerId = (framework.cards.getOwner(targetCardId) ?? "") as string;
  const battleCards = getAllBattleAreaAndBaseRuntimeCards(g, framework);

  // Collect source IDs whose constant effects apply to this target:
  // the card itself + its paired pilot. Also scan base-section cards
  // owned by the same player (e.g. Argama's "This Base can't receive
  // enemy effect damage" is a self-targeting constant on the base).
  const sourceIds = [targetCardId];
  const pilotId = g.pilotAssignments[targetCardId];
  if (pilotId) sourceIds.push(pilotId);
  // Include own bases — a base's constant preventDamage targets itself.
  const bases = framework.zones.getCards({ zone: "baseSection", playerId: targetOwnerId });
  for (const baseId of bases) {
    if (!sourceIds.includes(baseId)) sourceIds.push(baseId);
  }

  for (const sourceId of sourceIds) {
    const def = framework.cards.getDefinition(sourceId) as Card | undefined;
    if (!def?.effects?.length) continue;

    const ctx = buildTargetResolutionContext(g, targetOwnerId, framework, {
      sourceCardId: sourceId,
    });

    for (const effect of def.effects as CardEffect[]) {
      if (effect.type !== "constant") continue;

      // Check activation conditions.
      if (effect.activation.conditions?.length) {
        const allMet = effect.activation.conditions.every((cond) =>
          evaluateCondition(cond as EffectCondition, ctx),
        );
        if (!allMet) continue;
      }

      for (const directive of effect.directives) {
        if (!("action" in directive)) continue;
        const action = (directive as EffectDirective).action;
        if (action.action !== "preventDamage") continue;

        // Damage-type gate.
        if (action.damageType && action.damageType !== damageType) continue;

        // Source card-type gate.
        if (action.sourceCardType) {
          const sourceDef = framework.cards.getDefinition(attackerCardId) as Card | undefined;
          if (!sourceDef || sourceDef.type !== (action.sourceCardType as CardType)) continue;
        }

        // Target filter: confirm the target card matches the action's
        // target filter (usually `{ owner: "self" }`).
        const matchedTargets = evaluateTargetFilter(action.target, battleCards, ctx);
        if (!matchedTargets.includes(targetCardId as CardInstanceId)) continue;

        // Unit filter: if present, the attacker must match.
        if (!action.unitFilter) return true;
        const matchedAttackers = evaluateTargetFilter(action.unitFilter, battleCards, ctx);
        if (matchedAttackers.includes(attackerCardId as CardInstanceId)) return true;
      }
    }
  }
  return false;
}

function inlineConstantDamageReduction(
  targetCardId: string,
  sourceCardId: string,
  g: GundamG,
  framework: FrameworkWriteAPI,
  damageType: "battle" | "effect",
): number {
  const targetOwnerId = (framework.cards.getOwner(targetCardId) ?? "") as string;
  const sourceOwnerId = framework.cards.getOwner(sourceCardId) as string | undefined;
  const battleCards = getAllBattleAreaAndBaseRuntimeCards(g, framework);
  const sourceIds = [targetCardId];
  const pilotId = g.pilotAssignments[targetCardId];
  if (pilotId) sourceIds.push(pilotId);
  const bases = framework.zones.getCards({ zone: "baseSection", playerId: targetOwnerId });
  for (const baseId of bases) {
    if (!sourceIds.includes(baseId)) sourceIds.push(baseId);
  }

  let total = 0;
  for (const sourceId of sourceIds) {
    const def = framework.cards.getDefinition(sourceId) as Card | undefined;
    if (!def?.effects?.length) continue;

    const ctx = buildTargetResolutionContext(g, targetOwnerId, framework, {
      sourceCardId: sourceId,
    });

    for (const [effectIndex, effect] of (def.effects as CardEffect[]).entries()) {
      if (effect.type !== "constant") continue;

      if (effect.activation.conditions?.length) {
        const allMet = effect.activation.conditions.every((cond) =>
          evaluateCondition(cond as EffectCondition, ctx),
        );
        if (!allMet) continue;
      }

      for (const directive of effect.directives) {
        if (!("action" in directive)) continue;
        const action = (directive as EffectDirective).action;
        if (action.action !== "reduceNextDamage") continue;
        if (action.damageType && action.damageType !== damageType) continue;
        if (action.source === "enemy" && (!sourceOwnerId || sourceOwnerId === targetOwnerId)) {
          continue;
        }

        const matchedTargets = evaluateTargetFilter(action.target, battleCards, ctx);
        if (!matchedTargets.includes(targetCardId as CardInstanceId)) continue;
        if (effect.activation.restrictions?.some((r) => r.type === "oncePerTurn")) {
          const meta = framework.cards.getMeta(sourceId);
          const uses = (meta?.abilityUsesThisTurn ?? {}) as Record<string, number>;
          const key = String(effectIndex);
          if ((uses[key] ?? 0) >= 1) continue;
          framework.cards.patchMeta(sourceId, {
            abilityUsesThisTurn: { ...uses, [key]: (uses[key] ?? 0) + 1 },
          });
        }
        total += action.amount;
      }
    }
  }

  return total;
}

export function hasZoneDamagePreventionFor(
  zone: Zone,
  defenderPlayerId: string,
  attackerCardId: string,
  g: GundamG,
  framework: FrameworkReadAPI,
): boolean {
  for (const effect of g.continuousEffects) {
    if (effect.targetId !== defenderPlayerId) continue;
    const p = effect.payload;
    if (p.kind !== "prevent-damage-to-zone") continue;
    if (p.zone !== zone) continue;
    const tgtCtx = buildTargetResolutionContext(g, defenderPlayerId, framework);
    const battleCards = getAllBattleAreaRuntimeCards(g, framework);
    const matches = evaluateTargetFilter(p.unitFilter, battleCards, tgtCtx);
    if (matches.includes(attackerCardId as CardInstanceId)) return true;
  }
  if (inlineConstantZoneDamagePrevention(zone, defenderPlayerId, attackerCardId, g, framework)) {
    return true;
  }
  return false;
}

function inlineConstantZoneDamagePrevention(
  zone: Zone,
  defenderPlayerId: string,
  attackerCardId: string,
  g: GundamG,
  framework: FrameworkReadAPI,
): boolean {
  const sourceIds = [
    ...framework.zones.getCards({ zone: "battleArea", playerId: defenderPlayerId }),
    ...framework.zones.getCards({ zone: "baseSection", playerId: defenderPlayerId }),
  ];
  const battleCards = getAllBattleAreaRuntimeCards(g, framework);

  for (const sourceId of sourceIds) {
    const def = framework.cards.getDefinition(sourceId) as Card | undefined;
    if (!def?.effects?.length) continue;

    const tgtCtx = buildTargetResolutionContext(g, defenderPlayerId, framework, {
      sourceCardId: sourceId,
    });

    for (const effect of def.effects as CardEffect[]) {
      if (effect.type !== "constant") continue;

      if (effect.activation.conditions?.length) {
        const allMet = effect.activation.conditions.every((cond) =>
          evaluateCondition(cond as EffectCondition, tgtCtx),
        );
        if (!allMet) continue;
      }

      for (const directive of effect.directives) {
        if (!("action" in directive)) continue;
        const action = (directive as EffectDirective).action;
        if (action.action !== "preventDamageToZone") continue;
        if (action.zone !== zone) continue;

        const matches = evaluateTargetFilter(action.unitFilter, battleCards, tgtCtx);
        if (matches.includes(attackerCardId as CardInstanceId)) return true;
      }
    }
  }

  return false;
}
