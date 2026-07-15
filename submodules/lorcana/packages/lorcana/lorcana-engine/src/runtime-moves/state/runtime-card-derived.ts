import type { RuntimeCardDeriver } from "#core";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import type {
  CardInstanceId,
  LorcanaCardMeta,
  LorcanaG,
  ProjectedLorcanaCardDerived,
} from "../../types";
import type { LorcanaCardDerived } from "../../types/projected-board";
import type { PlayerId } from "#core";
import type { StateScopedValueCache } from "../../core/runtime/state-scoped-value-cache";
import { getOrBuildDerivedLorcanaCardProjection } from "./derived-card-cache";
import type { StaticEffectRegistry } from "../../rules/static-effect-registry";
import { buildStaticEffectRegistry } from "../../rules/static-effect-registry";

export const INKWELL_CANDIDATE_QUERY_DSL = {
  selector: "chosen",
  count: 1,
  owner: "you",
  zones: ["hand", "discard"],
} as const;

export {
  canInkThisTurn,
  getAdditionalTurnActionInkAllowance,
  getTurnActionInkLimit,
} from "./turn-action-ink";
export type { TurnActionInkState as TurnActionInkContext } from "./turn-action-ink";

export function createLorcanaRuntimeCardDeriver(
  registry?: StaticEffectRegistry,
): RuntimeCardDeriver {
  return ({ card, state, actorPlayerId, staticResources, runtimeCardCache }) => {
    const getDefinitionByInstanceId = (
      instanceId: CardInstanceId,
    ): LorcanaCardDefinition | undefined => {
      const definitionId = staticResources.instances.get(instanceId)?.definitionId;
      return definitionId ? staticResources.cards.get(definitionId) : undefined;
    };
    // Fallback fresh build kept on purpose: this deriver is invoked from paths
    // that don't carry a `MoveRegistryCtx` (e.g. projection / card-query API
    // construction). When no `registry` is passed, build directly from the raw
    // `state` rather than routing through `getOrBuildMoveRegistry`, which
    // requires a `framework.state` snapshot we don't have here.
    const effectiveRegistry =
      registry ?? buildStaticEffectRegistry(state, getDefinitionByInstanceId);
    const projected = getOrBuildDerivedLorcanaCardProjection({
      runtimeCardCache: runtimeCardCache as
        | StateScopedValueCache<ProjectedLorcanaCardDerived>
        | undefined,
      stateID: state.ctx._stateID,
      definition: card.definition,
      meta: card.meta,
      state,
      cardInstanceId: card.instanceId as CardInstanceId,
      ownerID: card.ownerID as PlayerId,
      controllerID: card.controllerID as PlayerId,
      zoneID: card.zoneID,
      actorPlayerId: actorPlayerId as PlayerId | undefined,
      getDefinitionByInstanceId,
      registry: effectiveRegistry,
    });

    // Apply defaults to produce required LorcanaCardDerived (all fields present)
    return {
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
      grantedAbilityTextEntries: projected.grantedAbilityTextEntries,
    };
  };
}
