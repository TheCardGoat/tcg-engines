import type { CardInstanceId, DeepReadonly, PlayerId } from "#core";
import type { StaticEffectRegistry } from "../rules/static-effect-registry";

// Re-export the type for consumers
export type { ProjectedLorcanaCardDerived } from "../types/projected-board";
import { getFullName, isParameterizedKeywordAbility, isValueKeywordAbility } from "../card-utils";
import { getTemporaryKeywordValue } from "../runtime-moves/effects/temporary-effects";
import type {
  LorcanaCardDefinition,
  LorcanaCardMeta,
  LorcanaG,
  LorcanaProjectedCard,
  ProjectedLorcanaCardDerived,
} from "../types";
import {
  getActiveStaticClassificationGrants,
  deriveCanBePutInInkwell,
  deriveLore,
  deriveMoveCost,
  derivePlayCost,
  deriveStrength,
  deriveWillpower,
  getActiveStaticKeywordGrants,
  getActiveStaticKeywordLosses,
  getActiveStaticKeywordGrantSources,
  getActiveStaticSelfKeywordGrants,
  getStaticStatModifierSources,
  getActiveTemporaryKeywordNames,
  getActiveTemporaryMap,
  getDerivedHasQuestRestriction,
  getAppliedCostReductions,
  type DerivedStateContext,
} from "../rules/derived-state";
import { getGrantedActivatedAbilities } from "../runtime-moves/rules/static-ability-utils";
import { getShiftRules } from "../runtime-moves/rules/play-card-rules";

// Type alias for compatibility, they are structurally identical
type ProjectionState = DerivedStateContext;

function toProjectionCardMeta(
  meta: DeepReadonly<LorcanaCardMeta> | undefined,
): LorcanaCardMeta | undefined {
  if (!meta) {
    return undefined;
  }

  return {
    ...meta,
    cardsUnder: meta.cardsUnder ? [...meta.cardsUnder] : undefined,
    replacementAbilities: meta.replacementAbilities ? [...meta.replacementAbilities] : undefined,
  };
}

// TODO: THe default should probably be null
export function createDefaultProjectedLorcanaCardDerived(args?: {
  definition: LorcanaCardDefinition;
  projection?: LorcanaProjectedCard;
  meta?: LorcanaCardMeta;
}): ProjectedLorcanaCardDerived {
  if (!args) {
    return {};
  }

  const { definition, projection, meta } = args;

  return {
    cardType: projection?.cardType ?? definition?.cardType ?? "item",
    exerted: projection?.exerted || meta?.state === "exerted",
    drying: projection?.drying ?? meta?.isDrying ?? false,
    damage: projection?.damage ?? meta?.damage ?? 0,
    strength: projection?.strength ?? definition?.strength ?? 0,
    willpower: projection?.willpower ?? definition?.willpower ?? 0,
    lore: projection?.lore ?? definition?.lore ?? 0,
    canBePutInInkwell: projection?.canBePutInInkwell ?? false,
    shiftInkCost: projection?.shiftInkCost,
    shiftPlayCost: projection?.shiftPlayCost,
    hasSupport: projection?.hasSupport ?? false,
    hasReckless: projection?.hasReckless ?? false,
    hasRush: projection?.hasRush ?? false,
    hasQuestRestriction: projection?.hasQuestRestriction ?? false,
    classifications: projection?.classifications ?? definition?.classifications ?? [],
    fullName: projection?.fullName ?? (definition ? getFullName(definition) : "FALLBACK NAME"),
    keywords: projection?.keywords ?? [],
    keywordValues: projection?.keywordValues ?? {},
  };
}

function normalizeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function projectLorcanaCardDerived(args: {
  definition?: LorcanaCardDefinition;
  meta?: LorcanaCardMeta;
  state: ProjectionState;
  cardInstanceId?: CardInstanceId;
  ownerID?: PlayerId;
  controllerID?: PlayerId;
  zoneID?: string;
  actorPlayerId?: PlayerId;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
  registry: StaticEffectRegistry | undefined;
}): ProjectedLorcanaCardDerived {
  const { definition, meta, state, cardInstanceId, ownerID, controllerID, zoneID, actorPlayerId } =
    args;
  const { getDefinitionByInstanceId, registry } = args;
  const currentTurn = state.ctx.status?.turn ?? 1;
  const derived = createDefaultProjectedLorcanaCardDerived();

  derived.cardType = definition?.cardType ?? "item";
  derived.exerted = meta?.state === "exerted";
  derived.drying = Boolean(meta?.isDrying);
  derived.damage = Math.max(0, normalizeNumber(meta?.damage));
  derived.canBePutInInkwell = deriveCanBePutInInkwell({
    definition,
    ownerID,
    zoneID,
    state,
    actorPlayerId,
    getDefinitionByInstanceId,
  });
  derived.hasQuestRestriction = getDerivedHasQuestRestriction(
    meta,
    currentTurn,
    state,
    cardInstanceId,
    getDefinitionByInstanceId,
    registry,
  );
  derived.strength = deriveStrength(
    definition,
    state,
    cardInstanceId,
    getDefinitionByInstanceId,
    registry,
  );
  derived.willpower = deriveWillpower(
    definition,
    state,
    cardInstanceId,
    getDefinitionByInstanceId,
    registry,
  );
  derived.lore = deriveLore(definition, state, cardInstanceId, getDefinitionByInstanceId, registry);
  derived.moveCost = deriveMoveCost(
    definition,
    state,
    cardInstanceId,
    getDefinitionByInstanceId,
    registry,
  );
  derived.playCost = derivePlayCost({
    definition,
    state,
    cardInstanceId,
    ownerID,
    zoneID,
    actorPlayerId,
    getDefinitionByInstanceId,
    registry,
  });
  const shiftRules = definition ? getShiftRules(definition) : undefined;
  if (shiftRules && !shiftRules.unsupportedReason && typeof shiftRules.inkCost === "number") {
    derived.shiftInkCost = shiftRules.inkCost;
    const shiftReduction = getAppliedCostReductions({
      definition,
      state,
      cardInstanceId,
      ownerID,
      zoneID,
      actorPlayerId,
      getDefinitionByInstanceId,
      playMethod: "shift",
      registry,
    });
    derived.shiftPlayCost = Math.max(0, shiftRules.inkCost - shiftReduction.reductionAmount);
  }
  const staticClassifications = getActiveStaticClassificationGrants({
    definition,
    state,
    controllerId: controllerID ?? ownerID,
    zoneID,
    cardInstanceId,
    registry,
  });
  derived.classifications = [
    ...new Set([...(definition?.classifications ?? []), ...staticClassifications]),
  ].sort((left, right) => left.localeCompare(right));
  derived.fullName = definition ? getFullName(definition) : "";

  const baseKeywords = definition
    ? (definition.abilities ?? [])
        .filter((ability) => ability.type === "keyword" && typeof ability.keyword === "string")
        .map((ability) => ability.keyword)
    : [];
  const temporaryKeywords = getActiveTemporaryKeywordNames(meta, currentTurn, state);
  const staticSelfKeywords = getActiveStaticSelfKeywordGrants({
    definition,
    state,
    controllerId: controllerID ?? ownerID,
    zoneID,
    cardInstanceId,
    getDefinitionByInstanceId,
  });
  const staticKeywords = getActiveStaticKeywordGrants({
    definition,
    state,
    controllerId: controllerID ?? ownerID,
    zoneID,
    cardInstanceId,
    registry,
  });
  const staticKeywordLosses = getActiveStaticKeywordLosses({
    definition,
    state,
    controllerId: controllerID ?? ownerID,
    zoneID,
    cardInstanceId,
    registry,
  });
  derived.keywords = [
    ...new Set([
      ...baseKeywords,
      ...temporaryKeywords,
      ...staticSelfKeywords.keywords,
      ...staticKeywords.keywords,
    ]),
  ]
    .filter((keyword) => !staticKeywordLosses.includes(keyword))
    .sort((left, right) => left.localeCompare(right));
  derived.hasSupport = derived.keywords.includes("Support");
  derived.hasReckless = derived.keywords.includes("Reckless");
  derived.hasRush = derived.keywords.includes("Rush");
  derived.hasEvasive = derived.keywords.includes("Evasive");

  // Build keyword values dynamically from all sources (base, temporary, static self, static)
  const keywordValueSources = new Map<string, number[]>();

  // Base definition keyword values
  if (definition) {
    for (const ability of definition.abilities ?? []) {
      if (
        ability.type === "keyword" &&
        typeof ability.keyword === "string" &&
        (isParameterizedKeywordAbility(ability) || isValueKeywordAbility(ability))
      ) {
        const val = ability.value;
        if (val > 0) {
          const arr = keywordValueSources.get(ability.keyword) ?? [];
          arr.push(val);
          keywordValueSources.set(ability.keyword, arr);
        }
      }
    }
  }

  // Temporary keyword values
  for (const kw of temporaryKeywords) {
    const val = getTemporaryKeywordValue(meta, currentTurn, kw);
    if (val > 0) {
      const arr = keywordValueSources.get(kw) ?? [];
      arr.push(val);
      keywordValueSources.set(kw, arr);
    }
  }

  // Static self keyword values
  for (const [kw, val] of Object.entries(staticSelfKeywords.values)) {
    if (val > 0) {
      const arr = keywordValueSources.get(kw) ?? [];
      arr.push(val);
      keywordValueSources.set(kw, arr);
    }
  }

  // Static keyword values
  for (const [kw, val] of Object.entries(staticKeywords.values)) {
    if (val > 0) {
      const arr = keywordValueSources.get(kw) ?? [];
      arr.push(val);
      keywordValueSources.set(kw, arr);
    }
  }

  derived.keywordValues = {};
  for (const [kw, values] of keywordValueSources) {
    derived.keywordValues[kw.toLowerCase()] = values.reduce((a, b) => a + b, 0);
  }
  derived.temporaryAbilities = getActiveTemporaryMap(
    meta?.temporaryAbilities,
    meta?.temporaryAbilityStarts,
    currentTurn,
  );
  derived.temporaryAbilityStarts = derived.temporaryAbilities
    ? meta?.temporaryAbilityStarts
    : undefined;
  derived.temporaryRestrictions = getActiveTemporaryMap(
    meta?.temporaryRestrictions,
    meta?.temporaryRestrictionStarts,
    currentTurn,
  );
  derived.temporaryRestrictionStarts = derived.temporaryRestrictions
    ? meta?.temporaryRestrictionStarts
    : undefined;

  if (cardInstanceId && getDefinitionByInstanceId && registry && zoneID?.startsWith("play")) {
    const grantedAbilities = getGrantedActivatedAbilities({
      state: {
        priority: state.ctx.priority,
        status: state.ctx.status,
        _zonesPrivate: state.ctx.zones?.private,
      },
      cardId: cardInstanceId,
      getDefinitionByInstanceId,
      registry,
    });
    // Filter out self-grants: keyword-derived abilities (e.g. Boost) have sourceId === cardId
    // because the card grants the activated ability to itself. Those entries are already
    // represented by the card's own printed text entries, so they should not appear in
    // grantedAbilityTextEntries (which would cause duplication and a "Granted by self" annotation).
    const externalGrants = grantedAbilities.filter(
      ({ sourceId }) => String(sourceId) !== String(cardInstanceId),
    );
    if (externalGrants.length > 0) {
      derived.grantedAbilityTextEntries = externalGrants.map(({ ability, sourceId }) => {
        const title = ability.name ?? ability.id ?? "Ability";
        const description = ability.text?.trim();
        const sourceDef = getDefinitionByInstanceId(sourceId);
        return {
          title,
          ...(description ? { description } : {}),
          sourceId: String(sourceId),
          sourceDefinitionId: sourceDef?.id,
        };
      });
    }

    const keywordSources = getActiveStaticKeywordGrantSources({
      definition,
      state,
      controllerId: controllerID ?? ownerID,
      zoneID,
      cardInstanceId,
      registry,
    });
    if (keywordSources.length > 0) {
      derived.keywordGrantSources = keywordSources;
    }

    const statSources: Array<{
      stat: string;
      amount: number;
      sourceId: string;
      sourceDefinitionId?: string;
    }> = [];
    for (const stat of ["strength", "willpower", "lore", "moveCost"] as const) {
      const sources = getStaticStatModifierSources({
        state,
        cardInstanceId,
        stat,
        registry,
      });
      for (const source of sources) {
        statSources.push({
          stat: source.stat,
          amount: source.amount,
          sourceId: String(source.sourceId),
          sourceDefinitionId: source.sourceDefinitionId,
        });
      }
    }
    if (statSources.length > 0) {
      derived.statModifierSources = statSources;
    }
  }

  return derived;
}

// Restores a short-form LorcanaProjectedCard (with undefined defaults) to full form
// Used when we need all values present (e.g. for card text generation)
export function restoreProjectedCard({
  definition,
  projected,
}: {
  definition: LorcanaCardDefinition;
  projected: LorcanaProjectedCard;
}): LorcanaProjectedCard {
  const restored = createDefaultProjectedLorcanaCardDerived({ definition, projection: projected });

  return {
    ...projected,
    ...restored,
  };
}
