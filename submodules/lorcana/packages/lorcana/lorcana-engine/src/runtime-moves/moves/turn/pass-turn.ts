// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-topic/turn-actions.md

import type {
  CardInstanceId,
  MoveEnumerationContext,
  MoveExecutionContext,
  MoveValidationContext,
  PlayerId,
  RuntimeValidationResult,
} from "#core";
import { hasKeyword, isLocation } from "../../../card-utils";
import { deriveLore, createProjectionState } from "../../../rules/derived-state";
import {
  createLorcanaLogProjection,
  type LorcanaCard,
  type LorcanaCardMeta,
  type LorcanaMoveDefinition,
  type LorcanaRuntimeMoveInputs,
  type PendingTurnTransitionState,
} from "../../../types";
import { getEligibleChallengeAttackers } from "../../rules/challenge-rules";
import { getEligibleQuestCharacters } from "../core/quest";
import {
  cleanupDanglingTargetEffects,
  cleanupExpiredEffects,
} from "../../effects/continuous-effects";
import type { LorcanaCardDerived } from "../../../types/projected-board";
import {
  emitTriggeredLorcanaEvent,
  finalizeResolutionBoundary,
  hasPendingBagItems,
  openWindow,
  pruneExpiredTriggerRegistrations,
} from "../../effects/triggered-abilities";
import {
  hasTemporaryKeyword,
  hasTemporaryPlayerRestriction,
  pruneExpiredTemporaryPlayerRestrictions,
  hasTemporaryRestriction,
  pruneExpiredTemporaryEffects,
} from "../../effects/temporary-effects";
import { pruneExpiredReplacementEffects } from "../../effects/replacement-effects";
import { pruneExpiredPlayFromUnderPermissions } from "../../effects/play-from-under-permissions";
import {
  hasStaticCardRestriction,
  hasStaticPlayerRestriction,
} from "../../rules/static-ability-utils";
import { getOrBuildMoveRegistry } from "../../rules/move-registry-cache";
import { invalidateStaticEffects } from "../../rules/static-effects-invalidation";
import { recordCardDrawnThisTurn } from "../../state/turn-metrics";
import { resolveTurnOwnerId } from "../../../core/runtime/turn-owner";
import { checkDeckEmptyForPlayer } from "../../state/game-state-check";
import { gainLore, isCardInPlayZone } from "../../../operations";

type PassTurnExecutionContext = Pick<
  MoveExecutionContext<LorcanaRuntimeMoveInputs["passTurn"]>,
  "G" | "playerId" | "query" | "framework" | "cards"
>;

type PassTurnValidationContext = MoveValidationContext<LorcanaRuntimeMoveInputs["passTurn"]>;

type PassTurnEnumerationContext = MoveEnumerationContext;

type PassTurnIntentContext = PassTurnValidationContext | PassTurnEnumerationContext;

type PassTurnFailure = Extract<RuntimeValidationResult, { valid: false }>;

export const PASS_TURN_STACK_PENDING_ERROR_CODE = "PASS_TURN_STACK_PENDING";
export const PASS_TURN_DECISION_PENDING_ERROR_CODE = "PASS_TURN_DECISION_PENDING";
export const PASS_TURN_RECKLESS_CHALLENGE_REQUIRED_ERROR_CODE =
  "PASS_TURN_RECKLESS_CHALLENGE_REQUIRED";
export const PASS_TURN_MUST_QUEST_REQUIRED_ERROR_CODE = "PASS_TURN_MUST_QUEST_REQUIRED";
export const PASS_TURN_NOT_ACTIVE_PLAYER_ERROR_CODE = "PASS_TURN_NOT_ACTIVE_PLAYER";

export type AdvanceTurnResult = {
  previousPlayer: PlayerId;
  nextPlayer: PlayerId;
  turnNumber: number;
};

function resolveTurnPlayer(ctx: PassTurnIntentContext): PlayerId | undefined {
  return resolveTurnOwnerId(ctx.framework.state, ctx.G);
}

function getCheapPassTurnFailure(ctx: PassTurnIntentContext): PassTurnFailure | null {
  const activePlayer = resolveTurnPlayer(ctx);
  if (!activePlayer || ctx.playerId !== activePlayer) {
    return {
      valid: false,
      error: "Only the active player can pass the turn",
      errorCode: PASS_TURN_NOT_ACTIVE_PLAYER_ERROR_CODE,
    };
  }

  if (
    ctx.G.pendingTurnTransition ||
    hasPendingBagItems(ctx) ||
    ctx.framework.state.priority.pendingChoice ||
    (ctx.G.pendingEffects?.length ?? 0) > 0
  ) {
    return {
      valid: false,
      error: "Cannot pass turn while a player decision is pending",
      errorCode: PASS_TURN_DECISION_PENDING_ERROR_CODE,
    };
  }

  if (ctx.framework.state.priority.stackDepth > 0) {
    return {
      valid: false,
      error: "Cannot pass turn while stack has unresolved effects",
      errorCode: PASS_TURN_STACK_PENDING_ERROR_CODE,
    };
  }

  return null;
}

function pruneExpiredTemporaryCardMeta(ctx: PassTurnExecutionContext, currentTurn: number): void {
  const cardMetaEntries = ctx.cards.entriesMeta();
  for (const [cardId, rawMeta] of cardMetaEntries) {
    const currentMeta = (rawMeta ?? {}) as LorcanaCardMeta;
    const prunedMeta = pruneExpiredTemporaryEffects(currentMeta, currentTurn);
    if (!prunedMeta || prunedMeta === currentMeta) {
      continue;
    }

    ctx.cards.setMeta(cardId as CardInstanceId, prunedMeta as Record<string, unknown>);
  }
}

function clearInkwellRevealsForAllPlayers(
  ctx: PassTurnExecutionContext,
  players: PlayerId[],
): void {
  for (const playerId of players) {
    // respectExpiry: true keeps stateID-based reveals (e.g. freshly inked cards)
    // alive until they naturally expire, so both players can see what was inked.
    ctx.framework.zones.clearRevealsByZone({ zone: "inkwell", playerId }, { respectExpiry: true });
  }
}

function clearHandRevealsForPlayer(ctx: PassTurnExecutionContext, playerId: PlayerId): void {
  ctx.framework.zones.clearRevealsByZone({ zone: "hand", playerId });
  const handCards = ctx.framework.zones.getCards({ zone: "hand", playerId }) as CardInstanceId[];
  for (const cardId of handCards) {
    const meta = (ctx.cards.require(cardId).meta ?? {}) as LorcanaCardMeta;
    if (meta.revealed) {
      ctx.cards.patchMeta(cardId, { revealed: undefined });
    }
  }
}

function clearActivatedAbilityUsageMeta(ctx: PassTurnExecutionContext, playerId: PlayerId): void {
  const cardsInPlay = ctx.framework.zones.getCards({ zone: "play", playerId }) as CardInstanceId[];
  for (const cardId of cardsInPlay) {
    const currentMeta = (ctx.cards.require(cardId).meta ?? {}) as LorcanaCardMeta;
    if (!currentMeta.activatedAbilityUses && !currentMeta.activatedAbilityUseTurns) {
      continue;
    }
    ctx.cards.patchMeta(cardId, {
      activatedAbilityUses: undefined,
      activatedAbilityUseTurns: undefined,
    });
  }
}

function readyCardsForPlayer(
  ctx: PassTurnExecutionContext,
  playerId: PlayerId,
  currentTurn: number,
): void {
  const registry = getOrBuildMoveRegistry(ctx);
  const readyOnlyOneCharacter = hasTemporaryPlayerRestriction(
    ctx.G.temporaryPlayerRestrictions,
    playerId,
    currentTurn,
    "ready-only-one-character",
  );
  let charactersReadied = 0;

  const playerZoneRefs = [
    { zone: "play", playerId },
    { zone: "inkwell", playerId },
  ] as const;

  for (const zone of playerZoneRefs) {
    const cards = ctx.framework.zones.getCards(zone) as CardInstanceId[];
    const clearDrying = zone.zone === "play";

    for (const cardId of cards) {
      const currentMeta = (ctx.cards.require(cardId).meta ?? {}) as LorcanaCardMeta;
      const nextMeta = { ...currentMeta } as Record<string, unknown>;
      const atLocationId = currentMeta.atLocationId;
      const isCardAtLocation = !!atLocationId && isCardInPlayZone(ctx, atLocationId as string);
      const cantReady =
        hasTemporaryRestriction(currentMeta, currentTurn, "cant-ready", {
          isSourceInPlay: (sourceId) => isCardInPlayZone(ctx, sourceId),
          isCardAtLocation,
        }) ||
        hasStaticCardRestriction({
          state: ctx.framework.state,
          cardId,
          restriction: "cant-ready-at-start-of-turn",
          registry,
        }) ||
        hasTemporaryRestriction(currentMeta, currentTurn, "doesnt-ready", {
          isSourceInPlay: (sourceId) => isCardInPlayZone(ctx, sourceId),
          isCardAtLocation,
        }) ||
        hasStaticCardRestriction({
          state: ctx.framework.state,
          cardId,
          restriction: "cant-ready",
          registry,
        });
      const exceedsReadyLimit =
        zone.zone === "play" && readyOnlyOneCharacter && charactersReadied >= 1;

      if (currentMeta.state === "exerted" && !cantReady && !exceedsReadyLimit) {
        nextMeta.state = "ready";
        if (zone.zone === "play") {
          charactersReadied += 1;
        }
        emitTriggeredLorcanaEvent(
          ctx,
          "cardReadied",
          { cardId, source: "start-of-turn", zone: zone.zone },
          { event: "ready", playerId, subjectCardId: cardId },
        );
      }

      if (clearDrying) {
        delete nextMeta.isDrying;
      }

      ctx.cards.setMeta(cardId, nextMeta);
    }
  }
}

function drawForTurn(ctx: PassTurnExecutionContext, playerId: PlayerId, turnNumber: number): void {
  const openingTurnPlayer = ctx.framework.state.status.otp as PlayerId | undefined;
  const shouldSkipOpeningDraw = turnNumber === 1 && playerId === openingTurnPlayer;
  if (shouldSkipOpeningDraw) {
    return;
  }

  const drawnCards = ctx.framework.zones.drawCards({
    from: { zone: "deck", playerId },
    to: { zone: "hand", playerId },
    count: 1,
  });
  const drawnCardIds = Array.isArray(drawnCards) ? (drawnCards as CardInstanceId[]) : [];

  // Emit triggered events for each drawn card so "Whenever you draw" abilities fire.
  // source: "mandatory-draw" routes these to the turnStart log instead of the current move's outcomes.
  for (const cardId of drawnCardIds) {
    recordCardDrawnThisTurn(ctx, playerId);
    const drawCount =
      (ctx.G.turnMetadata?.cardsDrawnThisTurnByPlayer as Record<string, number> | undefined)?.[
        playerId
      ] ?? 1;
    emitTriggeredLorcanaEvent(
      ctx,
      "cardsDrawn",
      { playerId, amount: 1, cardIds: [cardId], source: "mandatory-draw" },
      {
        event: "draw",
        playerId,
        subjectCardId: cardId,
        eventSnapshot: { drawCountForPlayerThisTurn: drawCount },
      },
    );
  }
}

function shouldSkipDrawStepForPlayer(
  ctx: PassTurnExecutionContext,
  playerId: PlayerId,
  turnNumber: number,
): boolean {
  const openingTurnPlayer = ctx.framework.state.status.otp as PlayerId | undefined;
  if (turnNumber === 1 && playerId === openingTurnPlayer) {
    return true;
  }

  const currentTurn = ctx.framework.state.status.turn ?? turnNumber;
  if (
    hasTemporaryPlayerRestriction(
      ctx.G.temporaryPlayerRestrictions,
      playerId,
      currentTurn,
      "skip-draw-step",
    )
  ) {
    return true;
  }

  const registry = getOrBuildMoveRegistry(ctx);
  return hasStaticPlayerRestriction({
    state: ctx.framework.state,
    playerId,
    restriction: "skip-draw-step",
    registry,
  });
}

function gainLoreFromLocations(ctx: PassTurnExecutionContext, playerId: PlayerId): void {
  const cardsInPlay = ctx.framework.zones.getCards({ zone: "play", playerId }) as CardInstanceId[];
  let locationCount = 0;
  const registry = getOrBuildMoveRegistry(ctx);
  const state = createProjectionState(ctx.framework.state, ctx.G);
  const getDefinition = (id: CardInstanceId) => ctx.cards.getDefinition(id);
  const loreGain = cardsInPlay.reduce((total, cardId) => {
    const definition = ctx.cards.require(cardId).definition;
    if (!definition || !isLocation(definition)) {
      return total;
    }

    locationCount++;
    return total + deriveLore(definition, state, cardId, getDefinition, registry);
  }, 0);

  if (loreGain <= 0) {
    return;
  }

  ctx.framework.log(
    createLorcanaLogProjection(
      "lorcana.outcome.locationLoreGained",
      { playerId, amount: loreGain, locationCount },
      { mode: "PUBLIC" },
      "rules",
    ),
  );

  gainLore(ctx, playerId, loreGain);
}

function getOpponents(ctx: PassTurnExecutionContext, playerId: PlayerId): PlayerId[] {
  return (Object.keys(ctx.G.lore) as PlayerId[]).filter((candidate) => candidate !== playerId);
}

export function advanceTurnToNextPlayer(ctx: PassTurnExecutionContext): AdvanceTurnResult {
  const players = Object.keys(ctx.G.lore) as PlayerId[];
  // Use pendingTurnTransition.previousPlayer when available — finalizeResolutionBoundary
  // transfers priority to the bag resolver, which may be a different player than the one
  // who ended their turn, so ctx.framework.state.currentPlayer (= priority.holder) is
  // unreliable here when the turn advance happens after bag resolution.
  const previousPlayer = (ctx.G.pendingTurnTransition?.previousPlayer ??
    resolveTurnOwnerId(ctx.framework.state, ctx.G)) as PlayerId;
  const currentIndex = players.indexOf(previousPlayer as PlayerId);
  const nextIndex = (currentIndex + 1) % players.length;
  const nextPlayer = players[nextIndex];

  // Update turn and priority
  ctx.framework.status.patch({ turnOwnerId: nextPlayer });
  // Invalidate the static-effect registry: turn-conditional abilities (e.g. "during your turn")
  // depend on turnOwnerId, which just changed. The cache keys on staticEffectsVersion, so we must
  // bump it here or the previous player's turn-conditional keywords will bleed into the next turn.
  invalidateStaticEffects(ctx);
  ctx.framework.priority.setHolder(nextPlayer);
  const turnNumber = ctx.framework.status.incrementTurn();

  // Reset phase to beginning
  ctx.framework.status.setPhase("beginning");
  ctx.framework.priority.openWindow(nextPlayer);

  readyCardsForPlayer(ctx, nextPlayer, turnNumber);
  cleanupExpiredEffects(ctx, turnNumber);
  cleanupDanglingTargetEffects(ctx);
  pruneExpiredTemporaryCardMeta(ctx, turnNumber);
  pruneExpiredTriggerRegistrations(ctx.G, turnNumber);
  pruneExpiredReplacementEffects(ctx.G, turnNumber);
  clearActivatedAbilityUsageMeta(ctx, previousPlayer as PlayerId);
  clearHandRevealsForPlayer(ctx, previousPlayer as PlayerId);
  clearInkwellRevealsForAllPlayers(ctx, players);
  ctx.G.temporaryPlayerRestrictions = pruneExpiredTemporaryPlayerRestrictions(
    ctx.G.temporaryPlayerRestrictions,
    turnNumber,
  ) ?? {
    restrictionsByPlayer: {},
    startsByPlayer: {},
  };
  pruneExpiredPlayFromUnderPermissions(ctx.G.playFromUnderPermissions, turnNumber);

  const turnsCompletedByPlayer =
    ctx.G.turnsCompletedByPlayer ?? (ctx.G.turnsCompletedByPlayer = {} as Record<PlayerId, number>);
  turnsCompletedByPlayer[previousPlayer] = (turnsCompletedByPlayer[previousPlayer] ?? 0) + 1;

  // Reset turn metadata (inkedThisTurn is array; ink refills via cardMeta ready in beginning phase)
  ctx.G.turnMetadata = {
    cardsPlayedThisTurn: [],
    charactersQuesting: [],
    inkedThisTurn: [],
    cardsPutIntoInkwellThisTurn: [],
    additionalInkwellActions: 0,
    shiftPlayedThisTurn: [],
    challengesByPlayerThisTurn: {},
    damagedCharactersByOwnerThisTurn: {},
    damageRemovedByPlayerThisTurn: {},
    challengedCharactersThisTurn: [],
    banishedCharactersThisTurn: [],
    banishedCharactersInChallengeByOwnerThisTurn: {},
    discardCardsLeftThisTurn: 0,
    cardsPutIntoDiscardThisTurnByOwner: {},
    pendingCostReductionsByPlayer: {},
    cardsDrawnThisTurnByPlayer: {},
  };

  gainLoreFromLocations(ctx, nextPlayer);

  ctx.framework.events.emit({
    kind: "TURN_STARTED",
    playerId: nextPlayer,
    turn: turnNumber,
    phase: "beginning",
  });

  return { previousPlayer: previousPlayer as PlayerId, nextPlayer, turnNumber };
}

function createPendingTurnTransitionState(
  previousPlayer: PlayerId,
  stage: PendingTurnTransitionState["stage"],
  patch: Partial<PendingTurnTransitionState> = {},
): PendingTurnTransitionState {
  return {
    previousPlayer,
    stage,
    ...patch,
  };
}

export function continuePendingTurnTransition(ctx: PassTurnExecutionContext): void {
  let transitionState = ctx.G.pendingTurnTransition;
  if (!transitionState) {
    return;
  }

  const maxTransitionSteps = 10;
  for (let step = 0; transitionState && step < maxTransitionSteps; step += 1) {
    switch (transitionState.stage) {
      case "end-of-turn": {
        ctx.framework.status.setPhase("end");

        if (!transitionState.triggerWindowQueued) {
          openWindow(ctx, {
            window: "end-of-turn",
            playerId: transitionState.previousPlayer,
          });
          finalizeResolutionBoundary(ctx, {
            playerId: transitionState.previousPlayer,
            window: "end-of-turn",
          });
          transitionState = {
            ...transitionState,
            triggerWindowQueued: true,
          };
          ctx.G.pendingTurnTransition = transitionState;
          if (
            hasPendingBagItems(ctx) ||
            ctx.framework.state.priority.pendingChoice ||
            (ctx.G.pendingEffects?.length ?? 0) > 0
          ) {
            return;
          }
        }

        transitionState = createPendingTurnTransitionState(
          transitionState.previousPlayer,
          "advance-turn",
        );
        ctx.G.pendingTurnTransition = transitionState;
        continue;
      }

      case "advance-turn": {
        const { previousPlayer, nextPlayer, turnNumber } = advanceTurnToNextPlayer(ctx);
        emitTriggeredLorcanaEvent(ctx, "turnPassed", {
          previousPlayer,
          newPlayer: nextPlayer,
        });

        transitionState = createPendingTurnTransitionState(previousPlayer, "start-of-turn", {
          nextPlayer,
          turnNumber,
        });
        ctx.G.pendingTurnTransition = transitionState;
        continue;
      }

      case "start-of-turn": {
        const nextPlayer = transitionState.nextPlayer;
        if (!nextPlayer) {
          ctx.G.pendingTurnTransition = undefined;
          return;
        }

        if (!transitionState.triggerWindowQueued) {
          openWindow(ctx, {
            window: "start-of-turn",
            playerId: nextPlayer,
          });
          finalizeResolutionBoundary(ctx, {
            playerId: nextPlayer,
            window: "start-of-turn",
          });
          transitionState = {
            ...transitionState,
            triggerWindowQueued: true,
          };
          ctx.G.pendingTurnTransition = transitionState;
          if (hasPendingBagItems(ctx) || ctx.framework.state.priority.pendingChoice) {
            return;
          }
        }

        const turnNumber = transitionState.turnNumber ?? ctx.framework.state.status.turn ?? 1;

        // Sub-step 2: perform the draw and emit triggered events (only once)
        if (!transitionState.drawStepStarted) {
          // Ensure nextPlayer holds priority for the draw step. The start-of-turn
          // trigger window (finalizeResolutionBoundary above) can transfer priority
          // to a bag resolver, leaving priority.holder pointing at the previous
          // player when the draw event is evaluated. "during-turn, whose: opponent"
          // restrictions in triggerMatchesEvent read ctx.framework.state.currentPlayer
          // (== priority.holder), so they would see the wrong active player and
          // fail to fire abilities like Diablo's CIRCLE FAR AND WIDE.
          ctx.framework.priority.setHolder(nextPlayer);
          transitionState = {
            ...transitionState,
            drawStepStarted: true,
          };
          ctx.G.pendingTurnTransition = transitionState;
          if (shouldSkipDrawStepForPlayer(ctx, nextPlayer, turnNumber)) {
            ctx.framework.status.setPhase("main");
            ctx.G.pendingTurnTransition = undefined;
            return;
          }

          drawForTurn(ctx, nextPlayer, turnNumber);

          // Finalize to flush any draw-triggered events (e.g. "Whenever you draw") into the bag
          finalizeResolutionBoundary(ctx, {
            playerId: nextPlayer,
            window: "start-of-turn",
          });
          ctx.G.pendingTurnTransition = transitionState;
          if (
            hasPendingBagItems(ctx) ||
            ctx.framework.state.priority.pendingChoice ||
            (ctx.G.pendingEffects?.length ?? 0) > 0
          ) {
            return;
          }
        }

        // All draw-triggered effects resolved; transition to main phase.
        // Restore priority to the turn player in case bag-effect resolution
        // handed it to an opponent-controlled bag resolver (e.g. Diablo drawing
        // a card for themselves while P2 draws during their start-of-turn).
        ctx.framework.priority.setHolder(nextPlayer);
        ctx.framework.status.setPhase("main");
        ctx.G.pendingTurnTransition = undefined;
        return;
      }
    }
  }

  if (transitionState) {
    throw new Error(
      `Exceeded ${maxTransitionSteps} turn transition steps while resolving pending turn state '${transitionState.stage}'.`,
    );
  }
}

function getPassTurnFailure(ctx: PassTurnIntentContext): PassTurnFailure | null {
  const cheapFailure = getCheapPassTurnFailure(ctx);
  if (cheapFailure) {
    return cheapFailure;
  }

  const registry = getOrBuildMoveRegistry(ctx);
  const recklessAttackerCanChallenge = getEligibleChallengeAttackers(ctx).some((attackerId) => {
    const attackerDef = ctx.cards.getDefinition(attackerId);
    const hasStaticReckless = attackerDef ? hasKeyword(attackerDef, "Reckless") : false;
    const attackerMeta = ctx.cards.require(attackerId).meta;
    const currentTurn = ctx.framework.state.status.turn ?? 1;
    const controllerId = ctx.cards.require(attackerId).controllerID as PlayerId | undefined;
    const controllerCantChallenge =
      controllerId !== undefined &&
      (hasTemporaryPlayerRestriction(
        ctx.G.temporaryPlayerRestrictions,
        controllerId,
        currentTurn,
        "cant-challenge",
      ) ||
        hasStaticPlayerRestriction({
          state: ctx.framework.state,
          playerId: controllerId,
          restriction: "cant-challenge",
          registry,
        }));
    if (controllerCantChallenge) {
      return false;
    }

    return hasStaticReckless || hasTemporaryKeyword(attackerMeta, currentTurn, "Reckless");
  });

  if (recklessAttackerCanChallenge) {
    return {
      valid: false,
      error: "A Reckless character must challenge if able",
      errorCode: PASS_TURN_RECKLESS_CHALLENGE_REQUIRED_ERROR_CODE,
    };
  }

  // "Must quest if able" enforcement (e.g. This Growing Pressure, Cobra Bubbles
  // — Dedicated Official, Ariel — Curious Traveler). A character under the
  // `must-quest` temporary restriction that is still a legal quester blocks
  // their controller from passing turn.
  const currentTurn = ctx.framework.state.status.turn ?? 1;
  const eligibleQuesters = getEligibleQuestCharacters(ctx);
  const mustQuestCharacterPending = eligibleQuesters.some((cardId) => {
    const meta = ctx.cards.require(cardId).meta;
    return hasTemporaryRestriction(meta, currentTurn, "must-quest");
  });
  if (mustQuestCharacterPending) {
    return {
      valid: false,
      error: "A character under the must-quest restriction must quest if able",
      errorCode: PASS_TURN_MUST_QUEST_REQUIRED_ERROR_CODE,
    };
  }

  return null;
}

/**
 * Pass turn to next player
 */
export const passTurn: LorcanaMoveDefinition<"passTurn"> = {
  optimistic: true,
  validate: (ctx): RuntimeValidationResult => getPassTurnFailure(ctx) ?? { valid: true },

  execute: (ctx) => {
    const currentPlayer = ctx.playerId as PlayerId;
    ctx.framework.log(
      createLorcanaLogProjection(
        "lorcana.move.passTurn",
        {
          playerId: currentPlayer,
        },
        { mode: "PUBLIC" },
        "action",
      ),
    );
    if (checkDeckEmptyForPlayer(ctx, currentPlayer)) {
      const winner = getOpponents(ctx, currentPlayer)[0];
      ctx.framework.events.endGame({
        winner,
        reason: `${currentPlayer} ended their turn with no cards in their deck`,
      });
      return;
    }

    ctx.G.pendingTurnTransition = createPendingTurnTransitionState(currentPlayer, "end-of-turn");
    continuePendingTurnTransition(ctx);
  },

  available: (ctx) => !getCheapPassTurnFailure(ctx),
};
