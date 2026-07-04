import type { CardInstanceId, MoveExecutionContext, MoveInput, PlayerId } from "#core";
import type { LorcanaCard, LorcanaCardMeta, LorcanaG } from "../../types";
import { recomputeLoreToWin } from "../effects/win-condition-effects";
import { applyReplacementEffects } from "../effects/replacement-effects";
import type { ReplacementEvent } from "../effects/replacement-effects";

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

function zoneFromZoneKey(zoneKey: string | undefined): string {
  if (!zoneKey) {
    return "unknown";
  }

  return zoneKey.includes(":") ? zoneKey.split(":", 1)[0] ?? zoneKey : zoneKey;
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

export function attachAdditionalShiftTarget(
  ctx: ShiftStackRuntimeContext,
  newTopId: CardInstanceId,
  oldTopId: CardInstanceId,
  ownerId: PlayerId,
): void {
  const oldTopMeta = ctx.cards.getMeta(String(oldTopId)) as LorcanaCardMeta | undefined;
  const additionalCardsUnder = [oldTopId, ...getCardsUnder(oldTopMeta)];
  const newTopMeta = ctx.cards.getMeta(String(newTopId)) as LorcanaCardMeta | undefined;
  const cardsUnder = [...getCardsUnder(newTopMeta), ...additionalCardsUnder];

  ctx.framework.zones.moveCard(oldTopId, { zone: "limbo", playerId: ownerId });
  ctx.cards.patchMeta(String(newTopId), { cardsUnder });

  for (const underCardId of additionalCardsUnder) {
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
  const replacementMetaPatches = new Map<CardInstanceId, Partial<LorcanaCardMeta>>();

  // Before moving, check if any card in the stack is a location.
  // Characters at that location need their association cleared.
  for (const movedCardId of movedCardIds) {
    if (isLocationDefinition(ctx, movedCardId)) {
      evacuateCharactersFromLocation(ctx, movedCardId);
    }
  }

  for (let index = 0; index < movedCardIds.length; index++) {
    const movedCardId = String(movedCardIds[index]) as CardInstanceId;
    const ownerId =
      (ctx.framework.zones.getCardOwner(movedCardId) as PlayerId | undefined) ??
      (destinationZoneRef.playerId as PlayerId | undefined);
    const sourceZoneKey = ctx.framework.zones.getCardZone(movedCardId);
    let replacedEvent: Extract<ReplacementEvent, { kind: "zone-change" }> | undefined;
    if (ownerId) {
      const zoneChangeEvent: Extract<ReplacementEvent, { kind: "zone-change" }> = {
        kind: "zone-change",
        eventId: `zone-change:${movedCardId}:${zoneFromZoneKey(sourceZoneKey)}:${destinationZoneRef.zone}`,
        controllerId: ownerId,
        cardId: movedCardId,
        playerId: ownerId,
        fromZone: zoneFromZoneKey(sourceZoneKey),
        toZone: destinationZoneRef.zone,
      };
      replacedEvent = applyReplacementEffects(ctx, zoneChangeEvent);
    }
    const moveZoneRef = {
      zone: replacedEvent?.toZone ?? destinationZoneRef.zone,
      playerId: ownerId ?? destinationZoneRef.playerId,
    };
    const moveOptions =
      replacedEvent?.position === "bottom"
        ? { index: 0 }
        : startIndex === undefined
          ? undefined
          : { index: startIndex + index };
    ctx.framework.zones.moveCard(movedCardId, moveZoneRef, moveOptions);
    const metaPatch: Partial<LorcanaCardMeta> = {};
    if (replacedEvent?.replacementState) {
      metaPatch.state = replacedEvent.replacementState;
    }
    if (replacedEvent?.replacementPublicFaceState) {
      metaPatch.publicFaceState = replacedEvent.replacementPublicFaceState;
    }
    if (Object.keys(metaPatch).length > 0) {
      replacementMetaPatches.set(movedCardId, metaPatch);
    }
  }

  for (const movedCardId of movedCardIds) {
    ctx.cards.clearMeta(String(movedCardId));
    const replacementMetaPatch = replacementMetaPatches.get(movedCardId);
    if (replacementMetaPatch) {
      ctx.cards.patchMeta(String(movedCardId), replacementMetaPatch);
    }
  }

  // A card leaving play may remove a win-condition-modification effect.
  recomputeLoreToWin(ctx);

  return movedCardIds;
}

export function detachTemporaryShiftTopCard(
  ctx: ShiftStackRuntimeContext,
  topCardId: CardInstanceId,
  ownerId: PlayerId,
): CardInstanceId | undefined {
  const topMeta = ctx.cards.getMeta(String(topCardId)) as LorcanaCardMeta | undefined;
  const cardsUnder = getCardsUnder(topMeta);
  const restoredTopId = cardsUnder[0];
  if (!restoredTopId) {
    return undefined;
  }

  const remainingUnder = cardsUnder.slice(1);
  ctx.framework.zones.moveCard(topCardId, { zone: "hand", playerId: ownerId });
  ctx.framework.zones.moveCard(restoredTopId, { zone: "play", playerId: ownerId });

  ctx.cards.clearMeta(String(topCardId));
  ctx.cards.setMeta(String(restoredTopId), {
    state: topMeta?.state,
    damage: 0,
    isDrying: topMeta?.isDrying,
    atLocationId: topMeta?.atLocationId,
    temporaryKeywords: cloneRecord(topMeta?.temporaryKeywords),
    temporaryKeywordStarts: cloneRecord(topMeta?.temporaryKeywordStarts),
    temporaryKeywordValues: cloneRecord(topMeta?.temporaryKeywordValues),
    temporaryAbilities: cloneRecord(topMeta?.temporaryAbilities),
    temporaryAbilityStarts: cloneRecord(topMeta?.temporaryAbilityStarts),
    temporaryAbilityPayloads: cloneRecord(topMeta?.temporaryAbilityPayloads),
    temporaryRestrictions: cloneRecord(topMeta?.temporaryRestrictions),
    temporaryRestrictionStarts: cloneRecord(topMeta?.temporaryRestrictionStarts),
    temporaryRestrictionPayloads: cloneRecord(topMeta?.temporaryRestrictionPayloads),
    replacementAbilities: Array.isArray(topMeta?.replacementAbilities)
      ? [...topMeta.replacementAbilities]
      : undefined,
    cardsUnder: remainingUnder.length > 0 ? remainingUnder : undefined,
    stackParentId: undefined,
    playedViaShift: remainingUnder.length > 0 ? true : undefined,
    playedCostType: remainingUnder.length > 0 ? "shift" : undefined,
    temporaryShiftReturnTurn: undefined,
  });

  for (const underCardId of remainingUnder) {
    ctx.cards.patchMeta(String(underCardId), {
      stackParentId: restoredTopId,
      cardsUnder: undefined,
      state: undefined,
      damage: undefined,
      isDrying: undefined,
      atLocationId: undefined,
      playedViaShift: undefined,
      playedCostType: undefined,
      temporaryShiftReturnTurn: undefined,
    });
  }

  recomputeLoreToWin(ctx);
  return restoredTopId;
}
