import type { PacketAnimation, PacketAnimationContext } from "#core";
import type { LorcanaBoardZoneId, LorcanaCardMeta, LorcanaG } from "../types";
import type { LorcanaCardDefinition } from "@tcg/lorcana-types";
import { flattenSlottedTargets, isSlottedTargetInput } from "../targeting/slotted-targets";

const BOARD_CENTER_ANCHOR_ID = "board:center";

function parseZoneId(zoneId?: string): LorcanaBoardZoneId | null {
  const baseZoneId = zoneId?.split(":")[0];
  switch (baseZoneId) {
    case "hand":
    case "play":
    case "inkwell":
    case "discard":
      return baseZoneId;
    default:
      return null;
  }
}

function resolvePlayVariant(
  definition?: LorcanaCardDefinition,
  costType?: string,
): LorcanaBoardMoveAnimationVariant | null {
  switch (definition?.cardType) {
    case "character":
      return costType === "shift" ? "play-character-shift" : "play-character";
    case "item":
      return "play-item";
    case "location":
      return "play-location";
    case "action":
      return costType === "sing" || costType === "singTogether"
        ? "play-action-sing"
        : "play-action";
    default:
      return null;
  }
}

function getCardIdFromArgs(args: object): string | null {
  if (!("cardId" in args) || typeof args.cardId !== "string") {
    return null;
  }

  return args.cardId;
}

function resolveActorSide(context: PacketAnimationContext): "playerOne" | "playerTwo" | null {
  const playerIds = context.nextState.ctx.playerIds;
  if (playerIds[0] === context.playerId) {
    return "playerOne";
  }
  if (playerIds[1] === context.playerId) {
    return "playerTwo";
  }
  return null;
}

function getPlayerLore(state: { G: LorcanaG }, playerId: string): number {
  return Number(state.G.lore[playerId as keyof typeof state.G.lore] ?? 0);
}

function findCardZone(
  state: { ctx: { zones: { private: { zoneCards: Record<string, string[]> } } } },
  cardId: string,
  ownerId: string,
): LorcanaBoardZoneId | null {
  for (const zone of ["hand", "play", "inkwell", "discard"] as const) {
    const key = `${zone}:${ownerId}`;
    const cards = state.ctx.zones.private.zoneCards[key];
    if (Array.isArray(cards) && cards.includes(cardId)) {
      return zone;
    }
  }
  return null;
}

export type LorcanaBoardMoveAnimationVariant =
  | "banish"
  | "draw"
  | "ink-faceDown"
  | "ink-faceUp"
  | "move-to-location"
  | "play-action"
  | "play-action-sing"
  | "play-character"
  | "play-character-shift"
  | "play-item"
  | "play-location";

export type LorcanaBoardMoveAnimationPlayback = "parallel" | "serial";
export type LorcanaBoardMoveAnimationPhase = "cause" | "consequence";

type CardActionPlayerAnimationPayload = {
  cardId: string;
  player: string;
};

type LorcanaBoardMoveAnimationPayload = {
  actorPlayerId: string;
  actorSide: "playerOne" | "playerTwo";
  cardId: string;
  destinationZoneId: LorcanaBoardZoneId;
  groupId: string;
  impactAt: "destination" | "via";
  phase: LorcanaBoardMoveAnimationPhase;
  playback: LorcanaBoardMoveAnimationPlayback;
  renderFace: "faceUp" | "faceDown";
  sourceZoneId: LorcanaBoardZoneId;
  variant: LorcanaBoardMoveAnimationVariant;
  viaAnchorId?: typeof BOARD_CENTER_ANCHOR_ID;
};

export type LorcanaQuestAnimationPayload = {
  actorPlayerId: string;
  actorSide: "playerOne" | "playerTwo";
  cardId: string;
  loreGained: number;
};

export type LorcanaChallengeAnimationPayload = {
  actorSide: "playerOne" | "playerTwo";
  attackerId: string;
  defenderId: string;
  defenderKind: "character" | "location";
  attackerDamageDealt: number;
  defenderDamageDealt: number;
  attackerWouldBeBanished: boolean;
  defenderWouldBeBanished: boolean;
};

export type LorcanaActionAnimationTargetPayload = {
  cardId: string;
  wasBanished: boolean;
};

export type LorcanaActionAnimationPayload = {
  actorSide: "playerOne" | "playerTwo";
  actionCardId: string;
  targets: readonly LorcanaActionAnimationTargetPayload[];
};

export type LorcanaTurnChangeAnimationPayload = {
  previousPlayerId: string;
  nextPlayerId: string;
  nextPlayerSide: "playerOne" | "playerTwo";
  turnNumber: number;
};

export type LorcanaConcedeAnimationPayload = {
  concedingPlayerId: string;
  concedingSide: "playerOne" | "playerTwo";
};

export type LorcanaCardEffectAnimationPayload = {
  actorSide: "playerOne" | "playerTwo";
  cardId: string;
  effectKind: "activate-ability" | "sing" | "resolve-effect";
};

export type LorcanaMulliganAnimationPayload = {
  actorSide: "playerOne" | "playerTwo";
  mulliganCount: number;
};

export type LorcanaPlayerEffectAnimationPayload = {
  actorSide: "playerOne" | "playerTwo";
  cardId: string;
  targetSides: readonly ("playerOne" | "playerTwo")[];
};

type LorcanaPacketAnimationPayloads = {
  "lorcana.action": LorcanaActionAnimationPayload;
  "lorcana.boardMove": LorcanaBoardMoveAnimationPayload;
  "lorcana.cardEffect": LorcanaCardEffectAnimationPayload;
  "lorcana.challenge": LorcanaChallengeAnimationPayload;
  "lorcana.concede": LorcanaConcedeAnimationPayload;
  "lorcana.mulligan": LorcanaMulliganAnimationPayload;
  "lorcana.playerEffect": LorcanaPlayerEffectAnimationPayload;
  "lorcana.quest": LorcanaQuestAnimationPayload;
  "lorcana.turnChange": LorcanaTurnChangeAnimationPayload;
  "play.action": CardActionPlayerAnimationPayload;
};

export type LorcanaPacketAnimation = {
  [TKind in keyof LorcanaPacketAnimationPayloads]: PacketAnimation<
    TKind,
    LorcanaPacketAnimationPayloads[TKind]
  >;
}[keyof LorcanaPacketAnimationPayloads];

function detectPlayerStateChanges(
  context: PacketAnimationContext,
): readonly ("playerOne" | "playerTwo")[] {
  const playerIds = context.nextState.ctx.playerIds;
  const previousLore = context.previousState.G.lore as Record<string, number>;
  const nextLore = context.nextState.G.lore as Record<string, number>;
  const previousZoneCards = context.previousState.ctx.zones.private.zoneCards;
  const nextZoneCards = context.nextState.ctx.zones.private.zoneCards;
  const previousRestrictions =
    (
      context.previousState.G as {
        temporaryPlayerRestrictions?: {
          restrictionsByPlayer?: Record<string, Record<string, number>>;
        };
      }
    ).temporaryPlayerRestrictions?.restrictionsByPlayer ?? {};
  const nextRestrictions =
    (
      context.nextState.G as {
        temporaryPlayerRestrictions?: {
          restrictionsByPlayer?: Record<string, Record<string, number>>;
        };
      }
    ).temporaryPlayerRestrictions?.restrictionsByPlayer ?? {};

  const result: ("playerOne" | "playerTwo")[] = [];

  for (let i = 0; i < 2; i++) {
    const playerId = playerIds[i];
    const side = i === 0 ? "playerOne" : "playerTwo";

    if (previousLore[playerId] !== nextLore[playerId]) {
      result.push(side);
      continue;
    }

    const handKey = `hand:${playerId}`;
    const prevHandCount = (previousZoneCards[handKey] as string[] | undefined)?.length ?? 0;
    const nextHandCount = (nextZoneCards[handKey] as string[] | undefined)?.length ?? 0;
    if (prevHandCount !== nextHandCount) {
      result.push(side);
      continue;
    }

    const prevPlayerRestrictions = previousRestrictions[playerId] ?? {};
    const nextPlayerRestrictions = nextRestrictions[playerId] ?? {};
    const prevKeys = Object.keys(prevPlayerRestrictions).length;
    const nextKeys = Object.keys(nextPlayerRestrictions).length;
    if (prevKeys !== nextKeys) {
      result.push(side);
    }
  }

  return result;
}

function detectBanishAnimations(
  context: PacketAnimationContext,
  commandId: string,
): LorcanaPacketAnimation[] {
  const previousZoneCards = context.previousState.ctx.zones.private.zoneCards;
  const nextZoneCards = context.nextState.ctx.zones.private.zoneCards;
  const playerIds = context.nextState.ctx.playerIds;
  const animations: LorcanaPacketAnimation[] = [];

  for (const playerId of playerIds) {
    const playKey = `play:${playerId}`;
    const discardKey = `discard:${playerId}`;
    const previousPlay = previousZoneCards[playKey];
    const nextDiscard = nextZoneCards[discardKey];
    const previousDiscard = previousZoneCards[discardKey];

    if (!Array.isArray(previousPlay) || !Array.isArray(nextDiscard)) {
      continue;
    }

    const actorSide: "playerOne" | "playerTwo" =
      playerIds[0] === playerId ? "playerOne" : "playerTwo";

    for (const cardId of previousPlay) {
      const movedToDiscard = nextDiscard.includes(cardId);
      const alreadyInDiscard = Array.isArray(previousDiscard) && previousDiscard.includes(cardId);

      if (movedToDiscard && !alreadyInDiscard) {
        animations.push({
          id: `${commandId}:banish:${cardId}`,
          kind: "lorcana.boardMove",
          payload: {
            actorPlayerId: playerId,
            actorSide,
            cardId,
            destinationZoneId: "discard",
            groupId: commandId,
            impactAt: "destination",
            phase: "consequence",
            playback: "parallel",
            renderFace: "faceUp",
            sourceZoneId: "play",
            variant: "banish",
          },
        });
      }
    }
  }

  return animations;
}

function detectDrawAnimations(
  context: PacketAnimationContext,
  commandId: string,
): LorcanaPacketAnimation[] {
  const previousZoneCards = context.previousState.ctx.zones.private.zoneCards;
  const nextZoneCards = context.nextState.ctx.zones.private.zoneCards;
  const playerIds = context.nextState.ctx.playerIds;
  const animations: LorcanaPacketAnimation[] = [];

  for (const playerId of playerIds) {
    const deckKey = `deck:${playerId}`;
    const handKey = `hand:${playerId}`;
    const previousDeck = previousZoneCards[deckKey];
    const nextDeck = nextZoneCards[deckKey];
    const previousHand = previousZoneCards[handKey];
    const nextHand = nextZoneCards[handKey];

    if (
      !Array.isArray(previousDeck) ||
      !Array.isArray(nextDeck) ||
      !Array.isArray(previousHand) ||
      !Array.isArray(nextHand)
    ) {
      continue;
    }

    const previousDeckSet = new Set(previousDeck);
    const previousHandSet = new Set(previousHand);
    const actorSide: "playerOne" | "playerTwo" =
      playerIds[0] === playerId ? "playerOne" : "playerTwo";

    for (const cardId of nextHand) {
      if (
        previousHandSet.has(cardId) ||
        !previousDeckSet.has(cardId) ||
        nextDeck.includes(cardId)
      ) {
        continue;
      }

      animations.push({
        id: `${commandId}:draw:${cardId}`,
        kind: "lorcana.boardMove",
        payload: {
          actorPlayerId: playerId,
          actorSide,
          cardId,
          destinationZoneId: "hand",
          groupId: commandId,
          impactAt: "destination",
          phase: "consequence",
          playback: "serial",
          renderFace: "faceDown",
          sourceZoneId: "deck",
          variant: "draw",
        },
      });
    }
  }

  return animations;
}

function detectMoveToLocationAnimations(
  context: PacketAnimationContext,
  commandId: string,
  phase: LorcanaBoardMoveAnimationPhase = "consequence",
  candidates: ReadonlyMap<string, string> = new Map(),
): LorcanaPacketAnimation[] {
  const previousCardMeta = context.previousState.ctx.zones.private.cardMeta;
  const nextCardMeta = context.nextState.ctx.zones.private.cardMeta;
  const previousZoneCards = context.previousState.ctx.zones.private.zoneCards;
  const nextZoneCards = context.nextState.ctx.zones.private.zoneCards;
  const playerIds = context.nextState.ctx.playerIds;
  const animations: LorcanaPacketAnimation[] = [];

  for (const playerId of playerIds) {
    const playKey = `play:${playerId}`;
    const previousPlay = previousZoneCards[playKey];
    const nextPlay = nextZoneCards[playKey];

    if (!Array.isArray(previousPlay) || !Array.isArray(nextPlay)) {
      continue;
    }

    const actorSide: "playerOne" | "playerTwo" =
      playerIds[0] === playerId ? "playerOne" : "playerTwo";

    for (const cardId of nextPlay) {
      if (!previousPlay.includes(cardId)) {
        continue;
      }

      const previousLocationId = (previousCardMeta[cardId] as LorcanaCardMeta | undefined)
        ?.atLocationId;
      const nextLocationId = (nextCardMeta[cardId] as LorcanaCardMeta | undefined)?.atLocationId;
      const candidateLocationId = candidates.get(cardId);

      if (
        typeof nextLocationId !== "string" ||
        (typeof previousLocationId === "string" && previousLocationId === nextLocationId) ||
        (typeof candidateLocationId === "string" && candidateLocationId !== nextLocationId) ||
        !nextPlay.includes(nextLocationId)
      ) {
        continue;
      }

      animations.push({
        id: `${commandId}:move-to-location:${cardId}`,
        kind: "lorcana.boardMove",
        payload: {
          actorPlayerId: playerId,
          actorSide,
          cardId,
          destinationZoneId: "play",
          groupId: commandId,
          impactAt: "destination",
          phase,
          playback: "serial",
          renderFace: "faceUp",
          sourceZoneId: "play",
          variant: "move-to-location",
        },
      });
    }
  }

  return animations;
}

function getTargetIdsFromValue(context: PacketAnimationContext, targets: unknown): string[] {
  if (typeof targets === "string") {
    return context.staticResources.instances.has(targets) ? [targets] : [];
  }

  if (!Array.isArray(targets)) {
    if (isSlottedTargetInput(targets)) {
      return flattenSlottedTargets(targets)
        .map((target) => String(target))
        .filter((target) => context.staticResources.instances.has(target));
    }
    return [];
  }

  return targets.filter(
    (target): target is string =>
      typeof target === "string" && context.staticResources.instances.has(target),
  );
}

function getTargetIdsFromArgs(context: PacketAnimationContext, args: object): string[] {
  return "targets" in args ? getTargetIdsFromValue(context, args.targets) : [];
}

function getMoveToLocationCandidatesFromTargets(
  targets: readonly string[],
): ReadonlyMap<string, string> {
  if (targets.length < 2) {
    return new Map();
  }

  const candidates = new Map<string, string>();
  const locationId = targets[targets.length - 1];
  for (const cardId of targets.slice(0, -1)) {
    candidates.set(cardId, locationId);
  }
  return candidates;
}

function getMoveToLocationCandidatesFromArgs(
  context: PacketAnimationContext,
  args: object,
): ReadonlyMap<string, string> {
  return getMoveToLocationCandidatesFromTargets(getTargetIdsFromArgs(context, args));
}

function getTargetIdsFromParams(context: PacketAnimationContext, args: object): string[] {
  if (!("params" in args) || args.params === null || typeof args.params !== "object") {
    return [];
  }

  const params = args.params as { targets?: unknown };
  return getTargetIdsFromValue(context, params.targets);
}

function getMoveToLocationCandidatesFromParams(
  context: PacketAnimationContext,
  args: object,
): ReadonlyMap<string, string> {
  return getMoveToLocationCandidatesFromTargets(getTargetIdsFromParams(context, args));
}

function wasCardBanishedByCommand(context: PacketAnimationContext, cardId: string): boolean {
  const instance = context.staticResources.instances.get(cardId);
  const ownerId = instance?.ownerID;
  if (!ownerId) {
    return false;
  }

  const previousZoneCards = context.previousState.ctx.zones.private.zoneCards;
  const nextZoneCards = context.nextState.ctx.zones.private.zoneCards;
  const previousPlay = previousZoneCards[`play:${ownerId}`];
  const previousDiscard = previousZoneCards[`discard:${ownerId}`];
  const nextDiscard = nextZoneCards[`discard:${ownerId}`];

  return (
    Array.isArray(previousPlay) &&
    Array.isArray(nextDiscard) &&
    previousPlay.includes(cardId) &&
    nextDiscard.includes(cardId) &&
    (!Array.isArray(previousDiscard) || !previousDiscard.includes(cardId))
  );
}

export function deriveLorcanaPacketAnimations(
  context: PacketAnimationContext,
): readonly LorcanaPacketAnimation[] {
  const { command, staticResources } = context;

  if (
    !staticResources ||
    !command.input ||
    command.input.args === null ||
    typeof command.input.args !== "object"
  ) {
    return [];
  }

  if (command.move === "challenge") {
    const actorSide = resolveActorSide(context);
    const args = command.input.args as { attackerId?: string; defenderId?: string };
    const attackerId = typeof args.attackerId === "string" ? args.attackerId : null;
    const defenderId = typeof args.defenderId === "string" ? args.defenderId : null;

    if (!actorSide || !attackerId || !defenderId) {
      return [];
    }

    const defenderInstance = staticResources.instances.get(defenderId);
    const defenderDef = defenderInstance
      ? (staticResources.cards.get(defenderInstance.definitionId) as
          | LorcanaCardDefinition
          | undefined)
      : undefined;
    const defenderKind: "character" | "location" =
      defenderDef?.cardType === "location" ? "location" : "character";

    const previousCardMeta = context.previousState.ctx.zones.private.cardMeta;
    const nextCardMeta = context.nextState.ctx.zones.private.cardMeta;
    const previousZoneCards = context.previousState.ctx.zones.private.zoneCards;
    const nextZoneCards = context.nextState.ctx.zones.private.zoneCards;

    const attackerInstance = staticResources.instances.get(attackerId);
    const attackerDef = attackerInstance
      ? (staticResources.cards.get(attackerInstance.definitionId) as
          | LorcanaCardDefinition
          | undefined)
      : undefined;

    const previousAttackerMeta = previousCardMeta[attackerId] as LorcanaCardMeta | undefined;
    const nextAttackerMeta = nextCardMeta[attackerId] as LorcanaCardMeta | undefined;
    const previousDefenderMeta = previousCardMeta[defenderId] as LorcanaCardMeta | undefined;
    const nextDefenderMeta = nextCardMeta[defenderId] as LorcanaCardMeta | undefined;

    const attackerOwner = attackerInstance?.ownerID;
    const defenderOwner = defenderInstance?.ownerID;

    const isInDiscard = (cardId: string, ownerId: string | undefined): boolean => {
      if (!ownerId) return false;
      const discardKey = `discard:${ownerId}`;
      const nextDiscard = nextZoneCards[discardKey];
      const previousDiscard = previousZoneCards[discardKey];
      return (
        Array.isArray(nextDiscard) &&
        nextDiscard.includes(cardId) &&
        (!Array.isArray(previousDiscard) || !previousDiscard.includes(cardId))
      );
    };

    const attackerWouldBeBanished = isInDiscard(attackerId, attackerOwner);
    const defenderWouldBeBanished = isInDiscard(defenderId, defenderOwner);

    // Compute damage dealt by looking at the damage delta.
    // When a card is banished its damage counter may be reset in nextState, so
    // fall back to the card's strength. When delta is zero AND the card was NOT
    // banished, damage was prevented — show 0, not the raw strength.
    const defenderDamageDelta =
      (nextDefenderMeta?.damage ?? 0) - (previousDefenderMeta?.damage ?? 0);
    let attackerDamageDealt =
      defenderDamageDelta > 0
        ? defenderDamageDelta
        : defenderWouldBeBanished
          ? (attackerDef?.strength ?? 0)
          : 0;
    const attackerDamageDelta =
      defenderKind === "character"
        ? (nextAttackerMeta?.damage ?? 0) - (previousAttackerMeta?.damage ?? 0)
        : 0;
    const defenderDamageDealt =
      defenderKind === "character"
        ? attackerDamageDelta > 0
          ? attackerDamageDelta
          : attackerWouldBeBanished
            ? (defenderDef?.strength ?? 0)
            : 0
        : 0;

    if (
      defenderKind === "location" &&
      defenderWouldBeBanished &&
      defenderDamageDelta <= 0 &&
      defenderDef?.cardType === "location" &&
      !nextDefenderMeta
    ) {
      const previousDamage = previousDefenderMeta?.damage ?? 0;
      const locationWillpower = defenderDef.willpower ?? 0;
      if (locationWillpower > 0 && previousDamage < locationWillpower) {
        const finishingDamage = locationWillpower - previousDamage;
        const strengthCap =
          typeof attackerDef?.strength === "number" ? attackerDef.strength : finishingDamage;
        attackerDamageDealt = Math.max(0, Math.min(finishingDamage, strengthCap));
      }
    }

    return [
      {
        id: `${command.commandID}:challenge:${attackerId}:${defenderId}`,
        kind: "lorcana.challenge",
        payload: {
          actorSide,
          attackerId,
          defenderId,
          defenderKind,
          attackerDamageDealt: Math.max(0, attackerDamageDealt),
          defenderDamageDealt: Math.max(0, defenderDamageDealt),
          attackerWouldBeBanished,
          defenderWouldBeBanished,
        },
      },
      ...detectBanishAnimations(context, command.commandID),
    ];
  }

  if (command.move === "quest") {
    const cardId = getCardIdFromArgs(command.input.args);
    const actorSide = resolveActorSide(context);
    if (!cardId || !actorSide) {
      return [];
    }

    const loreGained =
      getPlayerLore(context.nextState, context.playerId) -
      getPlayerLore(context.previousState, context.playerId);

    return [
      {
        id: `${command.commandID}:quest:${cardId}`,
        kind: "lorcana.quest",
        payload: {
          actorPlayerId: context.playerId,
          actorSide,
          cardId,
          loreGained: Math.max(0, loreGained),
        },
      },
    ];
  }

  if (command.move === "questWithAll") {
    const actorSide = resolveActorSide(context);
    if (!actorSide) {
      return [];
    }

    const previousCardMeta = context.previousState.ctx.zones.private.cardMeta;
    const nextCardMeta = context.nextState.ctx.zones.private.cardMeta;
    const animations: LorcanaPacketAnimation[] = [];

    for (const [cardId, nextMeta] of Object.entries(nextCardMeta)) {
      const previousMeta = previousCardMeta[cardId] as LorcanaCardMeta | undefined;
      if (
        (nextMeta as LorcanaCardMeta | undefined)?.state === "exerted" &&
        previousMeta?.state !== "exerted"
      ) {
        const instanceRecord = staticResources.instances.get(cardId);
        const cardDef = instanceRecord
          ? staticResources.cards.get(instanceRecord.definitionId)
          : undefined;
        const loreValue = (cardDef as LorcanaCardDefinition | undefined)?.lore ?? 0;

        animations.push({
          id: `${command.commandID}:quest:${cardId}`,
          kind: "lorcana.quest",
          payload: {
            actorPlayerId: context.playerId,
            actorSide,
            cardId,
            loreGained: loreValue,
          },
        });
      }
    }

    return animations;
  }

  if (command.move === "putCardIntoInkwell") {
    const cardId = getCardIdFromArgs(command.input.args);
    const actorSide = resolveActorSide(context);
    if (!cardId || !actorSide) {
      return [];
    }

    const cardInstanceRecord = staticResources.instances.get(cardId);
    if (!cardInstanceRecord) {
      return [];
    }

    const nextCardMeta = context.nextState.ctx.zones.private.cardMeta;
    const meta = nextCardMeta[cardId] as LorcanaCardMeta | undefined;
    const renderFace: "faceUp" | "faceDown" = meta?.faceDown === false ? "faceUp" : "faceDown";
    const sourceZoneId =
      findCardZone(context.previousState, cardId, cardInstanceRecord.ownerID) ?? "hand";

    return [
      {
        id: `${command.commandID}:ink:${cardId}`,
        kind: "lorcana.boardMove",
        payload: {
          actorPlayerId: context.playerId,
          actorSide,
          cardId,
          destinationZoneId: "inkwell",
          groupId: command.commandID,
          impactAt: "destination",
          phase: "cause",
          playback: "serial",
          renderFace,
          sourceZoneId,
          variant: renderFace === "faceUp" ? "ink-faceUp" : "ink-faceDown",
        },
      },
    ];
  }

  if (command.move === "playCard") {
    const cardPlayedId = getCardIdFromArgs(command.input.args);

    if (!cardPlayedId) {
      return [];
    }

    const cardInstanceRecord = staticResources.instances.get(cardPlayedId);
    const cardDefinition = staticResources.cards.get(cardInstanceRecord?.definitionId || "");
    const actorSide = resolveActorSide(context);

    if (!cardInstanceRecord || !actorSide) {
      return [];
    }

    const costType = (command.input.args as { cost?: string }).cost;
    const variant = resolvePlayVariant(cardDefinition as LorcanaCardDefinition, costType);
    if (!variant) {
      return [];
    }

    const animations: LorcanaPacketAnimation[] = [];
    const isActionPlay = variant === "play-action" || variant === "play-action-sing";
    const destinationZoneId: LorcanaBoardZoneId = isActionPlay ? "discard" : "play";

    animations.push({
      id: `${command.commandID}:play:${cardPlayedId}`,
      kind: "lorcana.boardMove",
      payload: {
        actorPlayerId: context.playerId,
        actorSide,
        cardId: cardPlayedId,
        destinationZoneId,
        groupId: command.commandID,
        impactAt: "via",
        phase: "cause",
        playback: "serial",
        renderFace: "faceUp",
        sourceZoneId: "hand",
        variant,
        viaAnchorId: BOARD_CENTER_ANCHOR_ID,
      },
    });

    // Keep play.action packet for action card spell effect overlay
    if (isActionPlay) {
      const targetIds = getTargetIdsFromArgs(context, command.input.args);
      if (targetIds.length > 0) {
        animations.push({
          id: `${command.commandID}:action:${cardPlayedId}`,
          kind: "lorcana.action",
          payload: {
            actorSide,
            actionCardId: cardPlayedId,
            targets: targetIds.map((targetId) => ({
              cardId: targetId,
              wasBanished: wasCardBanishedByCommand(context, targetId),
            })),
          },
        });
      }

      animations.push({
        id: `${command.commandID}:play-action-effect:${cardPlayedId}`,
        kind: "play.action",
        payload: {
          cardId: cardInstanceRecord.definitionId,
          player: cardInstanceRecord.ownerID,
        },
      });
    }

    animations.push(...detectDrawAnimations(context, command.commandID));
    animations.push(
      ...detectMoveToLocationAnimations(
        context,
        command.commandID,
        "consequence",
        getMoveToLocationCandidatesFromArgs(context, command.input.args),
      ),
    );
    animations.push(...detectBanishAnimations(context, command.commandID));

    return animations;
  }

  if (command.move === "moveCharacterToLocation") {
    const args = command.input.args as { characterId?: string; locationId?: string };
    const characterId = typeof args.characterId === "string" ? args.characterId : null;
    const locationId = typeof args.locationId === "string" ? args.locationId : null;
    const candidates =
      characterId && locationId ? new Map([[characterId, locationId]]) : new Map<string, string>();
    return detectMoveToLocationAnimations(context, command.commandID, "cause", candidates);
  }

  if (command.move === "passTurn") {
    const playerIds = context.nextState.ctx.playerIds;
    const previousPlayerId = context.playerId;
    const nextPlayerId = playerIds[0] === previousPlayerId ? playerIds[1] : playerIds[0];
    const nextPlayerSide: "playerOne" | "playerTwo" =
      playerIds[0] === nextPlayerId ? "playerOne" : "playerTwo";
    const turnNumber = context.nextState.ctx.status?.turn ?? 0;

    return [
      {
        id: `${command.commandID}:turnChange`,
        kind: "lorcana.turnChange",
        payload: {
          previousPlayerId,
          nextPlayerId,
          nextPlayerSide,
          turnNumber,
        },
      },
      ...detectDrawAnimations(context, command.commandID),
    ];
  }

  if (command.move === "concede") {
    const actorSide = resolveActorSide(context);
    if (!actorSide) {
      return [];
    }

    return [
      {
        id: `${command.commandID}:concede`,
        kind: "lorcana.concede",
        payload: {
          concedingPlayerId: context.playerId,
          concedingSide: actorSide,
        },
      },
    ];
  }

  if (command.move === "activateAbility") {
    const cardId = getCardIdFromArgs(command.input.args);
    const actorSide = resolveActorSide(context);
    if (!cardId || !actorSide) {
      return [];
    }

    return [
      {
        id: `${command.commandID}:cardEffect:${cardId}`,
        kind: "lorcana.cardEffect",
        payload: {
          actorSide,
          cardId,
          effectKind: "activate-ability",
        },
      },
      ...detectDrawAnimations(context, command.commandID),
      ...detectMoveToLocationAnimations(
        context,
        command.commandID,
        "consequence",
        getMoveToLocationCandidatesFromArgs(context, command.input.args),
      ),
      ...detectBanishAnimations(context, command.commandID),
    ];
  }

  if (command.move === "resolveBag") {
    const args = command.input.args as { bagId?: string };
    const actorSide = resolveActorSide(context);
    if (!actorSide || typeof args.bagId !== "string") {
      return [];
    }

    const bagItems = context.previousState.G.triggeredAbilities?.bag?.items;
    const bagItem = Array.isArray(bagItems)
      ? bagItems.find((item: { id?: string }) => item.id === args.bagId)
      : undefined;
    const sourceId =
      bagItem && typeof bagItem === "object" && "sourceId" in bagItem
        ? (bagItem as { sourceId?: string }).sourceId
        : undefined;

    if (typeof sourceId !== "string") {
      return [];
    }

    const bagTargetSides = detectPlayerStateChanges(context);
    const bagAnimations: LorcanaPacketAnimation[] = [
      {
        id: `${command.commandID}:cardEffect:${sourceId}`,
        kind: "lorcana.cardEffect",
        payload: {
          actorSide,
          cardId: sourceId,
          effectKind: "resolve-effect",
        },
      },
      ...detectDrawAnimations(context, command.commandID),
      ...detectMoveToLocationAnimations(
        context,
        command.commandID,
        "consequence",
        getMoveToLocationCandidatesFromParams(context, command.input.args),
      ),
      ...detectBanishAnimations(context, command.commandID),
    ];
    if (bagTargetSides.length > 0) {
      bagAnimations.push({
        id: `${command.commandID}:playerEffect:${sourceId}`,
        kind: "lorcana.playerEffect",
        payload: { actorSide, cardId: sourceId, targetSides: bagTargetSides },
      });
    }
    return bagAnimations;
  }

  if (command.move === "resolveEffect") {
    const args = command.input.args as { effectId?: string };
    const actorSide = resolveActorSide(context);
    if (!actorSide || typeof args.effectId !== "string") {
      return [];
    }

    const pendingEffects = context.previousState.G.pendingEffects;
    const effect = Array.isArray(pendingEffects)
      ? pendingEffects.find((e: { id?: string }) => e.id === args.effectId)
      : undefined;
    const sourceId =
      effect && typeof effect === "object" && "sourceId" in effect
        ? (effect as { sourceId?: string }).sourceId
        : undefined;

    if (typeof sourceId !== "string") {
      return [];
    }

    const effectTargetSides = detectPlayerStateChanges(context);
    const effectAnimations: LorcanaPacketAnimation[] = [
      {
        id: `${command.commandID}:cardEffect:${sourceId}`,
        kind: "lorcana.cardEffect",
        payload: {
          actorSide,
          cardId: sourceId,
          effectKind: "resolve-effect",
        },
      },
      ...detectDrawAnimations(context, command.commandID),
      ...detectMoveToLocationAnimations(
        context,
        command.commandID,
        "consequence",
        getMoveToLocationCandidatesFromParams(context, command.input.args),
      ),
      ...detectBanishAnimations(context, command.commandID),
    ];
    if (effectTargetSides.length > 0) {
      effectAnimations.push({
        id: `${command.commandID}:playerEffect:${sourceId}`,
        kind: "lorcana.playerEffect",
        payload: { actorSide, cardId: sourceId, targetSides: effectTargetSides },
      });
    }
    return effectAnimations;
  }

  if (command.move === "alterHand") {
    const actorSide = resolveActorSide(context);
    if (!actorSide) {
      return [];
    }

    const args = command.input.args as { cardsToMulligan?: string[] };
    const mulliganCount = Array.isArray(args.cardsToMulligan) ? args.cardsToMulligan.length : 0;

    return [
      {
        id: `${command.commandID}:mulligan`,
        kind: "lorcana.mulligan",
        payload: {
          actorSide,
          mulliganCount,
        },
      },
    ];
  }

  if (command.move === "sing") {
    const args = command.input.args as { singerId?: string; songId?: string };
    const singerId = typeof args.singerId === "string" ? args.singerId : null;
    const songId = typeof args.songId === "string" ? args.songId : null;
    const actorSide = resolveActorSide(context);
    if (!singerId || !songId || !actorSide) {
      return [];
    }

    return [
      {
        id: `${command.commandID}:cardEffect:${singerId}`,
        kind: "lorcana.cardEffect",
        payload: {
          actorSide,
          cardId: singerId,
          effectKind: "sing",
        },
      },
      {
        id: `${command.commandID}:play:${songId}`,
        kind: "lorcana.boardMove",
        payload: {
          actorPlayerId: context.playerId,
          actorSide,
          cardId: songId,
          destinationZoneId: "discard",
          groupId: command.commandID,
          impactAt: "via",
          phase: "cause",
          playback: "serial",
          renderFace: "faceUp",
          sourceZoneId: "hand",
          variant: "play-action",
          viaAnchorId: BOARD_CENTER_ANCHOR_ID,
        },
      },
    ];
  }

  if (command.move === "singTogether") {
    const args = command.input.args as { singerIds?: string[]; songId?: string };
    const singerIds = Array.isArray(args.singerIds) ? args.singerIds : [];
    const songId = typeof args.songId === "string" ? args.songId : null;
    const actorSide = resolveActorSide(context);
    if (singerIds.length === 0 || !songId || !actorSide) {
      return [];
    }

    const animations: LorcanaPacketAnimation[] = singerIds
      .filter((id): id is string => typeof id === "string")
      .map((singerId) => ({
        id: `${command.commandID}:cardEffect:${singerId}`,
        kind: "lorcana.cardEffect" as const,
        payload: {
          actorSide,
          cardId: singerId,
          effectKind: "sing" as const,
        },
      }));

    animations.push({
      id: `${command.commandID}:play:${songId}`,
      kind: "lorcana.boardMove",
      payload: {
        actorPlayerId: context.playerId,
        actorSide,
        cardId: songId,
        destinationZoneId: "discard",
        groupId: command.commandID,
        impactAt: "via",
        phase: "cause",
        playback: "serial",
        renderFace: "faceUp",
        sourceZoneId: "hand",
        variant: "play-action",
        viaAnchorId: BOARD_CENTER_ANCHOR_ID,
      },
    });

    return animations;
  }

  return [];
}
