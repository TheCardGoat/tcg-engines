import type { CardInstanceId, PlayerId } from "#core";
import type { FrameworkStateSnapshot } from "../../core/runtime/match-runtime.types";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import type { LorcanaG } from "../../types";
import { projectLorcanaCardDerived } from "../../projection/card-derived";
import { createProjectionState } from "../../rules/derived-state";
import { getOrBuildMoveRegistry } from "../rules/move-registry-cache";

type BanishSnapshotContext = {
  G: LorcanaG;
  framework: {
    state: FrameworkStateSnapshot;
    zones: {
      getCardOwner(cardId: string): string | undefined;
      getCardController(cardId: string): string | undefined;
      getCardZone(cardId: string): string | undefined;
    };
  };
  cards: {
    getDefinition: (cardId: CardInstanceId) => LorcanaCardDefinition | undefined;
    require: (cardId: CardInstanceId) => {
      meta?: Record<string, unknown>;
    };
  };
};

export function getKeywordsBeforeBanish(
  ctx: BanishSnapshotContext,
  cardId: CardInstanceId,
  actorPlayerId: PlayerId,
): string[] | undefined {
  const definition = ctx.cards.getDefinition(cardId);
  const ownerId = ctx.framework.zones.getCardOwner(cardId) as PlayerId | undefined;
  const controllerId =
    (ctx.framework.zones.getCardController(cardId) as PlayerId | undefined) ?? ownerId;
  if (!definition || !ownerId || !controllerId) {
    return undefined;
  }

  const snapshotRegistry = getOrBuildMoveRegistry(ctx);
  const projected = projectLorcanaCardDerived({
    definition,
    meta: ctx.cards.require(cardId).meta ?? {},
    state: createProjectionState(ctx.framework.state, ctx.G),
    cardInstanceId: cardId,
    ownerID: ownerId,
    controllerID: controllerId,
    zoneID: ctx.framework.zones.getCardZone(cardId),
    actorPlayerId,
    getDefinitionByInstanceId: (id) => ctx.cards.getDefinition(id),
    registry: snapshotRegistry,
  });

  const keywords = projected.keywords?.filter(
    (keyword): keyword is string => typeof keyword === "string",
  );

  return keywords && keywords.length > 0 ? keywords : undefined;
}
