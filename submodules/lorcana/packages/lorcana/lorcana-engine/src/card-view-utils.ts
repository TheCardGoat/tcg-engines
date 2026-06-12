import type { CardInstanceId, PlayerId, RuntimeCardWithDefinition } from "#core";
import type {
  LorcanaCard,
  LorcanaCardDefinition,
  LorcanaCardMeta,
  LorcanaMatchState,
} from "./types";
import type { LorcanaCardDerived } from "./types/projected-board";
import { projectLorcanaCardDerived } from "./projection/card-derived";
import { buildRegistryFromMatchState } from "./runtime-moves/rules/move-registry-cache";

/**
 * Build a runtime card view for a Lorcana card instance.
 *
 * Returns a flat card object with all derived properties computed from current state.
 */
export function buildLorcanaRuntimeCardView(args: {
  cardInstanceId: CardInstanceId;
  definition: LorcanaCardDefinition;
  definitionId: string;
  ownerID: string;
  controllerID: string;
  zoneID?: string;
  zoneIndex?: number;
  getState: () => LorcanaMatchState;
  actorPlayerId?: string;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
}): RuntimeCardWithDefinition {
  const {
    cardInstanceId,
    definition,
    definitionId,
    ownerID,
    controllerID,
    zoneID,
    zoneIndex,
    getState,
    actorPlayerId,
    getDefinitionByInstanceId,
  } = args;

  const state = getState();
  const meta: LorcanaCardMeta =
    (state.ctx?.zones?.private?.cardMeta?.[cardInstanceId] as LorcanaCardMeta) ?? {};

  const registry = buildRegistryFromMatchState(state, getDefinitionByInstanceId);
  const projected = projectLorcanaCardDerived({
    definition,
    meta,
    state,
    cardInstanceId,
    ownerID: ownerID as PlayerId,
    controllerID: controllerID as PlayerId,
    zoneID,
    actorPlayerId: actorPlayerId as PlayerId | undefined,
    getDefinitionByInstanceId,
    registry,
  });

  return {
    // Derived values (spread first so base fields win)
    strength: projected.strength ?? 0,
    willpower: projected.willpower ?? 0,
    lore: projected.lore ?? 0,
    playCost: projected.playCost ?? 0,
    shiftInkCost: projected.shiftInkCost,
    shiftPlayCost: projected.shiftPlayCost,
    moveCost: projected.moveCost ?? 0,
    damage: projected.damage ?? 0,
    exerted: projected.exerted ?? false,
    drying: projected.drying ?? false,
    canBePutInInkwell: projected.canBePutInInkwell ?? false,
    hasSupport: projected.hasSupport ?? false,
    hasRush: projected.hasRush ?? false,
    hasReckless: projected.hasReckless ?? false,
    hasEvasive: projected.hasEvasive ?? false,
    hasQuestRestriction: projected.hasQuestRestriction ?? false,
    fullName: projected.fullName ?? "",
    keywords: projected.keywords ?? [],
    keywordValues: projected.keywordValues ?? {},
    classifications: projected.classifications ?? [],
    temporaryAbilities: projected.temporaryAbilities ?? {},
    temporaryAbilityStarts: projected.temporaryAbilityStarts ?? {},
    temporaryRestrictions: projected.temporaryRestrictions ?? {},
    temporaryRestrictionStarts: projected.temporaryRestrictionStarts ?? {},
    // Base fields (always win)
    instanceId: cardInstanceId,
    definitionId,
    definition: definition as LorcanaCard,
    ownerID,
    controllerID,
    zoneID,
    zoneIndex,
    meta,
  } as RuntimeCardWithDefinition;
}
