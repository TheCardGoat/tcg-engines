import {
  buildEngineProjectionSnapshot,
  type EngineBoardProjection,
  type RuntimeBoardProjectionContext,
  type ViewRoleContext,
  type MatchStaticResources,
  type CardInstanceId,
  type PlayerId,
} from "#core";
import type { FrameworkStateSnapshot, RuntimeCardWithDefinition } from "../core/runtime";
import { resolvePriorityPlayer } from "../core/runtime/match-runtime.priority";
import { resolveTurnOwnerId } from "../core/runtime/turn-owner";
import {
  createCardQueryAPIForState,
  createTimeQueryAPI,
  createZoneQueryAPI,
} from "../core/runtime/match-runtime.apis";
import type {
  LorcanaCard,
  LorcanaCardDefinition,
  LorcanaCardMeta,
  LorcanaG,
  LorcanaMatchState,
  LorcanaProjectedBoardView,
  LorcanaProjectedCard,
  LorcanaProjectedCardId,
  ProjectedLorcanaCardDerived,
  LorcanaProjectedPlayerBoard,
} from "../types";
import { buildResolutionSelectionContext } from "../runtime-moves/resolution/action-effects/selection-context";
import { getLegalOrOptionIndices } from "../runtime-moves/resolution/action-effects/composed-effect-resolver";
import type { ActionResolutionInput } from "../runtime-moves/resolution/action-effects/types";
import { getActivePlayFromUnderPermissions } from "../runtime-moves/effects/play-from-under-permissions";
import type { ResolutionSelectionRuntimeContext } from "../runtime-moves/resolution/action-effects/selection-context";
import {
  projectLorcanaCardDerived,
  createDefaultProjectedLorcanaCardDerived,
} from "../projection/card-derived";
import {
  canInkThisTurn,
  createLorcanaRuntimeCardDeriver,
} from "../runtime-moves/state/runtime-card-derived";
import { getOrBuildDerivedLorcanaCardProjection } from "../runtime-moves/state/derived-card-cache";
import type { StateScopedValueCache } from "../core/runtime/state-scoped-value-cache";
import { buildStaticEffectRegistry } from "../rules/static-effect-registry";
import { buildZoneRegistry } from "../core/runtime/zone-registry";
import { lorcanaRuntimeZones } from "../zones";

export type LorcanaBoardProjection = EngineBoardProjection;

const EMPTY_QUERY_API = {
  getActionIntents: () => [],
  getLegalActions: () => [],
  explainIllegal: () => undefined,
};

function resolveTurnPlayer(state: LorcanaMatchState): PlayerId | null {
  return resolveTurnOwnerId(state.ctx, state.G) ?? null;
}

function getDefinitionForInstance(
  staticResources: MatchStaticResources,
  instanceId: string,
): { definitionId?: string; definition?: LorcanaCardDefinition } {
  const record = staticResources.instances.get(instanceId);
  const definitionId = record?.definitionId;
  return {
    definitionId,
    definition: definitionId
      ? (staticResources.cards.get(definitionId) as LorcanaCardDefinition | undefined)
      : undefined,
  };
}

function createSelectionRuntimeContext(
  state: LorcanaMatchState,
  staticResources: MatchStaticResources,
  roleCtx: ViewRoleContext,
  runtimeCardCache?: StateScopedValueCache<ProjectedLorcanaCardDerived>,
): ResolutionSelectionRuntimeContext {
  const actorPlayerId =
    roleCtx.role === "player" ? (roleCtx.playerID as PlayerId | undefined) : undefined;
  const frameworkState: FrameworkStateSnapshot = {
    priority: state.ctx.priority,
    status: state.ctx.status,
    _zonesPrivate: state.ctx.zones.private,
    _zonesPublic: state.ctx.zones.public,
    playerIds: [...state.ctx.playerIds] as PlayerId[],
    turn: state.ctx.status.turn ?? 0,
    phase: state.ctx.status.phase,
    step: state.ctx.status.step,
    gameSegment: state.ctx.status.gameSegment,
    currentPlayer: resolveTurnPlayer(state) ?? (state.ctx.priority.holder as PlayerId | undefined),
    stateID: state.ctx._stateID,
    matchID: state.ctx.matchID,
    gameID: state.ctx.gameID,
    gameEnded: state.ctx.status.gameEnded,
  };
  const selectionGetDefn = (instanceId: string) => {
    const record = staticResources.instances.get(instanceId);
    const defId = record?.definitionId;
    return defId
      ? (staticResources.cards.get(defId) as LorcanaCardDefinition | undefined)
      : undefined;
  };
  // Projection paths run outside move execution, so `state` is the raw
  // projection state rather than a `MoveRegistryCtx`. Build directly — the
  // cached registry would require a `framework.state` snapshot we don't have.
  const selectionRegistry = buildStaticEffectRegistry(state, selectionGetDefn);
  const rawCards = createCardQueryAPIForState(
    state,
    staticResources,
    createLorcanaRuntimeCardDeriver(selectionRegistry),
    actorPlayerId,
    runtimeCardCache,
  );
  const adaptRuntimeCard = (runtimeCard: RuntimeCardWithDefinition): RuntimeCardWithDefinition => ({
    ...runtimeCard,
    definition: runtimeCard.definition as LorcanaCard,
  });
  const projectRuntimeCard = <TResult>(
    runtimeCard: RuntimeCardWithDefinition,
    projector?: (card: RuntimeCardWithDefinition) => TResult,
  ): TResult => {
    const adaptedRuntimeCard = adaptRuntimeCard(runtimeCard);
    return projector ? projector(adaptedRuntimeCard) : (adaptedRuntimeCard as TResult);
  };
  const cards: ResolutionSelectionRuntimeContext["cards"] = {
    get: (cardId) => {
      const runtimeCard = rawCards.get(cardId);
      return runtimeCard ? adaptRuntimeCard(runtimeCard as RuntimeCardWithDefinition) : undefined;
    },
    require: (cardId) => {
      const runtimeCard = rawCards.get(cardId);
      if (!runtimeCard) {
        throw new Error(`Unknown card: ${cardId}`);
      }
      return adaptRuntimeCard(runtimeCard as RuntimeCardWithDefinition);
    },
    getDefinition: (cardId) => rawCards.getDefinition(cardId) as LorcanaCard | undefined,
    getDefinitionById: (definitionId) =>
      rawCards.getDefinitionById(definitionId) as LorcanaCard | undefined,
    getMeta: (cardId) => rawCards.getMeta(cardId),
    inZone: (zoneId) =>
      rawCards
        .inZone(zoneId)
        .map((runtimeCard) => adaptRuntimeCard(runtimeCard as RuntimeCardWithDefinition)),
    queryTargetDsl: rawCards.queryTargetDsl
      ? (targetDsl, projector) =>
          rawCards.queryTargetDsl?.(targetDsl, (runtimeCard) =>
            projectRuntimeCard(runtimeCard as RuntimeCardWithDefinition, projector),
          ) ?? []
      : undefined,
    queryRuntime: (targetDsl, projector) =>
      rawCards.queryRuntime(targetDsl, (runtimeCard) =>
        projectRuntimeCard(runtimeCard as RuntimeCardWithDefinition, projector),
      ),
  };
  const zones = createZoneQueryAPI(
    state,
    rawCards,
    buildZoneRegistry(lorcanaRuntimeZones, state.ctx.playerIds),
  );
  const time = createTimeQueryAPI(state);
  const framework: ResolutionSelectionRuntimeContext["framework"] = {
    state: frameworkState,
    zones,
    time,
    cards,
  };

  return {
    G: state.G,
    playerId: actorPlayerId,
    framework,
    cards,
  };
}

function buildVisibleCard(args: {
  cardId: string;
  zone: LorcanaProjectedCard["zone"];
  rawBoard: LorcanaBoardProjection;
  rawCards: ReturnType<typeof createCardQueryAPIForState>;
}): LorcanaProjectedCard {
  const { cardId, zone, rawBoard, rawCards } = args;
  const projection = rawBoard.cards[cardId];
  const runtimeCard = rawCards.require(cardId) as RuntimeCardWithDefinition &
    ProjectedLorcanaCardDerived;

  return {
    id: cardId as CardInstanceId,
    ownerId: runtimeCard.ownerID as PlayerId,
    zone,
    controllerId: runtimeCard.controllerID as PlayerId,
    zoneIndex: projection?.zoneIndex,
    definitionId: runtimeCard.definitionId,
    atLocationId: runtimeCard.meta.atLocationId as CardInstanceId | undefined,
    cardsUnder: Array.isArray(runtimeCard.meta.cardsUnder)
      ? [...(runtimeCard.meta.cardsUnder as CardInstanceId[])]
      : undefined,
    stackParentId: runtimeCard.meta.stackParentId as CardInstanceId | undefined,
    playedViaShift: runtimeCard.meta.playedViaShift === true ? true : undefined,
    publicFaceState:
      runtimeCard.meta.publicFaceState === "faceUp" ||
      runtimeCard.meta.publicFaceState === "faceDown"
        ? (runtimeCard.meta.publicFaceState as "faceUp" | "faceDown")
        : undefined,
    strength: runtimeCard.strength,
    willpower: runtimeCard.willpower,
    lore: runtimeCard.lore,
    playCost: runtimeCard.playCost,
    shiftInkCost: runtimeCard.shiftInkCost,
    shiftPlayCost: runtimeCard.shiftPlayCost,
    moveCost: runtimeCard.moveCost,
    damage: runtimeCard.damage,
    exerted: runtimeCard.exerted,
    drying: runtimeCard.drying,
    canBePutInInkwell: runtimeCard.canBePutInInkwell,
    hasSupport: runtimeCard.hasSupport,
    hasRush: runtimeCard.hasRush,
    hasReckless: runtimeCard.hasReckless,
    hasEvasive: runtimeCard.hasEvasive,
    hasQuestRestriction: runtimeCard.hasQuestRestriction,
    fullName: runtimeCard.fullName,
    cardType: runtimeCard.definition.cardType,
    keywords: runtimeCard.keywords,
    keywordValues: runtimeCard.keywordValues,
    classifications: runtimeCard.classifications,
    temporaryAbilities: runtimeCard.temporaryAbilities,
    temporaryAbilityStarts: runtimeCard.temporaryAbilityStarts,
    temporaryRestrictions: runtimeCard.temporaryRestrictions,
    temporaryRestrictionStarts: runtimeCard.temporaryRestrictionStarts,
    grantedAbilityTextEntries: runtimeCard.grantedAbilityTextEntries,
    keywordGrantSources: runtimeCard.keywordGrantSources,
    statModifierSources: runtimeCard.statModifierSources,
  };
}

function buildHiddenCard(args: {
  state: LorcanaMatchState;
  zone: LorcanaProjectedCard["zone"];
  ownerId: PlayerId;
  slotIndex: number;
  rawCardId?: string;
  rawBoard: LorcanaBoardProjection;
  staticResources: MatchStaticResources;
  runtimeCardCache?: StateScopedValueCache<ProjectedLorcanaCardDerived>;
  registry: ReturnType<typeof buildStaticEffectRegistry>;
}): LorcanaProjectedCard {
  const {
    state,
    zone,
    ownerId,
    slotIndex,
    rawCardId,
    rawBoard,
    staticResources,
    runtimeCardCache,
    registry,
  } = args;
  const meta = rawCardId
    ? (rawBoard.cards[rawCardId]?.meta as LorcanaCardMeta | undefined)
    : undefined;
  const derived = rawCardId
    ? getOrBuildDerivedLorcanaCardProjection({
        runtimeCardCache,
        stateID: state.ctx._stateID,
        state,
        meta,
        cardInstanceId: rawCardId as CardInstanceId,
        ownerID: ownerId,
        controllerID: ownerId,
        zoneID: rawBoard.cards[rawCardId]?.zoneId,
        getDefinitionByInstanceId: (instanceId) =>
          getDefinitionForInstance(staticResources, instanceId).definition,
        registry,
      })
    : createDefaultProjectedLorcanaCardDerived();

  return {
    id: rawCardId ? (rawCardId as CardInstanceId) : `hidden:${zone}:${ownerId}:${slotIndex}`,
    ownerId,
    zone,
    zoneIndex: slotIndex,
    hidden: true,
    ...derived,
  };
}

function projectTimerView(
  state: LorcanaMatchState,
  serverTimestamp: number,
): LorcanaProjectedBoardView["timerView"] {
  const time = state.ctx.time;

  if (time.mode === "none") {
    return { serverTimestamp };
  }

  // Chess and dynamic modes support the per-decision cap and expose
  // isInNegativeTime / timeoutCount on the per-player state. Priority mode has
  // none of these, so we default them.
  const hasDecisionCap = time.mode === "chess" || time.mode === "dynamic";
  const configMaxDecisionTimeMs = hasDecisionCap ? time.config.maxDecisionTimeMs : undefined;
  const accumulatedMs = hasDecisionCap ? (time.activePlayerAccumulatedMs ?? 0) : undefined;

  const players: LorcanaProjectedBoardView["timerView"]["players"] = {};

  for (const playerId of state.ctx.playerIds) {
    const playerState = time.players[String(playerId)];
    const isRunning = time.running && time.activePlayerID === playerId;

    players[String(playerId)] = {
      reserveMsRemaining: playerState?.reserveMsRemaining ?? 0,
      isRunning,
      startedAtMs: isRunning ? time.startedAtMs : undefined,
      timeoutCount: playerState && "timeoutCount" in playerState ? playerState.timeoutCount : 0,
      isInNegativeTime:
        playerState && "isInNegativeTime" in playerState ? playerState.isInNegativeTime : false,
      activePlayerAccumulatedMs: isRunning ? accumulatedMs : undefined,
      maxDecisionTimeMs: isRunning ? configMaxDecisionTimeMs : undefined,
    };
  }

  return {
    serverTimestamp,
    players,
  };
}

function isCardVisibleViaReveal(
  state: LorcanaMatchState,
  cardId: string,
  roleCtx: ViewRoleContext,
): boolean {
  if (roleCtx.role === "judge") {
    return true;
  }

  return state.ctx.zones.reveals.active.some((reveal) => {
    if (!reveal.cardIDs.includes(cardId)) {
      return false;
    }

    if (reveal.visibleTo === "all") {
      return true;
    }

    return (
      roleCtx.role === "player" && !!roleCtx.playerID && reveal.visibleTo.includes(roleCtx.playerID)
    );
  });
}

function isPublicProjectionZone(zoneKey: string | undefined): boolean {
  return (
    zoneKey === "play" ||
    zoneKey?.startsWith("play:") === true ||
    zoneKey === "discard" ||
    zoneKey?.startsWith("discard:") === true
  );
}

function isCardVisibleToRole(
  state: LorcanaMatchState,
  cardId: string,
  roleCtx: ViewRoleContext,
): boolean {
  if (roleCtx.role === "judge") {
    return true;
  }

  const indexEntry = state.ctx.zones.private.cardIndex[cardId];
  if (!indexEntry) {
    return false;
  }

  if (state.ctx.zones.private.cardMeta[cardId]?.publicFaceState === "faceUp") {
    return true;
  }

  if (isPublicProjectionZone(indexEntry.zoneKey)) {
    return true;
  }

  if (roleCtx.role === "player" && roleCtx.playerID === indexEntry.ownerID) {
    return true;
  }

  return isCardVisibleViaReveal(state, cardId, roleCtx);
}

function sanitizeProjectedBagPayload(
  value: unknown,
  state: LorcanaMatchState,
  roleCtx: ViewRoleContext,
): unknown {
  if (roleCtx.role === "judge") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeProjectedBagPayload(entry, state, roleCtx));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (
      key === "subjectCardId" &&
      typeof child === "string" &&
      !isCardVisibleToRole(state, child, roleCtx)
    ) {
      continue;
    }

    sanitized[key] = sanitizeProjectedBagPayload(child, state, roleCtx);
  }

  return sanitized;
}

function staticRevealAffectsPlayer(args: {
  sourceControllerId?: PlayerId;
  targetPlayerId: PlayerId;
  target: unknown;
}): boolean {
  const { sourceControllerId, targetPlayerId, target } = args;
  return (
    target === "EACH_PLAYER" ||
    target === "ALL_PLAYERS" ||
    (target === "CONTROLLER" && sourceControllerId === targetPlayerId) ||
    (target === "OPPONENT" &&
      sourceControllerId !== undefined &&
      sourceControllerId !== targetPlayerId)
  );
}

function isTopDeckCardVisibleViaStaticEffect(args: {
  state: LorcanaMatchState;
  staticResources: MatchStaticResources;
  rawBoard: LorcanaBoardProjection;
  targetPlayerId: PlayerId;
}): boolean {
  const { state, staticResources, rawBoard, targetPlayerId } = args;

  for (const [sourceId, entry] of Object.entries(state.ctx.zones.private.cardIndex)) {
    const zoneKey = entry?.zoneKey;
    if (typeof zoneKey !== "string" || (zoneKey !== "play" && !zoneKey.startsWith("play:"))) {
      continue;
    }

    const definitionId =
      rawBoard.cards[sourceId]?.definitionId ??
      staticResources.instances.get(sourceId)?.definitionId;
    const definition = definitionId
      ? (staticResources.cards.get(definitionId) as LorcanaCardDefinition | undefined)
      : undefined;
    if (!definition) {
      continue;
    }

    for (const ability of definition.abilities ?? []) {
      if (
        ability.type !== "static" ||
        !ability.effect ||
        (ability.effect as { type?: unknown }).type !== "reveal-top-card"
      ) {
        continue;
      }

      const revealTopEffect = ability.effect as { target?: unknown };

      if (
        staticRevealAffectsPlayer({
          sourceControllerId: entry.controllerID as PlayerId | undefined,
          targetPlayerId,
          target: revealTopEffect.target,
        })
      ) {
        return true;
      }
    }
  }

  return false;
}

function projectPlayerBoard(args: {
  state: LorcanaMatchState;
  rawBoard: LorcanaBoardProjection;
  staticResources: MatchStaticResources;
  roleCtx: ViewRoleContext;
  playerId: PlayerId;
  cards: Record<string, LorcanaProjectedCard>;
  rawCards: ReturnType<typeof createCardQueryAPIForState>;
  runtimeCardCache?: StateScopedValueCache<ProjectedLorcanaCardDerived>;
  registry: ReturnType<typeof buildStaticEffectRegistry>;
}): LorcanaProjectedPlayerBoard {
  const {
    state,
    rawBoard,
    staticResources,
    roleCtx,
    playerId,
    cards,
    rawCards,
    runtimeCardCache,
    registry,
  } = args;
  const actorPlayerId =
    roleCtx.role === "player" ? (roleCtx.playerID as PlayerId | undefined) : undefined;
  const registerCard = (projectedCard: LorcanaProjectedCard): LorcanaProjectedCardId => {
    cards[String(projectedCard.id)] = projectedCard;
    return projectedCard.id;
  };

  const canSeeHand = actorPlayerId === playerId;
  const handZone = rawBoard.zones[`hand:${playerId}`];
  const playZone = rawBoard.zones[`play:${playerId}`];
  const inkwellZone = rawBoard.zones[`inkwell:${playerId}`];
  const discardZone = rawBoard.zones[`discard:${playerId}`];
  const deckZone = rawBoard.zones[`deck:${playerId}`];
  const limboZone = rawBoard.zones[`limbo:${playerId}`];
  const authoritativeDeckCards = state.ctx.zones.private.zoneCards[`deck:${playerId}`] as
    | string[]
    | undefined;
  const indexedTopDeckCardId =
    authoritativeDeckCards === undefined || authoritativeDeckCards.length === 0
      ? (Object.entries(state.ctx.zones.private.cardIndex).reduce<{
          cardId?: string;
          index: number;
        }>(
          (best, [cardId, entry]) => {
            if (entry?.zoneKey !== `deck:${playerId}`) {
              return best;
            }

            const index = typeof entry.index === "number" ? entry.index : -1;
            return index > best.index ? { cardId, index } : best;
          },
          { cardId: undefined, index: -1 },
        ).cardId ?? undefined)
      : undefined;
  const topDeckCardId = isTopDeckCardVisibleViaStaticEffect({
    state,
    staticResources,
    rawBoard,
    targetPlayerId: playerId,
  })
    ? Array.isArray(authoritativeDeckCards) && authoritativeDeckCards.length > 0
      ? authoritativeDeckCards[authoritativeDeckCards.length - 1]
      : indexedTopDeckCardId
    : undefined;

  const hand = (handZone?.cards ?? []).map((cardId, index) => {
    if (canSeeHand || isCardVisibleViaReveal(state, cardId, roleCtx)) {
      return registerCard(
        buildVisibleCard({
          cardId,
          zone: "hand",
          rawBoard,
          rawCards,
        }),
      );
    }

    return registerCard(
      buildHiddenCard({
        state,
        zone: "hand",
        ownerId: playerId,
        slotIndex: index,
        rawBoard,
        staticResources,
        runtimeCardCache,
        registry,
      }),
    );
  });

  const play = (playZone?.cards ?? []).map((cardId) =>
    registerCard(
      buildVisibleCard({
        cardId,
        zone: "play",
        rawBoard,
        rawCards,
      }),
    ),
  );

  const inkwell = Array.from({ length: inkwellZone?.count ?? 0 }, (_, index) => {
    const cardId = inkwellZone?.cards[index];
    if (cardId && isCardVisibleViaReveal(state, cardId, roleCtx)) {
      return registerCard(
        buildVisibleCard({
          cardId,
          zone: "inkwell",
          rawBoard,
          rawCards,
        }),
      );
    }

    return registerCard(
      buildHiddenCard({
        state,
        zone: "inkwell",
        ownerId: playerId,
        slotIndex: index,
        rawCardId: cardId,
        rawBoard,
        staticResources,
        runtimeCardCache,
        registry,
      }),
    );
  });

  const discard = (discardZone?.cards ?? []).map((cardId) =>
    registerCard(
      buildVisibleCard({
        cardId,
        zone: "discard",
        rawBoard,
        rawCards,
      }),
    ),
  );

  // Limbo is projected for card lookup and previews, even though it is not rendered as a board lane.
  // Cards with publicFaceState "faceUp" (e.g. Black Cauldron under-cards) are visible;
  // cards without it (e.g. Boost cards) are hidden from the opponent.
  for (const cardId of limboZone?.cards ?? []) {
    const limboCardMeta = rawBoard.cards[cardId]?.meta as LorcanaCardMeta | undefined;
    const isFaceUp = limboCardMeta?.publicFaceState === "faceUp";
    if (isFaceUp) {
      registerCard(
        buildVisibleCard({
          cardId,
          zone: "limbo",
          rawBoard,
          rawCards,
        }),
      );
    } else {
      registerCard(
        buildHiddenCard({
          state,
          zone: "limbo",
          ownerId: playerId,
          slotIndex: 0,
          rawCardId: cardId,
          rawBoard,
          staticResources,
          runtimeCardCache,
          registry,
        }),
      );
    }
  }

  // Extend top-deck reveal to also cover temporary reveal windows (e.g. triggered scry)
  const deckTopFromReveal = !topDeckCardId
    ? authoritativeDeckCards && authoritativeDeckCards.length > 0
      ? authoritativeDeckCards.at(-1)
      : indexedTopDeckCardId
    : undefined;
  const resolvedTopDeckCardId =
    topDeckCardId ??
    (deckTopFromReveal && isCardVisibleViaReveal(state, deckTopFromReveal, roleCtx)
      ? deckTopFromReveal
      : undefined);

  // Bottom-of-deck reveal via reveal windows
  const deckBottomCandidate =
    authoritativeDeckCards && authoritativeDeckCards.length > 0
      ? authoritativeDeckCards.at(0)
      : undefined;
  const resolvedBottomDeckCardId =
    deckBottomCandidate &&
    deckBottomCandidate !== resolvedTopDeckCardId &&
    isCardVisibleViaReveal(state, deckBottomCandidate, roleCtx)
      ? deckBottomCandidate
      : undefined;

  const deckTop = resolvedTopDeckCardId
    ? registerCard(
        buildVisibleCard({
          cardId: resolvedTopDeckCardId,
          zone: "deck",
          rawBoard,
          rawCards,
        }),
      )
    : undefined;

  const deckBottom = resolvedBottomDeckCardId
    ? registerCard(
        buildVisibleCard({
          cardId: resolvedBottomDeckCardId,
          zone: "deck",
          rawBoard,
          rawCards,
        }),
      )
    : undefined;

  // Compute playable-from-under card IDs from active permissions
  const currentTurn = state.ctx.status.turn ?? 1;
  const activePermissions = getActivePlayFromUnderPermissions(
    state.G.playFromUnderPermissions,
    playerId,
    currentTurn,
  );
  let playableFromUnderCardIds: LorcanaProjectedCardId[] | undefined;
  if (activePermissions.length > 0) {
    const fromUnder: LorcanaProjectedCardId[] = [];
    for (const permission of activePermissions) {
      const sourceCard = rawBoard.cards[String(permission.sourceItemId)];
      const cardsUnder = (sourceCard?.meta as LorcanaCardMeta | undefined)?.cardsUnder;
      if (!Array.isArray(cardsUnder)) continue;
      for (const underCardId of cardsUnder) {
        if (permission.cardType) {
          const def = staticResources.instances.get(underCardId as CardInstanceId);
          const cardDef = def?.definitionId
            ? staticResources.cards.get(def.definitionId)
            : undefined;
          if ((cardDef as LorcanaCard | undefined)?.cardType !== permission.cardType) {
            continue;
          }
        }
        fromUnder.push(underCardId as LorcanaProjectedCardId);
      }
    }
    if (fromUnder.length > 0) {
      playableFromUnderCardIds = fromUnder;
    }
  }

  return {
    lore: state.G.lore[playerId] ?? 0,
    canAddCardToInkwell:
      actorPlayerId === playerId
        ? canInkThisTurn({
            state,
            getDefinitionByInstanceId: (cardId) => {
              const definitionId = staticResources.instances.get(cardId)?.definitionId;
              return definitionId ? staticResources.cards.get(definitionId) : undefined;
            },
            playerId,
          })
        : false,
    handCount: handZone?.count ?? hand.length,
    deckCount: deckZone?.count ?? 0,
    deckTop,
    deckBottom,
    inkwell,
    hand,
    play,
    discard,
    playableFromUnderCardIds,
  };
}

function projectPlayerEffectSourceIds(
  state: LorcanaMatchState,
): Record<PlayerId, string[]> | undefined {
  const pendingByPlayer = state.G.turnMetadata?.pendingCostReductionsByPlayer;
  if (!pendingByPlayer || typeof pendingByPlayer !== "object") {
    return undefined;
  }

  const projected: Partial<Record<PlayerId, string[]>> = {};

  for (const [playerId, rawEntries] of Object.entries(pendingByPlayer) as [PlayerId, unknown][]) {
    if (!Array.isArray(rawEntries) || rawEntries.length === 0) {
      continue;
    }

    const sourceIds = [
      ...new Set(
        rawEntries
          .map((entry) =>
            entry &&
            typeof entry === "object" &&
            typeof (entry as { sourceId?: unknown }).sourceId === "string"
              ? (entry as { sourceId: string }).sourceId
              : null,
          )
          .filter((sourceId): sourceId is string => sourceId !== null),
      ),
    ];

    if (sourceIds.length > 0) {
      projected[playerId] = sourceIds;
    }
  }

  return Object.keys(projected).length > 0 ? (projected as Record<PlayerId, string[]>) : undefined;
}

export function projectLorcanaBoardView(
  state: LorcanaMatchState,
  roleCtx: ViewRoleContext,
  staticResources: MatchStaticResources,
  projectionCtx?: RuntimeBoardProjectionContext,
): LorcanaProjectedBoardView {
  const runtimeCardCache = projectionCtx?.runtimeCardCache as
    | StateScopedValueCache<ProjectedLorcanaCardDerived>
    | undefined;

  // Build the static effect registry ONCE for this board projection.
  // All per-card derived-state calls below use it instead of re-scanning all cards.
  const getDefinitionByInstanceId = (instanceId: string) => {
    const definitionId = staticResources.instances.get(instanceId)?.definitionId;
    return definitionId
      ? (staticResources.cards.get(definitionId) as LorcanaCardDefinition | undefined)
      : undefined;
  };
  const derivedStateCtx = {
    ctx: {
      priority: state.ctx.priority,
      status: state.ctx.status,
      zones: { private: state.ctx.zones.private },
    },
    G: state.G,
  };
  // Same projection-path rationale as the earlier site in this file: no
  // `MoveRegistryCtx` available here, so build directly.
  const registry = buildStaticEffectRegistry(derivedStateCtx, getDefinitionByInstanceId);

  const rawCards = createCardQueryAPIForState(
    state,
    staticResources,
    createLorcanaRuntimeCardDeriver(registry),
    roleCtx.role === "player" ? (roleCtx.playerID as PlayerId | undefined) : undefined,
    runtimeCardCache,
  );
  const selectionRuntimeContext = createSelectionRuntimeContext(
    state,
    staticResources,
    roleCtx,
    runtimeCardCache,
  );
  const projection = buildEngineProjectionSnapshot(
    state,
    {
      role: roleCtx.role,
      playerId: roleCtx.role === "player" ? roleCtx.playerID : undefined,
    },
    buildZoneRegistry(lorcanaRuntimeZones, state.ctx.playerIds),
    {
      resolveDefinitionId: (cardId) => staticResources.instances.get(cardId)?.definitionId,
    },
  );

  // This projects the entire board, with no hidden information
  const rawBoard: LorcanaBoardProjection = projection.board;
  const cards: Record<string, LorcanaProjectedCard> = {};

  const players = Object.fromEntries(
    state.ctx.playerIds.map((playerId) => [
      playerId,
      projectPlayerBoard({
        state,
        rawBoard,
        staticResources,
        roleCtx,
        playerId: playerId as PlayerId,
        cards,
        rawCards,
        runtimeCardCache,
        registry,
      }),
    ]),
  );
  const pendingChoice = state.ctx.priority.pendingChoice;

  return {
    gameID: state.ctx.gameID,
    matchID: state.ctx.matchID,
    stateID: state.ctx._stateID,
    playerOrder: [...state.ctx.playerIds],
    turnPlayer: resolveTurnPlayer(state),
    priorityPlayer: (resolvePriorityPlayer(state.ctx.priority) as PlayerId | undefined) ?? null,
    turnNumber: state.ctx.status.turn ?? 0,
    phase: state.ctx.status.phase,
    gameSegment: state.ctx.status.gameSegment,
    step: state.ctx.status.step ?? null,
    openingTurnPlayer: (state.ctx.status.otp as PlayerId | undefined) ?? null,
    pendingMulligan: [...(state.ctx.status.pendingMulligan ?? [])] as PlayerId[],
    choosingFirstPlayer: (state.ctx.status.choosingFirstPlayer as PlayerId | undefined) ?? null,
    status: state.ctx.status.gameEnded ? "finished" : "playing",
    winner: state.ctx.status.winner ?? null,
    reason: state.ctx.status.reason ?? null,
    timerView: projectTimerView(state, projectionCtx?.serverTimestamp ?? Date.now()),
    activeEffects: projection.activeEffects,
    pendingEffects: projection.pendingEffects
      .filter((pendingEffect) => pendingEffect.source !== "priority")
      .map((pendingEffect) => ({
        ...pendingEffect,
        abilityIndex:
          pendingEffect.source === "game" &&
          pendingEffect.payload &&
          typeof pendingEffect.payload === "object" &&
          "abilityIndex" in pendingEffect.payload &&
          typeof pendingEffect.payload.abilityIndex === "number"
            ? pendingEffect.payload.abilityIndex
            : undefined,
        selectionContext:
          pendingEffect.source === "game" &&
          pendingEffect.payload &&
          typeof pendingEffect.payload === "object" &&
          "selectionContext" in pendingEffect.payload
            ? ((
                pendingEffect.payload as {
                  selectionContext?: LorcanaProjectedBoardView["bagEffects"][number]["selectionContext"];
                }
              ).selectionContext ?? undefined)
            : undefined,
      })),
    pendingChoice: pendingChoice
      ? {
          type: pendingChoice.type,
          playerID: pendingChoice.playerID as PlayerId,
          requestID: pendingChoice.requestID,
        }
      : undefined,
    bagEffects: (state.G.triggeredAbilities?.bag?.items ?? []).map((entry) => {
      const effectRecord = entry.effect as unknown as Record<string, unknown> | null;
      const legalChoiceIndices =
        effectRecord?.type === "or"
          ? getLegalOrOptionIndices(
              {
                ...selectionRuntimeContext,
                G: state.G,
                playerId: entry.controllerId,
                query: EMPTY_QUERY_API,
              },
              entry.cardPlayed,
              entry.effect as never,
              entry.resolutionInput as ActionResolutionInput,
            )
          : undefined;
      const selectionContext = buildResolutionSelectionContext({
        origin: "bag",
        requestId: entry.id,
        sourceCardId: entry.sourceId,
        chooserId: entry.chooserId,
        cardPlayed: entry.cardPlayed,
        effect: entry.effect,
        condition: entry.condition,
        resolutionInput: entry.resolutionInput,
        ctx: selectionRuntimeContext,
        legalChoiceIndices,
      });
      return {
        id: entry.id,
        type: entry.kind,
        controllerId: entry.controllerId,
        chooserId: selectionContext?.chooserId ?? entry.chooserId,
        sourceId: entry.sourceId,
        abilityIndex: entry.abilityIndex,
        payload: sanitizeProjectedBagPayload(entry, state, roleCtx),
        selectionContext,
      };
    }),
    playerEffectSourceIds: projectPlayerEffectSourceIds(state),
    temporaryPlayerRestrictions:
      state.G.temporaryPlayerRestrictions?.restrictionsByPlayer ?? undefined,
    cards,
    players: players,
  };
}
