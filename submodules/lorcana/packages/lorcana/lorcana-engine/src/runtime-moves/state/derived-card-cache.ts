import type { CardInstanceId, PlayerId } from "#core";
import type { StateScopedValueCache } from "../../core/runtime/state-scoped-value-cache";
import { getOrBuildStateScopedValue } from "../../core/runtime/state-scoped-value-cache";
import { projectLorcanaCardDerived } from "../../projection/card-derived";
import type { DerivedStateContext } from "../../rules/derived-state";
import type { StaticEffectRegistry } from "../../rules/static-effect-registry";
import type {
  LorcanaCardDefinition,
  LorcanaCardMeta,
  ProjectedLorcanaCardDerived,
} from "../../types";

export function getOrBuildDerivedLorcanaCardProjection(args: {
  runtimeCardCache?: StateScopedValueCache<ProjectedLorcanaCardDerived>;
  stateID: number;
  definition?: LorcanaCardDefinition;
  meta?: LorcanaCardMeta;
  state: DerivedStateContext;
  cardInstanceId?: CardInstanceId;
  ownerID?: PlayerId;
  controllerID?: PlayerId;
  zoneID?: string;
  actorPlayerId?: PlayerId;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
  registry: StaticEffectRegistry | undefined;
}): ProjectedLorcanaCardDerived {
  const buildProjection = () =>
    projectLorcanaCardDerived({
      definition: args.definition,
      meta: args.meta,
      state: args.state,
      cardInstanceId: args.cardInstanceId,
      ownerID: args.ownerID,
      controllerID: args.controllerID,
      zoneID: args.zoneID,
      actorPlayerId: args.actorPlayerId,
      getDefinitionByInstanceId: args.getDefinitionByInstanceId,
      registry: args.registry,
    });

  if (!args.runtimeCardCache || !args.cardInstanceId) {
    return buildProjection();
  }

  return getOrBuildStateScopedValue({
    cache: args.runtimeCardCache,
    stateID: args.stateID,
    actorKey: args.actorPlayerId,
    cardId: args.cardInstanceId,
    build: buildProjection,
  });
}
