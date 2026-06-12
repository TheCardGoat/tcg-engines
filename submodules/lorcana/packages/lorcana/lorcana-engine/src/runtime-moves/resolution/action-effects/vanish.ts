import type { CardInstanceId, PlayerId } from "#core";
import type { CardPlayedPayload } from "../../../types";
import type { PlayCardExecutionContext, ActionResolutionInput } from "./types";
import { normalizeSelectedTargets, normalizeTargetDescriptor } from "../../../targeting/runtime";
import { hasVanish } from "../../../card-utils";
import { resolveBanishEffect } from "./banish-effect";

const CHOSEN_SELECTOR_FIELDS = ["target", "character", "location", "from", "to"] as const;

function getCardZone(ctx: PlayCardExecutionContext, cardId: CardInstanceId): string | undefined {
  return ctx.framework.zones.getCardZone(cardId);
}

export function recordVanishChosenTargets(args: {
  ctx: PlayCardExecutionContext;
  effect: unknown;
  resolutionInput: ActionResolutionInput;
  chooserId: PlayerId;
}): void {
  const { ctx, effect, resolutionInput, chooserId } = args;
  const effectRecord =
    effect && typeof effect === "object" ? (effect as Record<string, unknown>) : null;
  const hasChosenSelector = CHOSEN_SELECTOR_FIELDS.some((field) => {
    const descriptor = normalizeTargetDescriptor(effectRecord?.[field]);
    return descriptor?.selector === "chosen";
  });
  if (!hasChosenSelector) {
    return;
  }

  const selectedTargets = normalizeSelectedTargets(resolutionInput.targets) ?? [];
  const chosenCardIds = selectedTargets.filter(
    (targetId): targetId is CardInstanceId => typeof targetId === "string",
  );
  if (chosenCardIds.length === 0) {
    return;
  }

  const snapshot = resolutionInput.eventSnapshot;
  if (!snapshot) {
    return;
  }

  const entries = [...(snapshot.vanishChosenCards ?? [])];
  for (const cardId of chosenCardIds) {
    if (entries.some((entry) => entry.cardId === cardId && entry.chooserId === chooserId)) {
      continue;
    }
    entries.push({ cardId, chooserId });
  }
  snapshot.vanishChosenCards = entries;
}

export function resolveRecordedVanishTargets(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  resolutionInput: ActionResolutionInput,
): void {
  if (cardPlayed.cardType !== "action") {
    return;
  }

  const vanishChosenCards = resolutionInput.eventSnapshot?.vanishChosenCards ?? [];
  if (vanishChosenCards.length === 0) {
    return;
  }

  const targetIds: CardInstanceId[] = [];
  for (const { cardId, chooserId } of vanishChosenCards) {
    const definition = ctx.cards.getDefinition(cardId);
    const ownerId = ctx.framework.zones.getCardOwner(cardId);
    if (!definition || !ownerId || ownerId === chooserId || !hasVanish(definition)) {
      continue;
    }

    const zoneKey = getCardZone(ctx, cardId);
    if (zoneKey !== "play" && zoneKey !== `play:${ownerId}`) {
      continue;
    }

    if (!targetIds.includes(cardId)) {
      targetIds.push(cardId);
    }
  }

  if (targetIds.length === 0) {
    return;
  }

  resolveBanishEffect(
    ctx,
    cardPlayed,
    { type: "banish", target: { ref: "none" } as never },
    {
      eventSnapshot: resolutionInput.eventSnapshot,
      targets: targetIds,
    },
  );
}
