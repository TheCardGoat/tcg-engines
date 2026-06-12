/**
 * Static Effect Registry
 *
 * Replaces 16 independent O(N²) scans with a single build pass that
 * materializes every active static effect into per-target buckets.
 * All consumers then do O(1) map lookups instead of scanning cardIndex.
 *
 * Build strategy:
 *   Pre-pass  — collect suppress-ability effects into a suppression index
 *   Pass 1    — materialize stat-layer effects (modify-stat, stat-floor,
 *               property-modification[singer-threshold])
 *   Pass 2    — materialize everything else (keywords, classifications,
 *               restrictions, cost modifiers, granted abilities)
 *               Conditions that check derived stats use Pass 1 results.
 */

import type { CardInstanceId, PlayerId } from "#core";
import type {
  ActivatedAbilityDefinition,
  LorcanaCardDefinition,
  ModifyStatEffect,
  StatFloorEffect,
} from "@tcg/lorcana-types";
import type { Classification } from "@tcg/lorcana-types";
import {
  isCardInPlay,
  matchesStaticAbilityTarget,
  matchesLegacyStaticTarget,
  evaluateStaticCondition,
  resolveStaticVariableAmount,
} from "../runtime-moves/rules/static-ability-utils";
import {
  flattenDerivedState,
  matchesLegacyStaticStatTarget,
  resolveStaticStatModifierAmount,
  resolveStaticStatFloorMinimum,
  getProjectionPlayerIds,
  type DerivedStateContext,
} from "./derived-state";
import { getActiveStatModifierTotal } from "../runtime-moves/effects/continuous-effects";

// ============================================================================
// Types
// ============================================================================

export type MaterializedEffectKind =
  | "modify-stat"
  | "stat-floor"
  | "damage-source-stat-override"
  | "gain-keyword"
  | "lose-keyword"
  | "grant-classification"
  | "grant-ability"
  | "grant-abilities-while-here"
  | "restriction"
  | "cost-reduction"
  | "cost-increase"
  | "property-modification";

export interface MaterializedStaticEffect {
  sourceId: CardInstanceId;
  sourceControllerId: PlayerId;
  /** Index into the source card's abilities array */
  abilityIndex: number;
  /** Named ability identifier (for attribution UI) */
  abilityName?: string;
  /** Canonical definition ID of the source card (for attribution UI) */
  sourceDefinitionId?: string;
  kind: MaterializedEffectKind;
  payload: Record<string, unknown>;
}

export interface StaticEffectRegistry {
  /** Effects keyed by the target card instance ID */
  byTarget: Map<CardInstanceId, MaterializedStaticEffect[]>;
  /** Effects keyed by the target player ID (CONTROLLER / OPPONENTS routing) */
  byPlayer: Map<PlayerId, MaterializedStaticEffect[]>;
  /** Global effects (ALL_PLAYERS targets, challenge-limit, cost-increase) */
  global: MaterializedStaticEffect[];
  /**
   * Effects keyed by the source card instance ID.
   * Enables O(1) attribution queries ("what effects is card X emitting?")
   * and provides the foundation for future incremental cleanup when a card
   * leaves play.
   */
  bySource: Map<CardInstanceId, MaterializedStaticEffect[]>;
}

// ============================================================================
// Accessors
// ============================================================================

export function getEffectsForCard(
  registry: StaticEffectRegistry,
  cardId: CardInstanceId,
  kind?: MaterializedEffectKind,
): MaterializedStaticEffect[] {
  const effects = registry.byTarget.get(cardId);
  if (!effects) return [];
  return kind ? effects.filter((e) => e.kind === kind) : effects;
}

export function getEffectsForPlayer(
  registry: StaticEffectRegistry,
  playerId: PlayerId,
  kind?: MaterializedEffectKind,
): MaterializedStaticEffect[] {
  const effects = registry.byPlayer.get(playerId);
  if (!effects) return [];
  return kind ? effects.filter((e) => e.kind === kind) : effects;
}

export function getEffectsFromCard(
  registry: StaticEffectRegistry,
  sourceId: CardInstanceId,
  kind?: MaterializedEffectKind,
): MaterializedStaticEffect[] {
  const effects = registry.bySource.get(sourceId);
  if (!effects) return [];
  return kind ? effects.filter((e) => e.kind === kind) : effects;
}

// ============================================================================
// Internal helpers
// ============================================================================

function addToTarget(
  byTarget: Map<CardInstanceId, MaterializedStaticEffect[]>,
  targetId: CardInstanceId,
  effect: MaterializedStaticEffect,
): void {
  let arr = byTarget.get(targetId);
  if (!arr) {
    arr = [];
    byTarget.set(targetId, arr);
  }
  arr.push(effect);
}

function addToPlayer(
  byPlayer: Map<PlayerId, MaterializedStaticEffect[]>,
  playerId: PlayerId,
  effect: MaterializedStaticEffect,
): void {
  let arr = byPlayer.get(playerId);
  if (!arr) {
    arr = [];
    byPlayer.set(playerId, arr);
  }
  arr.push(effect);
}

/** True if the named ability on the source card is suppressed when targeting cardId. */
function isSuppressed(
  suppressionIndex: Map<CardInstanceId, Set<string>>,
  targetCardId: CardInstanceId,
  abilityName: string | undefined,
): boolean {
  if (!abilityName) return false;
  return suppressionIndex.get(targetCardId)?.has(abilityName) ?? false;
}

/**
 * Checks target matching for effects that originate in derived-state.ts logic
 * (modify-stat, stat-floor, keyword grants, classification grants).
 * These check both the modern target descriptor AND the legacy stat-target strings.
 */
function matchesDerivedStateTarget(
  state: DerivedStateContext,
  flatState: ReturnType<typeof flattenDerivedState>,
  target: unknown,
  sourceId: CardInstanceId,
  targetCardId: CardInstanceId,
  controllerId: PlayerId | undefined,
  getDefinitionByInstanceId: GetDef,
): boolean {
  return (
    matchesStaticAbilityTarget({
      state: flatState,
      target,
      sourceId,
      targetCardId,
      controllerId,
      getDefinitionByInstanceId,
    }) ||
    matchesLegacyStaticStatTarget({
      state,
      target,
      sourceId,
      targetCardId: targetCardId,
      getDefinitionByInstanceId,
    })
  );
}

type GetDef = (id: CardInstanceId) => LorcanaCardDefinition | undefined;

// ============================================================================
// Registry builder
// ============================================================================

export function buildStaticEffectRegistry(
  state: DerivedStateContext,
  getDefinitionByInstanceId: GetDef,
): StaticEffectRegistry {
  const flatState = flattenDerivedState(state);
  const cardIndex = state.ctx.zones?.private?.cardIndex ?? {};
  const inPlayIds = (Object.keys(cardIndex) as CardInstanceId[]).filter((id) =>
    isCardInPlay(flatState, id),
  );

  const byTarget = new Map<CardInstanceId, MaterializedStaticEffect[]>();
  const byPlayer = new Map<PlayerId, MaterializedStaticEffect[]>();
  const global: MaterializedStaticEffect[] = [];

  // ------------------------------------------------------------------
  // Pre-pass: build suppression index
  // suppressionIndex[targetCardId] = Set of ability names suppressed ON that card
  // ------------------------------------------------------------------
  const suppressionIndex = new Map<CardInstanceId, Set<string>>();

  for (const sourceId of inPlayIds) {
    const sourceDef = getDefinitionByInstanceId(sourceId);
    if (!sourceDef) continue;
    const controllerId = cardIndex[sourceId]?.controllerID as PlayerId | undefined;

    for (const ability of sourceDef.abilities ?? []) {
      if (
        ability.type !== "static" ||
        (ability.effect as { type?: string }).type !== "suppress-ability"
      )
        continue;
      const effect = ability.effect as {
        type: "suppress-ability";
        abilityName: string;
        target: unknown;
      };

      if (
        !evaluateStaticCondition({
          condition: ability.condition,
          state: flatState,
          controllerId,
          sourceId,
          getDefinitionByInstanceId,
        })
      )
        continue;

      for (const targetId of inPlayIds) {
        if (
          matchesStaticAbilityTarget({
            state: flatState,
            target: effect.target,
            sourceId,
            targetCardId: targetId,
            controllerId,
            getDefinitionByInstanceId,
          })
        ) {
          let set = suppressionIndex.get(targetId);
          if (!set) {
            set = new Set();
            suppressionIndex.set(targetId, set);
          }
          set.add(effect.abilityName);
        }
      }
    }
  }

  // ------------------------------------------------------------------
  // Pass 1 — Stat layer (modify-stat, stat-floor, property-modification[singer-threshold])
  // Condition evaluation uses BASE stats (no registry available yet).
  // ------------------------------------------------------------------
  const getBaseStrength = (cardId: CardInstanceId): number => {
    const def = getDefinitionByInstanceId(cardId);
    return def?.cardType === "character"
      ? Math.max(0, (def.strength as number | undefined) ?? 0)
      : 0;
  };

  for (const sourceId of inPlayIds) {
    const sourceDef = getDefinitionByInstanceId(sourceId);
    if (!sourceDef) continue;
    const controllerId = cardIndex[sourceId]?.controllerID as PlayerId | undefined;

    for (let abilityIdx = 0; abilityIdx < (sourceDef.abilities ?? []).length; abilityIdx++) {
      const ability = (sourceDef.abilities ?? [])[abilityIdx];
      if (ability.type !== "static") continue;
      const effect = ability.effect as unknown as Record<string, unknown>;
      const effectType = effect.type as string;

      // ----- modify-stat (direct or wrapped in conditional) -----
      let modifyStatEffect: ModifyStatEffect | undefined;
      let extraCondition: unknown;

      if (effectType === "modify-stat") {
        modifyStatEffect = effect as unknown as ModifyStatEffect;
      } else if (
        effectType === "conditional" &&
        (effect.then as Record<string, unknown> | undefined)?.type === "modify-stat"
      ) {
        modifyStatEffect = effect.then as ModifyStatEffect;
        extraCondition = effect.condition;
      }

      if (modifyStatEffect) {
        if (
          !evaluateStaticCondition({
            condition: ability.condition,
            state: flatState,
            controllerId,
            sourceId,
            getDefinitionByInstanceId,
            getCardStrengthByInstanceId: getBaseStrength,
          })
        )
          continue;

        if (
          extraCondition &&
          !evaluateStaticCondition({
            condition: extraCondition as Parameters<typeof evaluateStaticCondition>[0]["condition"],
            state: flatState,
            controllerId,
            sourceId,
            getDefinitionByInstanceId,
            getCardStrengthByInstanceId: getBaseStrength,
          })
        )
          continue;

        for (const targetId of inPlayIds) {
          if (
            !matchesDerivedStateTarget(
              state,
              flatState,
              modifyStatEffect.target,
              sourceId,
              targetId,
              controllerId,
              getDefinitionByInstanceId,
            )
          )
            continue;

          const amount = resolveStaticStatModifierAmount({
            state,
            effect: modifyStatEffect,
            sourceId,
            targetId,
            controllerId,
            getDefinitionByInstanceId,
          });

          addToTarget(byTarget, targetId, {
            sourceId,
            sourceControllerId: controllerId!,
            abilityIndex: abilityIdx,
            abilityName: ability.name,
            sourceDefinitionId: sourceDef.id,
            kind: "modify-stat",
            payload: { stat: modifyStatEffect.stat, modifier: amount },
          });
        }
        continue;
      }

      // ----- stat-floor -----
      if (effectType === "stat-floor") {
        const floorEffect = effect as unknown as StatFloorEffect;

        if (
          !evaluateStaticCondition({
            condition: ability.condition,
            state: flatState,
            controllerId,
            sourceId,
            getDefinitionByInstanceId,
            getCardStrengthByInstanceId: getBaseStrength,
          })
        )
          continue;

        for (const targetId of inPlayIds) {
          if (
            !matchesDerivedStateTarget(
              state,
              flatState,
              floorEffect.target,
              sourceId,
              targetId,
              controllerId,
              getDefinitionByInstanceId,
            )
          )
            continue;

          const targetDef = getDefinitionByInstanceId(targetId);
          const floor = resolveStaticStatFloorMinimum({
            definition: targetDef,
            effect: floorEffect,
          });

          addToTarget(byTarget, targetId, {
            sourceId,
            sourceControllerId: controllerId!,
            abilityIndex: abilityIdx,
            abilityName: ability.name,
            kind: "stat-floor",
            payload: { stat: floorEffect.stat, floor },
          });
        }
        continue;
      }

      // ----- damage-source-stat-override -----
      if (effectType === "damage-source-stat-override") {
        if (
          !evaluateStaticCondition({
            condition: ability.condition,
            state: flatState,
            controllerId,
            sourceId,
            getDefinitionByInstanceId,
            getCardStrengthByInstanceId: getBaseStrength,
          })
        )
          continue;

        const stat = effect.stat;
        if (stat !== "willpower" && stat !== "lore") continue;

        for (const targetId of inPlayIds) {
          if (
            !matchesDerivedStateTarget(
              state,
              flatState,
              effect.target,
              sourceId,
              targetId,
              controllerId,
              getDefinitionByInstanceId,
            )
          )
            continue;

          addToTarget(byTarget, targetId, {
            sourceId,
            sourceControllerId: controllerId!,
            abilityIndex: abilityIdx,
            abilityName: ability.name,
            sourceDefinitionId: sourceDef.id,
            kind: "damage-source-stat-override",
            payload: { stat },
          });
        }
        continue;
      }

      // ----- property-modification[singer-threshold] -----
      if (
        effectType === "property-modification" &&
        effect.property === "singer-threshold" &&
        effect.operation === "add"
      ) {
        if (
          !evaluateStaticCondition({
            condition: ability.condition,
            state: flatState,
            controllerId,
            sourceId,
            getDefinitionByInstanceId,
            getCardStrengthByInstanceId: getBaseStrength,
          })
        )
          continue;

        for (const targetId of inPlayIds) {
          if (
            !matchesStaticAbilityTarget({
              state: flatState,
              target: effect.target,
              sourceId,
              targetCardId: targetId,
              controllerId,
              getDefinitionByInstanceId,
            })
          )
            continue;

          const value = Number(effect.value ?? 0);
          if (!Number.isFinite(value)) continue;

          addToTarget(byTarget, targetId, {
            sourceId,
            sourceControllerId: controllerId!,
            abilityIndex: abilityIdx,
            abilityName: ability.name,
            kind: "property-modification",
            payload: { property: "singer-threshold", value },
          });
        }
        continue;
      }
    }
  }

  // ------------------------------------------------------------------
  // Pass 1.5 — Re-evaluate conditional stat modifiers whose conditions
  // depend on derived stats (e.g. "while this character has strength >= N").
  // Pass 1 used getBaseStrength which misses external buffs; now that all
  // unconditional strength modifiers are in byTarget we can re-check with
  // accurate post-Pass-1 strength.
  // ------------------------------------------------------------------
  const getPartialRegistryStrength = (cardId: CardInstanceId): number => {
    const def = getDefinitionByInstanceId(cardId);
    if (!def || def.cardType !== "character") return 0;
    const base = (def.strength as number | undefined) ?? 0;
    const staticMod = getEffectsForCard(
      { byTarget, byPlayer, global, bySource: new Map() },
      cardId,
      "modify-stat",
    )
      .filter((e) => e.payload.stat === "strength")
      .reduce((sum, e) => sum + (e.payload.modifier as number), 0);
    const activeStatMod = getActiveStatModifierTotal(
      state,
      cardId,
      "strength",
      getDefinitionByInstanceId,
    );
    return Math.max(0, base + staticMod + activeStatMod);
  };

  for (const sourceId of inPlayIds) {
    const sourceDef = getDefinitionByInstanceId(sourceId);
    if (!sourceDef) continue;
    const controllerId = cardIndex[sourceId]?.controllerID as PlayerId | undefined;

    for (let abilityIdx = 0; abilityIdx < (sourceDef.abilities ?? []).length; abilityIdx++) {
      const ability = (sourceDef.abilities ?? [])[abilityIdx];
      if (ability.type !== "static") continue;
      const effect = ability.effect as unknown as Record<string, unknown>;
      const effectType = effect.type as string;

      let modifyStatEffect: ModifyStatEffect | undefined;
      let extraCondition: unknown;

      if (effectType === "modify-stat") {
        modifyStatEffect = effect as unknown as ModifyStatEffect;
      } else if (
        effectType === "conditional" &&
        (effect.then as Record<string, unknown> | undefined)?.type === "modify-stat"
      ) {
        modifyStatEffect = effect.then as ModifyStatEffect;
        extraCondition = effect.condition;
      }

      if (!modifyStatEffect) continue;

      // Re-evaluate using post-Pass-1 strength — if the condition now passes
      // (when it may have failed with getBaseStrength in Pass 1), add the modifier.
      const condOk = evaluateStaticCondition({
        condition: ability.condition,
        state: flatState,
        controllerId,
        sourceId,
        getDefinitionByInstanceId,
        getCardStrengthByInstanceId: getPartialRegistryStrength,
      });
      if (!condOk) continue;

      if (
        extraCondition &&
        !evaluateStaticCondition({
          condition: extraCondition as Parameters<typeof evaluateStaticCondition>[0]["condition"],
          state: flatState,
          controllerId,
          sourceId,
          getDefinitionByInstanceId,
          getCardStrengthByInstanceId: getPartialRegistryStrength,
        })
      )
        continue;

      for (const targetId of inPlayIds) {
        if (
          !matchesDerivedStateTarget(
            state,
            flatState,
            modifyStatEffect.target,
            sourceId,
            targetId,
            controllerId,
            getDefinitionByInstanceId,
          )
        )
          continue;

        // Skip if Pass 1 already added this exact modifier (sourceId+abilityIdx on targetId)
        const existing = byTarget.get(targetId);
        const alreadyAdded =
          existing?.some(
            (e) =>
              e.sourceId === sourceId && e.abilityIndex === abilityIdx && e.kind === "modify-stat",
          ) ?? false;
        if (alreadyAdded) continue;

        const amount = resolveStaticStatModifierAmount({
          state,
          effect: modifyStatEffect,
          sourceId,
          targetId,
          controllerId,
          getDefinitionByInstanceId,
        });

        addToTarget(byTarget, targetId, {
          sourceId,
          sourceControllerId: controllerId!,
          abilityIndex: abilityIdx,
          abilityName: ability.name,
          sourceDefinitionId: sourceDef.id,
          kind: "modify-stat",
          payload: { stat: modifyStatEffect.stat, modifier: amount },
        });
      }
    }
  }

  // ------------------------------------------------------------------
  // After Pass 1 we can compute derived strength from the partial registry.
  // This is used for conditions in Pass 2 that check "while this character
  // has strength ≥ N".
  // ------------------------------------------------------------------
  const getRegistryStrength = (cardId: CardInstanceId): number => {
    const def = getDefinitionByInstanceId(cardId);
    if (!def || def.cardType !== "character") return 0;
    const base = (def.strength as number | undefined) ?? 0;
    const staticMod = getEffectsForCard(
      { byTarget, byPlayer, global, bySource: new Map() },
      cardId,
      "modify-stat",
    )
      .filter((e) => e.payload.stat === "strength")
      .reduce((sum, e) => sum + (e.payload.modifier as number), 0);
    const activeStatMod = getActiveStatModifierTotal(
      state,
      cardId,
      "strength",
      getDefinitionByInstanceId,
    );
    const floors = getEffectsForCard(
      { byTarget, byPlayer, global, bySource: new Map() },
      cardId,
      "stat-floor",
    )
      .filter((e) => e.payload.stat === "strength")
      .map((e) => e.payload.floor as number);
    const floor = floors.length > 0 ? Math.max(...floors) : undefined;
    const derived = base + staticMod + activeStatMod;
    return Math.max(0, floor !== undefined ? Math.max(derived, floor) : derived);
  };

  const getRegistryWillpower = (cardId: CardInstanceId): number => {
    const def = getDefinitionByInstanceId(cardId);
    if (!def || (def.cardType !== "character" && def.cardType !== "location")) return 0;
    const base = (def.willpower as number | undefined) ?? 0;
    const staticMod = getEffectsForCard(
      { byTarget, byPlayer, global, bySource: new Map() },
      cardId,
      "modify-stat",
    )
      .filter((e) => e.payload.stat === "willpower")
      .reduce((sum, e) => sum + (e.payload.modifier as number), 0);
    const activeStatMod = getActiveStatModifierTotal(
      state,
      cardId,
      "willpower",
      getDefinitionByInstanceId,
    );
    const derived = base + staticMod + activeStatMod;
    return Math.max(0, derived);
  };

  // ------------------------------------------------------------------
  // Pass 2a — Keywords (gain-keyword, lose-keyword)
  // Evaluated before grants/restrictions so that keyword-dependent
  // targets (e.g. YOUR_OTHER_EVASIVE_CHARACTERS) see conditionally
  // granted keywords such as Wasabi's "During your turn, gains Evasive".
  // ------------------------------------------------------------------
  const allPlayerIds = getProjectionPlayerIds(state);

  for (const sourceId of inPlayIds) {
    const sourceDef = getDefinitionByInstanceId(sourceId);
    if (!sourceDef) continue;
    const controllerId = cardIndex[sourceId]?.controllerID as PlayerId | undefined;

    for (let abilityIdx = 0; abilityIdx < (sourceDef.abilities ?? []).length; abilityIdx++) {
      const ability = (sourceDef.abilities ?? [])[abilityIdx];
      if (ability.type !== "static") continue;
      const effect = ability.effect as unknown as Record<string, unknown>;
      const effectType = effect.type as string;

      // Only handle keyword effects in this sub-pass
      if (effectType !== "gain-keyword" && effectType !== "lose-keyword") continue;

      const condOk = evaluateStaticCondition({
        condition: ability.condition,
        state: flatState,
        controllerId,
        sourceId,
        getDefinitionByInstanceId,
        getCardStrengthByInstanceId: getRegistryStrength,
        getCardWillpowerByInstanceId: getRegistryWillpower,
      });
      if (!condOk) continue;

      // ----- gain-keyword -----
      if (effectType === "gain-keyword") {
        const keyword =
          typeof effect.keyword === "string" && (effect.keyword as string).trim().length > 0
            ? (effect.keyword as string).trim()
            : undefined;
        if (!keyword) continue;

        const rawValue = effect.value;
        const resolvedValue =
          typeof rawValue === "number" && Number.isFinite(rawValue)
            ? rawValue > 0
              ? rawValue
              : undefined
            : typeof rawValue === "object" && rawValue !== null
              ? (() => {
                  const v = resolveStaticVariableAmount({
                    amount: rawValue as Parameters<typeof resolveStaticVariableAmount>[0]["amount"],
                    state: flatState,
                    controllerId:
                      controllerId ?? (cardIndex[sourceId]?.controllerID as PlayerId | undefined),
                    sourceId,
                    getDefinitionByInstanceId,
                  });
                  return v > 0 ? v : undefined;
                })()
              : undefined;

        if (effect.target === "SELF") {
          // SELF-granted keyword — only applies to the source card itself
          if (!isSuppressed(suppressionIndex, sourceId, ability.name)) {
            addToTarget(byTarget, sourceId, {
              sourceId,
              sourceControllerId: controllerId!,
              abilityIndex: abilityIdx,
              abilityName: ability.name,
              sourceDefinitionId: sourceDef.id,
              kind: "gain-keyword",
              payload: { keyword, value: resolvedValue, selfGrant: true },
            });
          }
        } else {
          const sourceControllerId = controllerId;
          for (const targetId of inPlayIds) {
            if (
              !matchesDerivedStateTarget(
                state,
                flatState,
                effect.target,
                sourceId,
                targetId,
                sourceControllerId,
                getDefinitionByInstanceId,
              )
            )
              continue;

            if (isSuppressed(suppressionIndex, targetId, ability.name)) continue;

            addToTarget(byTarget, targetId, {
              sourceId,
              sourceControllerId: controllerId!,
              abilityIndex: abilityIdx,
              abilityName: ability.name,
              sourceDefinitionId: sourceDef.id,
              kind: "gain-keyword",
              payload: { keyword, value: resolvedValue, selfGrant: false },
            });
          }
        }
        continue;
      }

      // ----- lose-keyword -----
      if (effectType === "lose-keyword") {
        const keyword =
          typeof effect.keyword === "string" && (effect.keyword as string).trim().length > 0
            ? (effect.keyword as string).trim()
            : undefined;
        if (!keyword) continue;

        const sourceControllerId = controllerId;
        for (const targetId of inPlayIds) {
          if (
            !matchesDerivedStateTarget(
              state,
              flatState,
              effect.target,
              sourceId,
              targetId,
              sourceControllerId,
              getDefinitionByInstanceId,
            )
          )
            continue;

          addToTarget(byTarget, targetId, {
            sourceId,
            sourceControllerId: controllerId!,
            abilityIndex: abilityIdx,
            abilityName: ability.name,
            kind: "lose-keyword",
            payload: { keyword },
          });
        }
        continue;
      }
    }
  }

  // ------------------------------------------------------------------
  // After Pass 2a, keyword effects are materialized in byTarget.
  // Build a keyword-augmented definition getter so that target matching
  // in Pass 2b sees the derived keyword state from static effects
  // (including both granted and removed keywords) when evaluating
  // targets like YOUR_OTHER_EVASIVE_CHARACTERS.
  // ------------------------------------------------------------------
  const getDefinitionWithGrantedKeywords: GetDef = (id: CardInstanceId) => {
    const baseDef = getDefinitionByInstanceId(id);
    if (!baseDef) return undefined;

    const keywordEffects = (byTarget.get(id) ?? []).filter(
      (e) => e.kind === "gain-keyword" || e.kind === "lose-keyword",
    );
    if (keywordEffects.length === 0) return baseDef;

    const removedKeywords = new Set(
      keywordEffects
        .filter((e) => e.kind === "lose-keyword")
        .map((e) => e.payload.keyword as string),
    );

    const baseAbilities = baseDef.abilities ?? [];
    const filteredBaseAbilities = baseAbilities.filter(
      (ability) =>
        !(
          ability.type === "keyword" &&
          "keyword" in ability &&
          removedKeywords.has((ability as { keyword: string }).keyword)
        ),
    );

    const existingKeywords = new Set(
      filteredBaseAbilities
        .filter((a) => a.type === "keyword" && "keyword" in a)
        .map((a) => (a as { keyword: string }).keyword),
    );

    const gainedKeywords = new Set(
      keywordEffects
        .filter((e) => e.kind === "gain-keyword")
        .map((e) => e.payload.keyword as string)
        .filter((keyword) => !removedKeywords.has(keyword)),
    );

    const syntheticAbilities = [...gainedKeywords]
      .filter((keyword) => !existingKeywords.has(keyword))
      .map((keyword) => ({
        type: "keyword" as const,
        keyword,
        id: `${id}-registry-keyword-${keyword}`,
      }));

    const abilitiesChanged =
      filteredBaseAbilities.length !== baseAbilities.length || syntheticAbilities.length > 0;
    if (!abilitiesChanged) return baseDef;

    return {
      ...baseDef,
      abilities: [...filteredBaseAbilities, ...syntheticAbilities],
    } as LorcanaCardDefinition;
  };

  // ------------------------------------------------------------------
  // Pass 2a.5 — Re-evaluate modify-stat whose target filter depends on
  // keywords granted in Pass 2a (e.g. Gadget Hackwrench's WELL SUPPLIED
  // "Your characters with Support get +1 lore" must observe Support
  // granted by Ranger Plane's AIR SUPPORT). Pass 1 only saw base-keyword
  // definitions; this pass uses the keyword-augmented def getter.
  // ------------------------------------------------------------------
  for (const sourceId of inPlayIds) {
    const sourceDef = getDefinitionByInstanceId(sourceId);
    if (!sourceDef) continue;
    const controllerId = cardIndex[sourceId]?.controllerID as PlayerId | undefined;

    for (let abilityIdx = 0; abilityIdx < (sourceDef.abilities ?? []).length; abilityIdx++) {
      const ability = (sourceDef.abilities ?? [])[abilityIdx];
      if (ability.type !== "static") continue;
      const effect = ability.effect as unknown as Record<string, unknown>;
      const effectType = effect.type as string;

      let modifyStatEffect: ModifyStatEffect | undefined;
      let extraCondition: unknown;

      if (effectType === "modify-stat") {
        modifyStatEffect = effect as unknown as ModifyStatEffect;
      } else if (
        effectType === "conditional" &&
        (effect.then as Record<string, unknown> | undefined)?.type === "modify-stat"
      ) {
        modifyStatEffect = effect.then as ModifyStatEffect;
        extraCondition = effect.condition;
      }

      if (!modifyStatEffect) continue;

      const condOk = evaluateStaticCondition({
        condition: ability.condition,
        state: flatState,
        controllerId,
        sourceId,
        getDefinitionByInstanceId: getDefinitionWithGrantedKeywords,
        getCardStrengthByInstanceId: getRegistryStrength,
        getCardWillpowerByInstanceId: getRegistryWillpower,
      });
      if (!condOk) continue;

      if (
        extraCondition &&
        !evaluateStaticCondition({
          condition: extraCondition as Parameters<typeof evaluateStaticCondition>[0]["condition"],
          state: flatState,
          controllerId,
          sourceId,
          getDefinitionByInstanceId: getDefinitionWithGrantedKeywords,
          getCardStrengthByInstanceId: getRegistryStrength,
          getCardWillpowerByInstanceId: getRegistryWillpower,
        })
      )
        continue;

      for (const targetId of inPlayIds) {
        if (
          !matchesDerivedStateTarget(
            state,
            flatState,
            modifyStatEffect.target,
            sourceId,
            targetId,
            controllerId,
            getDefinitionWithGrantedKeywords,
          )
        )
          continue;

        const existing = byTarget.get(targetId);
        const alreadyAdded =
          existing?.some(
            (e) =>
              e.sourceId === sourceId && e.abilityIndex === abilityIdx && e.kind === "modify-stat",
          ) ?? false;
        if (alreadyAdded) continue;

        const amount = resolveStaticStatModifierAmount({
          state,
          effect: modifyStatEffect,
          sourceId,
          targetId,
          controllerId,
          getDefinitionByInstanceId: getDefinitionWithGrantedKeywords,
        });

        addToTarget(byTarget, targetId, {
          sourceId,
          sourceControllerId: controllerId!,
          abilityIndex: abilityIdx,
          abilityName: ability.name,
          sourceDefinitionId: sourceDef.id,
          kind: "modify-stat",
          payload: { stat: modifyStatEffect.stat, modifier: amount },
        });
      }
    }
  }

  // ------------------------------------------------------------------
  // Pass 2b — Everything else (classifications, restrictions, cost
  // modifiers, granted abilities). Uses keyword-augmented definitions
  // so that grant targets depending on keywords work correctly.
  // ------------------------------------------------------------------
  for (const sourceId of inPlayIds) {
    const sourceDef = getDefinitionByInstanceId(sourceId);
    if (!sourceDef) continue;
    const controllerId = cardIndex[sourceId]?.controllerID as PlayerId | undefined;

    for (let abilityIdx = 0; abilityIdx < (sourceDef.abilities ?? []).length; abilityIdx++) {
      const ability = (sourceDef.abilities ?? [])[abilityIdx];
      if (ability.type !== "static") continue;
      const effect = ability.effect as unknown as Record<string, unknown>;
      const effectType = effect.type as string;

      // Skip effects already handled in Pass 1 or Pass 2a
      if (
        effectType === "modify-stat" ||
        effectType === "stat-floor" ||
        effectType === "damage-source-stat-override" ||
        effectType === "gain-keyword" ||
        effectType === "lose-keyword" ||
        (effectType === "conditional" &&
          (effect.then as Record<string, unknown> | undefined)?.type === "modify-stat") ||
        (effectType === "property-modification" && effect.property === "singer-threshold")
      ) {
        continue;
      }

      const condOk = evaluateStaticCondition({
        condition: ability.condition,
        state: flatState,
        controllerId,
        sourceId,
        getDefinitionByInstanceId,
        getCardStrengthByInstanceId: getRegistryStrength,
        getCardWillpowerByInstanceId: getRegistryWillpower,
      });
      if (!condOk) continue;

      // ----- property-modification[classification] -----
      if (
        effectType === "property-modification" &&
        effect.property === "classification" &&
        effect.operation === "add"
      ) {
        const classification =
          typeof effect.value === "string" && (effect.value as string).trim().length > 0
            ? (effect.value as string).trim()
            : undefined;
        if (!classification) continue;

        const sourceControllerId = controllerId;
        for (const targetId of inPlayIds) {
          if (
            !matchesDerivedStateTarget(
              state,
              flatState,
              effect.target,
              sourceId,
              targetId,
              sourceControllerId,
              getDefinitionByInstanceId,
            )
          )
            continue;

          addToTarget(byTarget, targetId, {
            sourceId,
            sourceControllerId: controllerId!,
            abilityIndex: abilityIdx,
            abilityName: ability.name,
            kind: "grant-classification",
            payload: { classification },
          });
        }
        continue;
      }

      // ----- restriction -----
      // Handle direct restriction effects and conditional wrappers.
      // Only card-targeted and player-targeted restrictions are handled here.
      const restrictionEffect = extractRestrictionEffect(effect);
      if (restrictionEffect) {
        const {
          restriction,
          target: restrictionTarget,
          limit,
          minCost,
          costRestriction,
          challengerFilter,
          effectCondition,
        } = restrictionEffect;

        if (isPlayerTarget(restrictionTarget)) {
          // CONTROLLER — applies to source's controller
          if (restrictionTarget === "CONTROLLER" || restrictionTarget === "YOU") {
            if (controllerId) {
              const entry: MaterializedStaticEffect = {
                sourceId,
                sourceControllerId: controllerId,
                abilityIndex: abilityIdx,
                abilityName: ability.name,
                kind: "restriction",
                payload: {
                  restriction,
                  playerTarget: "CONTROLLER",
                  limit,
                  minCost,
                  costRestriction,
                  challengerFilter,
                },
              };
              addToPlayer(byPlayer, controllerId, entry);
            }
          } else if (restrictionTarget === "OPPONENTS") {
            // Applies to every opponent of the source controller
            for (const pid of allPlayerIds) {
              if (pid === controllerId) continue;
              const entry: MaterializedStaticEffect = {
                sourceId,
                sourceControllerId: controllerId!,
                abilityIndex: abilityIdx,
                abilityName: ability.name,
                kind: "restriction",
                payload: {
                  restriction,
                  playerTarget: "OPPONENTS",
                  limit,
                  minCost,
                  costRestriction,
                  challengerFilter,
                },
              };
              addToPlayer(byPlayer, pid, entry);
            }
          } else if (restrictionTarget === "ALL_PLAYERS") {
            global.push({
              sourceId,
              sourceControllerId: controllerId!,
              abilityIndex: abilityIdx,
              abilityName: ability.name,
              kind: "restriction",
              payload: {
                restriction,
                playerTarget: "ALL_PLAYERS",
                limit,
                minCost,
                costRestriction,
                challengerFilter,
              },
            });
          }
        } else {
          // Card-targeted restriction
          for (const targetId of inPlayIds) {
            if (
              !matchesStaticAbilityTarget({
                state: flatState,
                target: restrictionTarget,
                sourceId,
                targetCardId: targetId,
                controllerId,
                getDefinitionByInstanceId,
              }) &&
              !matchesLegacyStaticTarget({
                state: flatState,
                target: restrictionTarget,
                sourceId,
                targetCardId: targetId,
                controllerId: controllerId!,
                getDefinitionByInstanceId,
              })
            )
              continue;

            // Check suppression — the source ability name being suppressed on the target
            if (isSuppressed(suppressionIndex, targetId, ability.name)) continue;

            // Evaluate per-target condition on the effect itself (e.g. "NOT being-challenged").
            // The condition is evaluated with the TARGET card as sourceId, because conditions
            // like "being-challenged" describe the state of the card receiving the restriction.
            if (effectCondition !== undefined) {
              const targetControllerId = cardIndex[targetId]?.controllerID as PlayerId | undefined;
              const conditionPasses = evaluateStaticCondition({
                condition: effectCondition as Parameters<
                  typeof evaluateStaticCondition
                >[0]["condition"],
                state: flatState,
                controllerId: targetControllerId ?? controllerId,
                sourceId: targetId,
                getDefinitionByInstanceId,
              });
              if (!conditionPasses) continue;
            }

            addToTarget(byTarget, targetId, {
              sourceId,
              sourceControllerId: controllerId!,
              abilityIndex: abilityIdx,
              abilityName: ability.name,
              kind: "restriction",
              payload: { restriction, limit, challengerFilter },
            });
          }
        }
        continue;
      }

      // ----- cost-reduction -----
      if (effectType === "cost-reduction") {
        if (!controllerId) continue;

        const activeSourceZones = (ability.sourceZones ?? ["play"]) as (
          | "play"
          | "hand"
          | "discard"
          | "inkwell"
        )[];
        if (!activeSourceZones.includes("play")) continue;

        const costEffect = effect as {
          type: "cost-reduction";
          amount?: unknown;
          reduction?: { ink?: unknown };
          cardType?: unknown;
          classification?: unknown;
          cardName?: unknown;
          name?: unknown;
          playMethod?: "shift" | "standard" | "either";
        };

        addToPlayer(byPlayer, controllerId, {
          sourceId,
          sourceControllerId: controllerId,
          abilityIndex: abilityIdx,
          abilityName: ability.name,
          kind: "cost-reduction",
          payload: {
            rawAmount: costEffect.amount,
            rawReduction: costEffect.reduction,
            cardType: costEffect.cardType,
            classification: costEffect.classification,
            cardName: costEffect.cardName ?? costEffect.name,
            playMethod: costEffect.playMethod,
          },
        });
        continue;
      }

      // ----- cost-increase -----
      if (effectType === "cost-increase") {
        const activeSourceZones = (ability.sourceZones ?? ["play"]) as (
          | "play"
          | "hand"
          | "discard"
          | "inkwell"
        )[];
        if (!activeSourceZones.includes("play")) continue;

        global.push({
          sourceId,
          sourceControllerId: controllerId!,
          abilityIndex: abilityIdx,
          abilityName: ability.name,
          kind: "cost-increase",
          payload: {
            amount: typeof effect.amount === "number" ? (effect.amount as number) : 0,
            cardType: effect.cardType,
          },
        });
        continue;
      }

      // ----- grant-abilities-while-here -----
      if (effectType === "grant-abilities-while-here") {
        const grantTarget = effect.target ?? "CHARACTERS_HERE";
        for (const targetId of inPlayIds) {
          // Use keyword-augmented definitions so that targets like
          // YOUR_OTHER_EVASIVE_CHARACTERS see keywords granted in Pass 2a
          const matchesModern = matchesStaticAbilityTarget({
            state: flatState,
            target: grantTarget,
            sourceId,
            targetCardId: targetId,
            controllerId,
            getDefinitionByInstanceId: getDefinitionWithGrantedKeywords,
          });
          const matchesLegacy =
            controllerId &&
            matchesLegacyStaticTarget({
              state: flatState,
              target: grantTarget,
              sourceId,
              targetCardId: targetId,
              controllerId,
              getDefinitionByInstanceId: getDefinitionWithGrantedKeywords,
            });
          if (!matchesModern && !matchesLegacy) continue;

          for (const grantedAbility of (effect.abilities ?? []) as ActivatedAbilityDefinition[]) {
            if (grantedAbility.type !== "activated") continue;
            addToTarget(byTarget, targetId, {
              sourceId,
              sourceControllerId: controllerId!,
              abilityIndex: abilityIdx,
              abilityName: ability.name,
              kind: "grant-abilities-while-here",
              payload: {
                ability: {
                  ...grantedAbility,
                  id: grantedAbility.id ?? `${sourceId}-granted-${abilityIdx}`,
                } as ActivatedAbilityDefinition,
              },
            });
          }
        }
        continue;
      }

      // ----- grant-ability -----
      if (effectType === "grant-ability") {
        const grantTarget = effect.target ?? "SELF";
        for (const targetId of inPlayIds) {
          if (
            !matchesStaticAbilityTarget({
              state: flatState,
              target: grantTarget,
              sourceId,
              targetCardId: targetId,
              controllerId,
              getDefinitionByInstanceId: getDefinitionWithGrantedKeywords,
            })
          )
            continue;

          const grantedAbility = effect.ability;
          if (
            !grantedAbility ||
            typeof grantedAbility !== "object" ||
            Array.isArray(grantedAbility) ||
            (grantedAbility as Record<string, unknown>).type !== "activated"
          ) {
            continue;
          }

          const typedAbility = grantedAbility as ActivatedAbilityDefinition;
          addToTarget(byTarget, targetId, {
            sourceId,
            sourceControllerId: controllerId!,
            abilityIndex: abilityIdx,
            abilityName: ability.name,
            kind: "grant-ability",
            payload: {
              ability: {
                ...typedAbility,
                id: typedAbility.id ?? `${sourceId}-granted-${abilityIdx}`,
              } as ActivatedAbilityDefinition,
            },
          });
        }
        continue;
      }
    }
  }

  // ------------------------------------------------------------------
  // Build bySource index — derived from the three existing buckets.
  // Enables O(1) attribution lookups ("what effects is card X emitting?")
  // and is the foundation for future incremental cleanup.
  // ------------------------------------------------------------------
  const bySource = new Map<CardInstanceId, MaterializedStaticEffect[]>();
  const trackSource = (effect: MaterializedStaticEffect): void => {
    let arr = bySource.get(effect.sourceId);
    if (!arr) {
      arr = [];
      bySource.set(effect.sourceId, arr);
    }
    arr.push(effect);
  };
  for (const effects of byTarget.values()) for (const e of effects) trackSource(e);
  for (const effects of byPlayer.values()) for (const e of effects) trackSource(e);
  for (const e of global) trackSource(e);

  return { byTarget, byPlayer, global, bySource };
}

// ============================================================================
// Helpers for restriction extraction
// ============================================================================

type RestrictionCostComparison = "less-or-equal" | "greater-or-equal" | "equal";

type RestrictionCostRestriction = {
  comparison: RestrictionCostComparison;
  value: number;
};

type ExtractedRestriction = {
  restriction: string;
  target: unknown;
  limit?: number;
  minCost?: number;
  costRestriction?: RestrictionCostRestriction;
  challengerFilter?: unknown;
  /** Per-target condition from the effect itself (e.g. "NOT being-challenged"). */
  effectCondition?: unknown;
};

function readCostRestriction(value: unknown): RestrictionCostRestriction | undefined {
  if (!value || typeof value !== "object") return undefined;
  const record = value as { comparison?: unknown; value?: unknown };
  if (typeof record.value !== "number" || !Number.isFinite(record.value)) return undefined;
  if (
    record.comparison !== "less-or-equal" &&
    record.comparison !== "greater-or-equal" &&
    record.comparison !== "equal"
  ) {
    return undefined;
  }
  return { comparison: record.comparison, value: record.value };
}

function deriveCostRestriction(
  source: Record<string, unknown>,
): RestrictionCostRestriction | undefined {
  const explicit = readCostRestriction(source.costRestriction);
  if (explicit) return explicit;
  const minCost = source.minCost;
  if (typeof minCost === "number" && Number.isFinite(minCost)) {
    return { comparison: "greater-or-equal", value: minCost };
  }
  return undefined;
}

/**
 * Extracts a restriction from a potentially-wrapped effect.
 * Handles direct restrictions and simple conditional wrappers.
 * Returns undefined for complex nesting or non-restriction effects.
 */
function extractRestrictionEffect(
  effect: Record<string, unknown>,
): ExtractedRestriction | undefined {
  if (effect.type === "restriction") {
    return {
      restriction: effect.restriction as string,
      target: effect.target,
      limit: effect.limit as number | undefined,
      minCost: effect.minCost as number | undefined,
      costRestriction: deriveCostRestriction(effect),
      challengerFilter: effect.challengerFilter,
      effectCondition: effect.condition,
    };
  }

  if (effect.type === "conditional") {
    const then = effect.then as Record<string, unknown> | undefined;
    if (then?.type === "restriction") {
      return {
        restriction: then.restriction as string,
        target: then.target,
        limit: then.limit as number | undefined,
        minCost: then.minCost as number | undefined,
        costRestriction: deriveCostRestriction(then),
        challengerFilter: then.challengerFilter,
        effectCondition: then.condition,
      };
    }
  }

  return undefined;
}

const PLAYER_TARGET_STRINGS = new Set([
  "CONTROLLER",
  "OPPONENTS",
  "ALL_PLAYERS",
  "YOU",
  "OPPONENT",
]);

function isPlayerTarget(
  target: unknown,
): target is "CONTROLLER" | "OPPONENTS" | "ALL_PLAYERS" | "YOU" | "OPPONENT" {
  return typeof target === "string" && PLAYER_TARGET_STRINGS.has(target);
}
