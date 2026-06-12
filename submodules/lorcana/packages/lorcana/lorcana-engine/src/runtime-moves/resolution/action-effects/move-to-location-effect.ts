import type { GainLoreEffect, MoveToLocationEffect } from "@tcg/lorcana-types";
import type { CardInstanceId } from "#core";
import type { CardPlayedPayload } from "../../../types";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { normalizeSelectedTargets, resolveEffectTargets } from "../../../targeting/runtime";
import { handleUnsupportedActionEffect } from "./unsupported-action-effect";
import { getEffectTargetSelectionInput } from "./selection-state";
import { emitTriggeredLorcanaEvent } from "../../effects/triggered-abilities";
import { isGainLoreEffect, resolveGainLoreEffect } from "./gain-lore-effect";
import { isSlotted } from "../../../targeting/slotted-targets";

export function isMoveToLocationEffect(effect: unknown): effect is MoveToLocationEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "move-to-location"
  );
}

function asCardType(value: unknown): string | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const cardType = (value as { cardType?: unknown }).cardType;
  return typeof cardType === "string" ? cardType : undefined;
}

function resolveLocationAndCharacters(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: MoveToLocationEffect,
  resolutionInput: ActionResolutionInput,
): { locationId?: CardInstanceId; characterIds: CardInstanceId[] } {
  // Slot-aware path: `move-to-location` slotted input has `subject` (character)
  // and `location` keys. Resolve each independently against its descriptor.
  const slottedInput = isSlotted(resolutionInput.slottedTargets, "move-to-location")
    ? resolutionInput.slottedTargets
    : undefined;
  const characterInput = slottedInput
    ? [...slottedInput.subject]
    : getEffectTargetSelectionInput(effect.character, resolutionInput);
  const locationInput = slottedInput
    ? [...slottedInput.location]
    : getEffectTargetSelectionInput(effect.location, resolutionInput);

  const characterSelection = normalizeSelectedTargets(characterInput) ?? [];
  const locationSelection = normalizeSelectedTargets(locationInput) ?? [];
  const characterTargetCards =
    resolveEffectTargets(
      ctx,
      cardPlayed,
      effect.character,
      characterInput,
      resolutionInput.eventSnapshot,
    ) ?? [];
  const locationTargetCards =
    resolveEffectTargets(
      ctx,
      cardPlayed,
      effect.location,
      locationInput,
      resolutionInput.eventSnapshot,
    ) ?? [];
  const candidateCards = [
    ...locationTargetCards,
    ...characterTargetCards,
    ...locationSelection,
    ...characterSelection,
  ];

  const selfCardType = asCardType(ctx.cards.getDefinition(cardPlayed.cardId));
  const isSelfLocationTarget = (effect.location as unknown) === "this";
  const selfLocationId =
    isSelfLocationTarget && selfCardType === "location" ? cardPlayed.cardId : undefined;
  const locationId =
    selfLocationId ??
    candidateCards.find((cardId) => asCardType(ctx.cards.getDefinition(cardId)) === "location");

  const characterIds = [...new Set([...characterTargetCards, ...characterSelection])].filter(
    (cardId) => asCardType(ctx.cards.getDefinition(cardId)) === "character",
  );

  return { locationId, characterIds };
}

export function resolveMoveToLocationEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: MoveToLocationEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const { locationId, characterIds } = resolveLocationAndCharacters(
    ctx,
    cardPlayed,
    effect,
    resolutionInput,
  );

  if (!locationId) {
    handleUnsupportedActionEffect(
      "move-to-location",
      "move-to-location requires a selected location target",
    );
    return;
  }

  if (characterIds.length === 0 && !effect.includeSelf) {
    return;
  }

  // Collect all character IDs to move, optionally including the source card itself
  const sourceCardType = effect.includeSelf
    ? asCardType(ctx.cards.getDefinition(cardPlayed.cardId))
    : undefined;
  const allCharacterIds =
    effect.includeSelf && sourceCardType === "character"
      ? [...new Set([...characterIds, cardPlayed.cardId])]
      : characterIds;

  let movedCount = 0;
  for (const characterId of allCharacterIds) {
    const cardType = asCardType(ctx.cards.getDefinition(characterId));
    if (cardType !== "character") {
      continue;
    }

    const currentMeta = ctx.cards.require(characterId).meta ?? {};
    const currentLocationId = currentMeta.atLocationId as CardInstanceId | undefined;

    ctx.cards.patchMeta(characterId, {
      ...currentMeta,
      atLocationId: locationId,
    });

    emitTriggeredLorcanaEvent(
      ctx,
      "cardMoved",
      {
        cardId: characterId,
        fromZone: currentLocationId ? `location:${currentLocationId}` : "play",
        toZone: `location:${locationId}`,
        playerId: cardPlayed.playerId,
      },
      {
        event: "move",
        fromZone: currentLocationId ? `location:${currentLocationId}` : "play",
        toZone: `location:${locationId}`,
        playerId: cardPlayed.playerId,
        subjectCardId: characterId,
        triggerSourceCardId: cardPlayed.cardId,
        eventSnapshot: {
          subjectAtLocationId: locationId,
        },
      },
    );
    movedCount++;
  }

  // Execute forEach sub-effects once per character moved
  if (effect.forEach && movedCount > 0) {
    for (const subEffect of effect.forEach) {
      if (isGainLoreEffect(subEffect)) {
        const amount =
          typeof (subEffect as GainLoreEffect).amount === "number"
            ? (subEffect as GainLoreEffect).amount
            : 1;
        resolveGainLoreEffect(ctx, cardPlayed, subEffect as GainLoreEffect, {
          gainAmount: (amount as number) * movedCount,
        });
      }
    }
  }
}
