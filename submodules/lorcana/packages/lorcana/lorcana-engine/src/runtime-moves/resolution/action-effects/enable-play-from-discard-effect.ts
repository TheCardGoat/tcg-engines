import type { CardInstanceId } from "#core";
import type { EnablePlayFromDiscardEffect } from "@tcg/lorcana-types";
import type { CardPlayedPayload } from "../../../types";
import { addPlayFromDiscardPermission } from "../../effects/play-from-discard-permissions";
import { resolveTemporaryEffectExpiryTurn } from "../../effects/temporary-effects";
import type { ActionResolutionInput, PlayCardExecutionContext } from "./types";

export function isEnablePlayFromDiscardEffect(
  effect: unknown,
): effect is EnablePlayFromDiscardEffect {
  return (
    typeof effect === "object" &&
    effect !== null &&
    "type" in effect &&
    (effect as { type?: unknown }).type === "enable-play-from-discard"
  );
}

function resolvePermissionCardId(
  cardPlayed: CardPlayedPayload,
  effect: EnablePlayFromDiscardEffect,
  resolutionInput: ActionResolutionInput,
): CardInstanceId | null {
  if ((effect.source ?? "source") === "trigger-subject") {
    const subjectCardId = resolutionInput.eventSnapshot?.subjectCardId;
    return typeof subjectCardId === "string" && subjectCardId.length > 0
      ? (subjectCardId as CardInstanceId)
      : null;
  }

  return cardPlayed.cardId as CardInstanceId;
}

export function resolveEnablePlayFromDiscardEffect(
  ctx: PlayCardExecutionContext,
  cardPlayed: CardPlayedPayload,
  effect: EnablePlayFromDiscardEffect,
  resolutionInput: ActionResolutionInput,
): void {
  const cardId = resolvePermissionCardId(cardPlayed, effect, resolutionInput);
  if (!cardId) {
    return;
  }

  const currentTurn = ctx.framework.state.status.turn ?? 1;
  const expiresAtTurn = resolveTemporaryEffectExpiryTurn(
    currentTurn,
    effect.duration ?? "this-turn",
  );

  addPlayFromDiscardPermission(ctx.G.playFromDiscardPermissions, cardPlayed.playerId, {
    cardId,
    expiresAtTurn,
    cardType: effect.cardType,
    controllerId: cardPlayed.playerId,
  });
}
