import type { CardInstanceId, MoveInput, PlayerId, MoveValidationContext } from "#core";
import type { ActivatedAbilityDefinition, LorcanaCard } from "@tcg/lorcana-types";
import { normalizeTargetDescriptor, resolveCandidateTargets } from "../../../targeting/runtime";
import type { CardPlayedPayload } from "../../../types/domain-events";

type BanishCharacterCostCandidateContext = Pick<
  MoveValidationContext<MoveInput>,
  "framework" | "cards" | "G"
>;

function getCardDefinitionFromContext(
  ctx: BanishCharacterCostCandidateContext,
  cardId: string,
): LorcanaCard | undefined {
  return ctx.cards.getDefinition(cardId) as LorcanaCard | undefined;
}

function getControlledCardsInPlay(
  ctx: BanishCharacterCostCandidateContext,
  playerId: PlayerId,
): readonly string[] {
  return ctx.framework.zones.getCards({ zone: "play", playerId });
}

/**
 * Legal characters in play that may be banished to pay `ability.cost.banishCharacter`,
 * including when `banishCharacterTargetDsl` constrains the choice.
 */
export function getBanishCharacterCostCandidateIds(
  ctx: BanishCharacterCostCandidateContext,
  currentPlayer: PlayerId,
  ability: ActivatedAbilityDefinition,
  sourceCardId: CardInstanceId | undefined,
): CardInstanceId[] {
  const cost = ability.cost ?? {};
  const targetDsl = cost.banishCharacterTargetDsl;
  if (targetDsl !== undefined && targetDsl !== null) {
    if (!sourceCardId) {
      return [];
    }
    const sourceDefinition = getCardDefinitionFromContext(ctx, sourceCardId);
    if (!sourceDefinition) {
      return [];
    }
    const cardPlayed: CardPlayedPayload = {
      playerId: currentPlayer,
      cardId: sourceCardId,
      cardType:
        sourceDefinition.cardType === "character" ||
        sourceDefinition.cardType === "item" ||
        sourceDefinition.cardType === "location" ||
        sourceDefinition.cardType === "action"
          ? sourceDefinition.cardType
          : "item",
      costType: "free",
    };
    const descriptor = normalizeTargetDescriptor(targetDsl);
    if (!descriptor) {
      return [];
    }
    const resolved = resolveCandidateTargets(
      ctx as Parameters<typeof resolveCandidateTargets>[0],
      cardPlayed,
      descriptor,
      {
        controllerId: currentPlayer,
        sourceCardId,
      },
    );
    const inPlay = new Set(getControlledCardsInPlay(ctx, currentPlayer));
    let filtered = resolved.filter((cardId) => {
      if (!inPlay.has(cardId)) {
        return false;
      }
      const definition = getCardDefinitionFromContext(ctx, cardId);
      return definition?.cardType === "character";
    });
    if (cost.banishCharacterTarget === "another" && sourceCardId) {
      filtered = filtered.filter((cardId) => cardId !== sourceCardId);
    }
    return filtered as CardInstanceId[];
  }

  return getControlledCardsInPlay(ctx, currentPlayer).filter((cardId) => {
    if (cost.banishCharacterTarget === "another" && sourceCardId && cardId === sourceCardId) {
      return false;
    }
    const definition = getCardDefinitionFromContext(ctx, cardId);
    return definition?.cardType === "character";
  }) as CardInstanceId[];
}
