import type { CardInstanceId } from "#core";
import { buildLorcanaRuntimeCardView } from "./card-view-utils";
import type {
  LorcanaCardDefinition,
  LorcanaDynamicCard,
  LorcanaMatchState,
  LorcanaProjectedCard,
} from "./types";

type ResolveDefinitionIdArgs = {
  cardInstanceId: CardInstanceId;
  projectedCard?: LorcanaProjectedCard;
  definition: LorcanaCardDefinition;
};

export type BuildLorcanaDynamicCardArgs = {
  cardInstanceId: CardInstanceId;
  projectedCard?: LorcanaProjectedCard;
  getDefinitionByInstanceId: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
  resolveDefinitionId?: (args: ResolveDefinitionIdArgs) => string | undefined;
  defaultOwnerId: string;
  defaultControllerId?: string;
  getState: () => LorcanaMatchState;
  actorPlayerId?: string;
};

export function buildLorcanaDynamicCard({
  cardInstanceId,
  projectedCard,
  getDefinitionByInstanceId,
  resolveDefinitionId,
  defaultOwnerId,
  defaultControllerId,
  getState,
  actorPlayerId,
}: BuildLorcanaDynamicCardArgs): LorcanaDynamicCard {
  const definition = getDefinitionByInstanceId(cardInstanceId);
  if (!definition) {
    throw new Error(`Card definition not found for instance '${cardInstanceId}'`);
  }

  const ownerID = projectedCard?.ownerId ?? defaultOwnerId;
  const controllerID =
    projectedCard?.controllerId ?? projectedCard?.ownerId ?? defaultControllerId ?? ownerID;

  return buildLorcanaRuntimeCardView({
    cardInstanceId,
    definition,
    definitionId:
      resolveDefinitionId?.({ cardInstanceId, projectedCard, definition }) ??
      definition.id ??
      cardInstanceId,
    ownerID,
    controllerID,
    zoneID: projectedCard?.zone,
    zoneIndex: projectedCard?.zoneIndex,
    getState,
    actorPlayerId,
    getDefinitionByInstanceId,
  }) as LorcanaDynamicCard;
}
