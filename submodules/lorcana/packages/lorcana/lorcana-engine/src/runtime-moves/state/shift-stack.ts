import type { CardInstanceId, MoveExecutionContext, MoveInput, PlayerId } from "#core";
import type { LorcanaCard, LorcanaCardMeta, LorcanaG } from "../../types";
import { recomputeLoreToWin } from "../effects/win-condition-effects";

type ZoneRefLike = { zone: string; playerId?: PlayerId | string };

type ShiftStackRuntimeContext = Pick<MoveExecutionContext<MoveInput>, "cards" | "framework" | "G">;

function getCardsUnder(meta: LorcanaCardMeta | undefined): CardInstanceId[] {
  return Array.isArray(meta?.cardsUnder) ? [...meta.cardsUnder] : [];
}

function cloneRecord<T>(value: T | undefined): T | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  return { ...value };
}

export function getStackedCardIds(
  ctx: Pick<ShiftStackRuntimeContext, "cards">,
  cardId: CardInstanceId,
): CardInstanceId[] {
  const cardMeta = ctx.cards.getMeta(String(cardId)) as LorcanaCardMeta | undefined;
  return [cardId, ...getCardsUnder(cardMeta)];
}

export function attachShiftStack(
  ctx: ShiftStackRuntimeContext,
  newTopId: CardInstanceId,
  oldTopId: CardInstanceId,
  ownerId: PlayerId,
  inheritedMeta?: Partial<LorcanaCardMeta>,
): void {
  const oldTopMeta = ctx.cards.getMeta(String(oldTopId)) as LorcanaCardMeta | undefined;
  const inherited = inheritedMeta ?? oldTopMeta;
  const cardsUnder = [oldTopId, ...getCardsUnder(oldTopMeta)];

  // Shift targets leave play while remaining associated under the new top card.
  ctx.framework.zones.moveCard(oldTopId, { zone: "limbo", playerId: ownerId });

  ctx.cards.setMeta(String(newTopId), {
    state: inherited?.state,
    damage: inherited?.damage,
    isDrying: inherited?.isDrying,
    atLocationId: inherited?.atLocationId,
    temporaryKeywords: cloneRecord(inherited?.temporaryKeywords),
    temporaryKeywordStarts: cloneRecord(inherited?.temporaryKeywordStarts),
    temporaryKeywordValues: cloneRecord(inherited?.temporaryKeywordValues),
    temporaryAbilities: cloneRecord(inherited?.temporaryAbilities),
    temporaryAbilityStarts: cloneRecord(inherited?.temporaryAbilityStarts),
    temporaryAbilityPayloads: cloneRecord(inherited?.temporaryAbilityPayloads),
    temporaryRestrictions: cloneRecord(inherited?.temporaryRestrictions),
    temporaryRestrictionStarts: cloneRecord(inherited?.temporaryRestrictionStarts),
    temporaryRestrictionPayloads: cloneRecord(inherited?.temporaryRestrictionPayloads),
    replacementAbilities: Array.isArray(inherited?.replacementAbilities)
      ? [...inherited.replacementAbilities]
      : undefined,
    cardsUnder,
    stackParentId: undefined,
  });

  for (const underCardId of cardsUnder) {
    ctx.cards.setMeta(String(underCardId), {
      stackParentId: newTopId,
      cardsUnder: undefined,
      state: undefined,
      damage: undefined,
      isDrying: undefined,
      atLocationId: undefined,
      playedViaShift: undefined,
      playedCostType: undefined,
    });
  }
}

/**
 * Returns the card IDs of characters currently at the given location.
 */
export function getCharacterIdsAtLocation(
  ctx: ShiftStackRuntimeContext,
  locationCardId: CardInstanceId,
): CardInstanceId[] {
  const playerIds = ctx.framework.state.playerIds ?? [];
  const result: CardInstanceId[] = [];

  for (const playerId of playerIds) {
    const playCards = ctx.framework.zones.getCards({
      zone: "play",
      playerId,
    }) as CardInstanceId[];

    for (const cardId of playCards) {
      const meta = ctx.cards.getMeta(String(cardId)) as LorcanaCardMeta | undefined;
      if (meta?.atLocationId === locationCardId) {
        result.push(cardId);
      }
    }
  }

  return result;
}

/**
 * When a location leaves play, characters that were at that location
 * must have their `atLocationId` cleared (Lorcana rule: characters
 * simply lose their location association when the location is banished).
 */
function evacuateCharactersFromLocation(
  ctx: ShiftStackRuntimeContext,
  locationCardId: CardInstanceId,
): void {
  const playerIds = ctx.framework.state.playerIds ?? [];

  for (const playerId of playerIds) {
    const playCards = ctx.framework.zones.getCards({
      zone: "play",
      playerId,
    }) as CardInstanceId[];

    for (const cardId of playCards) {
      const meta = ctx.cards.getMeta(String(cardId)) as LorcanaCardMeta | undefined;
      if (meta?.atLocationId === locationCardId) {
        ctx.cards.setMeta(String(cardId), {
          ...meta,
          atLocationId: undefined,
        });
      }
    }
  }
}

function isLocationDefinition(ctx: ShiftStackRuntimeContext, cardId: CardInstanceId): boolean {
  const definition = ctx.cards.getDefinition(cardId) as { cardType?: string } | undefined;
  return definition?.cardType === "location";
}

export function moveCardOutOfPlayWithStack(
  ctx: ShiftStackRuntimeContext,
  cardId: CardInstanceId,
  destinationZoneRef: ZoneRefLike,
  options?: { index?: number },
): CardInstanceId[] {
  const movedCardIds = getStackedCardIds(ctx, cardId);
  const startIndex = options?.index;

  // Before moving, check if any card in the stack is a location.
  // Characters at that location need their association cleared.
  for (const movedCardId of movedCardIds) {
    if (isLocationDefinition(ctx, movedCardId)) {
      evacuateCharactersFromLocation(ctx, movedCardId);
    }
  }

  for (let index = 0; index < movedCardIds.length; index++) {
    const moveOptions = startIndex === undefined ? undefined : { index: startIndex + index };
    ctx.framework.zones.moveCard(String(movedCardIds[index]), destinationZoneRef, moveOptions);
  }

  for (const movedCardId of movedCardIds) {
    ctx.cards.clearMeta(String(movedCardId));
  }

  // A card leaving play may remove a win-condition-modification effect.
  recomputeLoreToWin(ctx);

  return movedCardIds;
}
