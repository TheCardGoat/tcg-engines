import type { CardInstanceId, PlayerId } from "#core";
import type {
  LorcanaCardMeta,
  PendingActionEffect,
  PendingActionEffectContinuation,
  PendingActionEffectKind,
  ResolutionSelectionContext,
} from "../../../types";
import type { CardPlayedPayload } from "../../../types";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";
import { applyReplacementEffects } from "../../effects/replacement-effects";
import type { ReplacementEvent } from "../../effects/replacement-effects";
import { getLorcanaCardName, traceLorcanaRuntimeStep } from "../../../runtime-trace";
import { buildResolutionSelectionContext } from "./selection-context";
import { cloneSelectionInput } from "./selection-state";

type PendingActionEffectReadableContext = {
  G: {
    pendingEffects?: readonly unknown[];
  };
  framework: {
    state: {
      priority: {
        pendingChoice?: {
          type?: string;
        };
      };
      _zonesPrivate: {
        cardIndex: Record<string, { zoneKey?: string } | undefined>;
      };
    };
    zones: {
      moveCard: PlayCardExecutionContext["framework"]["zones"]["moveCard"];
      getCardZone: PlayCardExecutionContext["framework"]["zones"]["getCardZone"];
    };
  };
  cards: Pick<PlayCardExecutionContext["cards"], "clearMeta" | "getMeta" | "patchMeta">;
};

export const EFFECT_PENDING_ERROR_CODE = "EFFECT_PENDING";

type PendingActionEffectParams = {
  kind: PendingActionEffectKind;
  sourceCardId: CardInstanceId;
  controllerId: PlayerId;
  chooserId: PlayerId;
  abilityIndex?: number;
  cardPlayed: CardPlayedPayload;
  effect: unknown;
  continuation?: PendingActionEffectContinuation;
  resolutionInput: ActionResolutionInput;
  selectionContext?: ResolutionSelectionContext;
  allowSuspendWithZeroTargetCandidates?: boolean;
};

export function cloneActionResolutionInput(
  resolutionInput: ActionResolutionInput,
): ActionResolutionInput {
  const clonedEventSnapshot = resolutionInput.eventSnapshot
    ? {
        ...resolutionInput.eventSnapshot,
        revealedCardIds: Array.isArray(resolutionInput.eventSnapshot.revealedCardIds)
          ? [...resolutionInput.eventSnapshot.revealedCardIds]
          : resolutionInput.eventSnapshot.revealedCardIds,
        revealWindowIds: Array.isArray(resolutionInput.eventSnapshot.revealWindowIds)
          ? [...resolutionInput.eventSnapshot.revealWindowIds]
          : resolutionInput.eventSnapshot.revealWindowIds,
        previouslyTargetedCardIds: Array.isArray(
          resolutionInput.eventSnapshot.previouslyTargetedCardIds,
        )
          ? [...resolutionInput.eventSnapshot.previouslyTargetedCardIds]
          : resolutionInput.eventSnapshot.previouslyTargetedCardIds,
      }
    : undefined;

  return {
    ...resolutionInput,
    targets: cloneSelectionInput(resolutionInput.targets),
    currentTargets: cloneSelectionInput(resolutionInput.currentTargets),
    contextTargets: cloneSelectionInput(resolutionInput.contextTargets),
    targetSelectionResolved: resolutionInput.targetSelectionResolved,
    destinations: Array.isArray(resolutionInput.destinations)
      ? resolutionInput.destinations.map((destination) => ({
          zone: destination.zone,
          cards: Array.isArray(destination.cards) ? [...destination.cards] : destination.cards,
        }))
      : undefined,
    eventSnapshot: clonedEventSnapshot,
    triggerContext: resolutionInput.triggerContext
      ? { ...resolutionInput.triggerContext }
      : undefined,
  };
}

function clonePendingActionEffectContinuation(
  continuation: PendingActionEffectContinuation | undefined,
): PendingActionEffectContinuation | undefined {
  if (!continuation) {
    return undefined;
  }

  return {
    ...continuation,
    remainingEffects: continuation.remainingEffects
      ? [...continuation.remainingEffects]
      : undefined,
    stagedSequence: continuation.stagedSequence
      ? {
          sequenceEffect: continuation.stagedSequence.sequenceEffect,
          collectedTargets: [...continuation.stagedSequence.collectedTargets],
          collectedTargetCounts: [...continuation.stagedSequence.collectedTargetCounts],
          remainingSteps: [...continuation.stagedSequence.remainingSteps],
        }
      : undefined,
  };
}

function getPendingEffectId(
  ctx: PlayCardExecutionContext,
  sourceCardId: CardInstanceId,
  chooserId: PlayerId,
): string {
  const stateId = ctx.framework.state.stateID ?? 0;
  const nextIndex = (ctx.G.pendingEffects?.length ?? 0) + 1;
  return `pending-action:${stateId}:${sourceCardId}:${chooserId}:${nextIndex}`;
}

function cloneResolutionSelectionContext(
  selectionContext: ResolutionSelectionContext | undefined,
): ResolutionSelectionContext | undefined {
  if (!selectionContext) {
    return undefined;
  }

  return {
    ...selectionContext,
    currentSelection: {
      ...selectionContext.currentSelection,
      targets: selectionContext.currentSelection.targets
        ? [...selectionContext.currentSelection.targets]
        : undefined,
      destinations: selectionContext.currentSelection.destinations
        ? selectionContext.currentSelection.destinations.map((destination) => ({
            zone: destination.zone,
            cards: [...destination.cards],
          }))
        : undefined,
    },
    ...(selectionContext.kind === "target-selection" || selectionContext.kind === "discard-choice"
      ? {
          targetDsl: [...selectionContext.targetDsl],
          cardCandidateIds: [...selectionContext.cardCandidateIds],
          playerCandidateIds: [...selectionContext.playerCandidateIds],
          allowedZones: [...selectionContext.allowedZones],
        }
      : {}),
    ...(selectionContext.kind === "choice-selection"
      ? {
          options: selectionContext.options.map((option) => ({ ...option })),
        }
      : {}),
    ...(selectionContext.kind === "scry-selection"
      ? {
          revealedCardIds: [...selectionContext.revealedCardIds],
          destinationRules: selectionContext.destinationRules.map((rule) => ({ ...rule })),
        }
      : {}),
  };
}

export function createPendingActionEffect(
  ctx: PlayCardExecutionContext,
  params: PendingActionEffectParams,
): PendingActionEffect {
  const pendingEffectId = getPendingEffectId(ctx, params.sourceCardId, params.chooserId);
  const projectedSelectionContext =
    params.selectionContext ??
    buildResolutionSelectionContext({
      origin: "pending-effect",
      requestId: pendingEffectId,
      sourceCardId: params.sourceCardId,
      chooserId: params.chooserId,
      cardPlayed: params.cardPlayed,
      effect: params.effect,
      resolutionInput: params.resolutionInput,
      ctx,
    });
  const selectionContext = projectedSelectionContext
    ? {
        ...projectedSelectionContext,
        origin: "pending-effect" as const,
        requestId: pendingEffectId,
        sourceCardId: params.sourceCardId,
        chooserId: params.chooserId,
      }
    : undefined;

  return {
    id: pendingEffectId,
    type: "action-effect",
    kind: params.kind,
    abilityIndex: params.abilityIndex,
    sourceId: params.sourceCardId,
    sourceCardId: params.sourceCardId,
    controllerId: params.controllerId,
    chooserId: params.chooserId,
    cardPlayed: {
      ...params.cardPlayed,
      singerIds: params.cardPlayed.singerIds ? [...params.cardPlayed.singerIds] : undefined,
    },
    effect: params.effect,
    continuation: clonePendingActionEffectContinuation(params.continuation),
    resolutionInput: cloneActionResolutionInput(params.resolutionInput),
    selectionContext: cloneResolutionSelectionContext(selectionContext),
    ...(params.allowSuspendWithZeroTargetCandidates === true
      ? { allowSuspendWithZeroTargetCandidates: true as const }
      : {}),
  };
}

export function enqueuePendingActionEffect(
  ctx: PlayCardExecutionContext,
  pendingEffect: PendingActionEffect,
): void {
  const pendingEffects = ctx.G.pendingEffects;
  const existingIndex = pendingEffects.findIndex((entry) => entry.id === pendingEffect.id);
  if (existingIndex >= 0) {
    pendingEffects.splice(existingIndex, 1);
  }
  pendingEffects.push(pendingEffect as (typeof pendingEffects)[number]);

  const priorityState = ctx.framework.state.priority as {
    pendingChoice?: {
      type: "action-effect";
      playerID: PlayerId;
      requestID: string;
    };
  };
  priorityState.pendingChoice = {
    type: "action-effect",
    playerID: pendingEffect.chooserId,
    requestID: pendingEffect.id,
  };

  traceLorcanaRuntimeStep({
    kind: "effect.pending.queued",
    moveId: "playCard",
    playerId: pendingEffect.chooserId,
    effectId: pendingEffect.id,
    cardId: pendingEffect.sourceCardId,
    cardName: getLorcanaCardName(pendingEffect.sourceCardId, (cardId) =>
      ctx.cards.getDefinition(cardId),
    ),
    message: "Action effect is queued for later resolution",
    payload: {
      pendingKind: pendingEffect.kind,
    },
  });
}

export function clearPendingActionChoice(ctx: PlayCardExecutionContext): void {
  const priorityState = ctx.framework.state.priority as {
    pendingChoice?: {
      type: "action-effect";
      playerID: PlayerId;
      requestID: string;
    };
  };
  priorityState.pendingChoice = undefined;
}

export function removePendingActionEffect(
  ctx: PlayCardExecutionContext,
  effectId: string,
): PendingActionEffect | undefined {
  const pendingEffects = ctx.G.pendingEffects ?? [];
  const matched = pendingEffects.find((effect) => effect.id === effectId);
  if (!matched) {
    return undefined;
  }

  ctx.G.pendingEffects = pendingEffects.filter((effect) => effect.id !== effectId);
  return matched;
}

export function hasPendingActionEffectResolution(ctx: {
  G: {
    pendingEffects?: readonly unknown[];
  };
  framework: {
    state: {
      priority: {
        pendingChoice?: {
          type?: string;
        };
      };
    };
  };
}): boolean {
  return (
    (ctx.G.pendingEffects?.length ?? 0) > 0 ||
    ctx.framework.state.priority.pendingChoice?.type === "action-effect"
  );
}

function getCardZoneKey(
  ctx: Pick<PendingActionEffectReadableContext, "framework">,
  cardId: CardInstanceId,
): string | undefined {
  return ctx.framework.zones.getCardZone(cardId);
}

export function moveSuspendedActionCardToLimbo(
  ctx: PendingActionEffectReadableContext,
  cardPlayed: CardPlayedPayload,
): void {
  if (cardPlayed.cardType !== "action") {
    return;
  }

  const zoneKey = getCardZoneKey(ctx, cardPlayed.cardId);
  if (typeof zoneKey !== "string" || (!zoneKey.startsWith("play") && zoneKey !== "play")) {
    return;
  }

  ctx.framework.zones.moveCard(cardPlayed.cardId, {
    zone: "limbo",
    playerId: cardPlayed.playerId,
  });

  // Action cards are played face-up and are public knowledge. Mark them visible so the limbo
  // zone projection shows the real card name rather than "Hidden card" in the pending effects UI.
  ctx.cards.patchMeta(cardPlayed.cardId, { publicFaceState: "faceUp" });
}

export function finalizeResolvedActionCard(
  ctx: PendingActionEffectReadableContext,
  cardPlayed: CardPlayedPayload,
): void {
  if (cardPlayed.cardType !== "action") {
    return;
  }

  const zoneKey = getCardZoneKey(ctx, cardPlayed.cardId);
  if (
    typeof zoneKey !== "string" ||
    (!zoneKey.startsWith("play") &&
      zoneKey !== "play" &&
      !zoneKey.startsWith("limbo") &&
      zoneKey !== "limbo")
  ) {
    return;
  }

  const cardMeta = ctx.cards.getMeta(cardPlayed.cardId) as LorcanaCardMeta | undefined;

  if (cardMeta?.afterPlayDestination === "bottom-of-deck") {
    ctx.framework.zones.moveCard(
      cardPlayed.cardId,
      { zone: "deck", playerId: cardPlayed.playerId },
      { index: 0 },
    );
    ctx.cards.clearMeta(cardPlayed.cardId);
    return;
  }

  const zoneChangeEvent: Extract<ReplacementEvent, { kind: "zone-change" }> = {
    kind: "zone-change",
    eventId: `zone-change:${cardPlayed.cardId}`,
    sourceId: cardPlayed.cardId,
    controllerId: cardPlayed.playerId,
    cardId: cardPlayed.cardId,
    playerId: cardPlayed.playerId,
    fromZone: zoneKey.startsWith("limbo") ? "limbo" : "play",
    toZone: "discard",
  };
  const replacedEvent = applyReplacementEffects(
    ctx as unknown as Parameters<typeof applyReplacementEffects>[0],
    zoneChangeEvent,
  );

  ctx.framework.zones.moveCard(
    cardPlayed.cardId,
    {
      zone: replacedEvent.toZone,
      playerId: cardPlayed.playerId,
    },
    replacedEvent.toZone === "deck" && replacedEvent.position === "bottom"
      ? { index: 0 }
      : undefined,
  );
  ctx.cards.clearMeta(cardPlayed.cardId);
}

export function mergeActionResolutionInput(
  base: ActionResolutionInput,
  patch: ActionResolutionInput,
): ActionResolutionInput {
  return cloneActionResolutionInput({
    ...base,
    ...patch,
  });
}
